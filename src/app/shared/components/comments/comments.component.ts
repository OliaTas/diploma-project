import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommentType } from 'src/types/comment.type';
import { ActionsService } from '../../services/actions.service';
import { Subscription } from 'rxjs';
import { Actions, ActionType } from 'src/types/action.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ArticleType } from 'src/types/article.type';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})

export class CommentsComponent implements OnInit, OnDestroy {
  @Input() comments: CommentType | null = null;

  @Input() allCommentsCount: number = 0;
  @Input() articleId: string | null = null;
  userActions: { [commentId: string]: Actions } = {};
  readonly actionTypes = Actions;

  private subscription: Subscription = new Subscription();

  constructor(
    private actionsService: ActionsService,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.getLoggedIn() && this.articleId) {
      this.loadUserActions();
    }
  }

  private loadUserActions(): void {
    if (!this.articleId) return;

    this.subscription.add(
      this.actionsService.getArticleCommentActions(this.articleId)
        .subscribe({
          next: (actions: ActionType[]) => {
            actions.forEach(action => {
              this.userActions[action.comment] = action.action;
            });
          },
          error: (error) => {
            console.error('Error loading user actions:', error);
          }
        })
    );
  }


  applyAction(commentId: string, action: Actions): void {
    this.actionsService.applyActionComment(commentId, action).subscribe({
      next: (actionResponse: DefaultResponseType) => {
        if (!actionResponse.error) {
          let message = 'Ваш голос учтен';
          if (action === Actions.VIOLATE) {
            message = 'Жалоба отправлена';
          } else {
            if (this.comments && this.comments.comments) {
              const commentIndex = this.comments.comments.findIndex((item) => item.id === commentId);

              if (commentIndex > -1) {
                const updatedComment = this.comments.comments[commentIndex];
                this.actionsService.getCommentActions(updatedComment.id)
                  .subscribe((userActionsResponse) => {
                    if (userActionsResponse.length > 0) {
                      const userActionsForComment: Actions = userActionsResponse[0].action;
                      if (userActionsForComment === Actions.LIKE) {
                        updatedComment.likesCount += 1;
                        if (updatedComment.actions !== undefined) {
                          updatedComment.dislikesCount = (updatedComment.dislikesCount > 0)
                            ? (updatedComment.dislikesCount - 1) : 0;
                        }
                      } else {
                        updatedComment.dislikesCount += 1;
                        if (updatedComment.actions
                           !== undefined) {
                          updatedComment.likesCount = (updatedComment.likesCount > 0)
                            ? (updatedComment.likesCount - 1) : 0;
                        }
                      }

                      updatedComment.actions = userActionsForComment;
                    } else {
                      if (action === Actions.LIKE) {
                        updatedComment.likesCount = (updatedComment.likesCount > 0)
                          ? (updatedComment.likesCount - 1) : 0;
                      } else if (action === Actions.DISLIKE) {
                        updatedComment.dislikesCount = (updatedComment.dislikesCount > 0)
                          ? (updatedComment.dislikesCount - 1) : 0;
                      }

                      delete this.userActions[updatedComment.id];
                    }

                    if (this.comments && this.comments.comments) {
                      this.comments.comments.splice(commentIndex, 1, updatedComment);
                    }
                  });
              }
            }
          }

          this._snackBar.open(message);
        }
      },

      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error) {
          if (action === Actions.VIOLATE) {
            this._snackBar.open('Жалоба уже отправлена');
          } else if (errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Возникла ошибка');
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}


import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommentType } from 'src/types/comment.type';
import { ActionsService } from '../../services/actions.service';
import { Subscription } from 'rxjs';
import { Actions, ActionType } from 'src/types/action.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/auth/auth.service';

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
    this.subscription.add(
      this.actionsService.getArticleCommentActions(this.articleId!)
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

  hasUserAction(commentId: string, actionType: Actions.LIKE | Actions.DISLIKE): boolean {
    return this.userActions[commentId] === actionType;
  }

  applyAction(commentId: string, action: Actions.LIKE | Actions.DISLIKE): void {
    if (!this.authService.getLoggedIn()) {
      this._snackBar.open('Для выполнения действия необходимо авторизоваться');
      return;
    }

    this.subscription.add(
      this.actionsService.applyActionComment(commentId, action)
        .subscribe({
          next: (result) => {
            let message = 'Ваш голос учтен';
            if ((result as DefaultResponseType).error !== undefined) {
              if (!(result as DefaultResponseType).error) {
                this.updateCommentCounts(commentId, action);
              } else {
                message = (result as DefaultResponseType).message || 'Ошибка при выполнении действия';
              }
            }
            this._snackBar.open(message);
          },
          error: () => {
            this._snackBar.open('Ошибка при выполнении действия');
          }
        })
    );
  }

  reportComment(commentId: string): void {
    if (!this.authService.getLoggedIn()) {
      this._snackBar.open('Для отправки жалобы необходимо авторизоваться');
      return;
    }

    this.subscription.add(
      this.actionsService.applyActionComment(commentId, Actions.VIOLATE)
        .subscribe({
          next: (result) => {
            if ((result as DefaultResponseType).error) {
              this._snackBar.open('Жалоба уже отправлена');
            } else {
              this._snackBar.open('Жалоба отправлена');
            }
          },
          error: (errorResponse) => {
            if (errorResponse.error && errorResponse.error.message === 'Это действие уже применено к комментарию') {
              this._snackBar.open('Жалоба уже отправлена');
            } else {
              this._snackBar.open('Ошибка при отправке жалобы');
            }
          }
        })
    );
  }

  private updateCommentCounts(commentId: string, action: Actions.LIKE | Actions.DISLIKE): void {
    if (!this.comments?.comments) return;

    const comment = this.comments.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (this.userActions[commentId] === Actions.LIKE) comment.likesCount--;
    if (this.userActions[commentId] === Actions.DISLIKE) comment.dislikesCount--;

    if (this.userActions[commentId] === action) {
      delete this.userActions[commentId];
    } else {
      this.userActions[commentId] = action;
      if (action === Actions.LIKE) comment.likesCount++;
      if (action === Actions.DISLIKE) comment.dislikesCount++;
    }
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

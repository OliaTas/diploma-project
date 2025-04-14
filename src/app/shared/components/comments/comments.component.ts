import { Component, Input, OnInit } from '@angular/core';
import { CommentType } from 'src/types/comment.type';
import { ActionsService } from '../../services/actions.service';
import { Subscription } from 'rxjs';
import { ActionType } from 'src/types/action.type';
import { DefaultResponseType } from 'src/types/default-response.type';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() comments: CommentType | null = null;
  @Input() allCommentsCount: number = 0;
  action: ActionType[] | null = null;
  @Input() articleId: string | null = null; 

  private subscription: Subscription = new Subscription();

  constructor(private actionsService: ActionsService) { }

  ngOnInit(): void {
    if (this.articleId) { 
      this.actionsService.getArticleCommentActions(this.articleId)
        .subscribe((data: ActionType[]) => {
          this.action = data;
          console.log(this.action)
        });
    }
  }

}



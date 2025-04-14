import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { CommentsService } from 'src/app/shared/services/comments.service';
import { environment } from 'src/environments/environment';
import { ArticleType } from 'src/types/article.type';
import { CommentType } from 'src/types/comment.type';
import { DefaultResponseType } from 'src/types/default-response.type';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  article: ArticleType | null = null;
  relatedArticle: ArticleType[] = [];
  articleHtml: SafeHtml | null = null;
  serverStaticPath = environment.serverStaticPath;
  isLogged: boolean = false;

  comments: CommentType | null = null;
  commentsOffset = 0;
  allCommentsCount = 0;

  newCommentText: string = '';
  postingComment: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private articlesService: ArticlesService,
    private sanitizer: DomSanitizer, private authService: AuthService, private commentsService: CommentsService
  ) { }

  ngOnInit(): void {
    this.isLogged = this.authService.getLoggedIn();

    this.authService.isLogged$.subscribe((isLoggedIn) => {
      this.isLogged = isLoggedIn;
      if (isLoggedIn) {
        this.loadComments();
      }
    });

    this.activatedRoute.params.subscribe(params => {
      this.articlesService.getArticle(params['url'])
        .subscribe((data: ArticleType) => {
          this.article = data;
          this.articleHtml = this.sanitizer.bypassSecurityTrustHtml(data.text || '');
          // this.commentsOffset = 3;
          this.loadComments();
        });

      this.articlesService.getRelatedArticles(params['url'])
        .subscribe((data: ArticleType[]) => {
          this.relatedArticle = data || [];
        });

    });
  }

  loadComments(): void {
    if (!this.article?.id) return;

    this.commentsService.getComments(this.article.id, this.commentsOffset)
      .subscribe({
        next: (data: CommentType) => {
          this.comments = data;
          this.allCommentsCount = data.allCount;
        },
        error: (error) => {
          console.error('Ошибка при загрузке комментариев:', error);
        }
      });
  }

  addNewComment(): void {
    if (!this.isLogged || !this.article?.id || !this.newCommentText.trim()) {
      return;
    };

    this.postingComment = true;

    this.commentsService.addComment(this.article.id, this.newCommentText)
      .subscribe({
        next: (response: DefaultResponseType) => {
          if (response.error) {
            throw new Error(response.message);
          }

          this.newCommentText = '';
          this.commentsOffset = 0;
          this.loadComments();
        },
        error: (error) => {
          console.error('Ошибка при добавлении комментария:', error);
        },
        complete: () => {
          this.postingComment = false;
        }
      });


  }

  loadMoreComments(): void {
    if (!this.comments || this.comments.comments.length >= this.allCommentsCount) {
      return;
    }

    this.commentsOffset += 10;
    this.loadComments();
  }

}

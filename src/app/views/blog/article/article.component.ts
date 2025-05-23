import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
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
  commentsOffset  = 0;
  allCommentsCount = 0;
  loadingComments = false;
  initialLoadDone = false;

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
          this.commentsOffset = 0;
          this.loadComments();
        });

      this.articlesService.getRelatedArticles(params['url'])
        .subscribe((data: ArticleType[]) => {
          this.relatedArticle = data || [];
        });

    });
  }

  loadComments(): void {
    if (!this.article?.id || this.loadingComments) return;

    this.loadingComments = true;

    const offset = this.initialLoadDone ? this.commentsOffset : 0;

    this.commentsService.getComments(this.article.id, offset)
      .subscribe({
        next: (data: CommentType) => {
          if (!this.initialLoadDone) {

            this.initialLoadDone = true;
            this.commentsOffset = 3;
          } else if (this.comments) {

            data.comments = [...this.comments.comments, ...data.comments];
          }
          this.comments = data;
          this.allCommentsCount = data.allCount;
          this.loadingComments = false;
        },
        error: (error) => {
          console.error('Ошибка при загрузке комментариев:', error);
          this.loadingComments = false;
        }
      });
  }

  addNewComment(): void {
    if (!this.isLogged || !this.article?.id || !this.newCommentText.trim() || this.postingComment) {
      return;
    };

    this.postingComment = true;

    this.commentsService.addComment(this.article.id, this.newCommentText)
      .subscribe({
        next: (response: DefaultResponseType) => {
          if (response.error) {
            throw new Error(response.message);
          }

          this.initialLoadDone = false;
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
    if (this.commentsOffset === undefined) {
      this.commentsOffset = 3; 
    } else {
      this.commentsOffset += 10; 
    }
    this.loadComments();
  }

}
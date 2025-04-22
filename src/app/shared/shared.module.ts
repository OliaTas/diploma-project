import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PopupComponent } from './components/popup/popup.component';
import { SuccessPopupComponent } from './components/success-popup/success-popup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommentsComponent } from './components/comments/comments.component';
import { LoaderComponent } from './components/loader/loader.component';



@NgModule({
  declarations: [ArticleCardComponent, PopupComponent, SuccessPopupComponent, CommentsComponent, LoaderComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  exports: [ArticleCardComponent, PopupComponent, SuccessPopupComponent, CommentsComponent, LoaderComponent],
  entryComponents: [
    PopupComponent, SuccessPopupComponent,
  ]
})
export class SharedModule { }

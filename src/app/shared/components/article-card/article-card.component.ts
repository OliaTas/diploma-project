import { Component, Input, OnInit } from '@angular/core';
import { PopularArticleType } from 'src/types/popular-article.type';

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {
  @Input() article!: PopularArticleType;

  constructor() { }

  ngOnInit(): void {
  }

}

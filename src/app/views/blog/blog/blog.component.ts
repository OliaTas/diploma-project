// import { Component, HostListener, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ArticlesService } from 'src/app/shared/services/articles.service';
// import { CategoryService } from 'src/app/shared/services/category.service';
// import { ActiveParamsType } from 'src/types/active-params.type';
// import { ArticleType } from 'src/types/article.type';
// import { CategoryType } from 'src/types/category.type';

// @Component({
//   selector: 'app-blog',
//   templateUrl: './blog.component.html',
//   styleUrls: ['./blog.component.scss']
// })
// export class BlogComponent implements OnInit {

//   articles: ArticleType[] = [];
//   categories: CategoryType[] = [];
//   activeParams: ActiveParamsType = { page: 1, categories: [] };
//   sortingOpen = false;
//   pages: number[] = [];
//   appliedFilters: { name: string, url: string }[] = [];

//   constructor(private articlesService: ArticlesService,
//      private categoryService: CategoryService,
//     private router: Router,
//     private activatedRoute: ActivatedRoute,
//   ) { }

//   ngOnInit(): void {
//     this.activatedRoute.queryParams.subscribe(params => {
//       this.activeParams.page = params['page'] ? parseInt(params['page']) : 1;
//       this.activeParams.categories = params['categories'] ? Array.isArray(params['categories']) 
//         ? params['categories'] 
//         : [params['categories']] 
//       : [];

//       this.loadArticles();
//     });

//     this.loadCategories();
//   }

//   loadArticles(): void {
//     this.articlesService.getArticles(this.activeParams)
//       .subscribe(data => {
//         this.pages = [];
//         for (let i = 1; i <= data.pages; i++) {
//           this.pages.push(i);
//         }
//         this.articles = data.items;
//       });
//   }

//   loadCategories(): void {
//     this.categoryService.getCategories()
//       .subscribe(data => {
//         this.categories = data;
//       });
//   }

//   isCategoryActive(categoryUrl: string): boolean {
//     return this.activeParams.categories.includes(categoryUrl);
//   }

//   toogleSorting() {
//     this.sortingOpen = !this.sortingOpen;
//   }

//   toggleCategory(categoryUrl: string): void {
//     if (this.activeParams.categories.includes(categoryUrl)) {
//       this.activeParams.categories = this.activeParams.categories.filter(item => item !== categoryUrl);
//       this.appliedFilters = this.appliedFilters.filter(filter => filter.url !== categoryUrl);
//     } else {
//       this.activeParams.categories = [...this.activeParams.categories, categoryUrl];

//     }
//     this.activeParams.page = 1; // Reset to first page when changing categories
//     this.router.navigate(['/articles'], {
//       queryParams: this.activeParams
//     });
//   }

//   openPage(page: number) {
//     this.activeParams.page = page;
//     this.router.navigate(['/articles'], {
//       queryParams: this.activeParams
//     });
//   }

//   openPrevPage() {
//     if (this.activeParams.page && this.activeParams.page > 1) {
//       this.activeParams.page--;
//       this.router.navigate(['/articles'], {
//         queryParams: this.activeParams
//       });
//     }
//   }

//   openNextPage() {
//     const currentPage = this.activeParams.page ? this.activeParams.page : 1;
//     if (currentPage < this.pages.length) {
//       this.activeParams.page = currentPage + 1;
//       this.router.navigate(['/articles'], {
//         queryParams: this.activeParams
//       });
//     }
//   }

//   @HostListener('document: click', ['$event'])
//   click(event: Event) {
//     const sortingElement = document.querySelector('.blog-sorting');
//     if (this.sortingOpen && sortingElement && !(event.target as HTMLElement).closest('.blog-sorting')) {
//       this.sortingOpen = false;
//     }
//   }

// }


// import { Component, HostListener, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ArticlesService } from 'src/app/shared/services/articles.service';
// import { CategoryService } from 'src/app/shared/services/category.service';
// import { ActiveParamsType } from 'src/types/active-params.type';
// import { ArticleType } from 'src/types/article.type';
// import { CategoryType } from 'src/types/category.type';

// @Component({
//   selector: 'app-blog',
//   templateUrl: './blog.component.html',
//   styleUrls: ['./blog.component.scss']
// })
// export class BlogComponent implements OnInit {
//   articles: ArticleType[] = [];
//   categories: CategoryType[] = [];
//   activeParams: ActiveParamsType = { page: 1 };
//   sortingOpen = false;
//   pages: number[] = [];
//   appliedFilters: { name: string, url: string }[] = [];

//   constructor(
//     private articlesService: ArticlesService,
//     private categoryService: CategoryService,
//     private router: Router,
//     private activatedRoute: ActivatedRoute,
//   ) { }

//   ngOnInit(): void {
//     this.loadCategories();

//     this.activatedRoute.queryParams.subscribe(params => {
//       this.activeParams = { page: 1 };

//       if (params['page']) {
//         this.activeParams.page = parseInt(params['page']);
//       }

//       if (params['categories']) {
//         this.activeParams.categories = Array.isArray(params['categories'])
//           ? params['categories']
//           : [params['categories']];
//       }

//       this.updateAppliedFilters();
//       this.loadArticles();
//     });
//   }

//   loadArticles(): void {
//     this.articlesService.getArticles(this.activeParams)
//       .subscribe(data => {
//         this.pages = [];
//         for (let i = 1; i <= data.pages; i++) {
//           this.pages.push(i);
//         }
//         this.articles = data.items;
//       });
//   }

//   loadCategories(): void {
//     this.categoryService.getCategories()
//       .subscribe(data => {
//         this.categories = data;
//         this.updateAppliedFilters();
//       });
//   }

//   updateAppliedFilters(): void {
//     if (this.activeParams.categories && this.categories.length) {
//       this.appliedFilters = this.categories
//         .filter(category => this.activeParams.categories?.includes(category.url))
//         .map(category => ({ name: category.name, url: category.url }));
//     } else {
//       this.appliedFilters = [];
//     }
//   }

//   toggleSorting() {
//     this.sortingOpen = !this.sortingOpen;
//   }

//   toggleCategory(categoryUrl: string): void {
//     const params = { ...this.activeParams };

//     if (!params.categories) {
//       params.categories = [categoryUrl];
//     } else if (params.categories.includes(categoryUrl)) {
//       params.categories = params.categories.filter(item => item !== categoryUrl);
      
//       if (params.categories.length === 0) {
//         params.categories = undefined;
//       }
//     } else {
//       params.categories = [...params.categories, categoryUrl];
//     }
    
//     params.page = 1;
//     this.navigateWithParams(params);
//   }

//   removeFilter(categoryUrl: string, event: Event): void {
//     event.preventDefault();
//     event.stopPropagation();

//     const params = { ...this.activeParams };

//     if (params.categories) {
//       params.categories = params.categories.filter(item => item !== categoryUrl);

//       if (params.categories.length === 0) {
//         delete params.categories;
//       }
//     }

//     params.page = 1;
//     this.navigateWithParams(params);
//   }

//   navigateWithParams(params: ActiveParamsType): void {
//     this.router.navigate(['/articles'], {
//       queryParams: params,
//       queryParamsHandling: 'merge'
//     });
//   }

//   openPage(page: number) {
//     this.navigateWithParams({ ...this.activeParams, page });
//   }

//   openPrevPage() {
//     if (this.activeParams.page && this.activeParams.page > 1) {
//       this.navigateWithParams({ ...this.activeParams, page: this.activeParams.page - 1 });
//     }
//   }

//   openNextPage() {
//     const currentPage = this.activeParams.page || 1;
//     if (currentPage < this.pages.length) {
//       this.navigateWithParams({ ...this.activeParams, page: currentPage + 1 });
//     }
//   }

//   isCategoryActive(categoryUrl: string): boolean {
//     return this.activeParams.categories?.includes(categoryUrl) || false;
//   }

//   @HostListener('document:click', ['$event'])
//   click(event: Event) {
//     const sortingElement = document.querySelector('.blog-sorting');
//     if (this.sortingOpen && sortingElement && !(event.target as HTMLElement).closest('.blog-sorting')) {
//       this.sortingOpen = false;
//     }
//   }
// }

import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ActiveParamsType } from 'src/types/active-params.type';
import { ArticleType } from 'src/types/article.type';
import { CategoryType } from 'src/types/category.type';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  articles: ArticleType[] = [];
  categories: CategoryType[] = [];
  activeParams: ActiveParamsType = { page: 1 };
  sortingOpen = false;
  pages: number[] = [];
  appliedFilters: { name: string, url: string }[] = [];

  constructor(
    private articlesService: ArticlesService,
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    
    this.activatedRoute.queryParams.subscribe(params => {
      this.activeParams = { page: 1 };
      
      if (params['page']) {
        this.activeParams.page = parseInt(params['page']);
      }
      
      if (params['categories']) {
        this.activeParams.categories = Array.isArray(params['categories']) 
          ? params['categories'] 
          : [params['categories']];
      }
      
      this.updateAppliedFilters();
      this.loadArticles();
    });
  }

  loadArticles(): void {
    this.articlesService.getArticles(this.activeParams)
      .subscribe(data => {
        this.pages = [];
        for (let i = 1; i <= data.pages; i++) {
          this.pages.push(i);
        }
        this.articles = data.items;
      });
  }

  loadCategories(): void {
    this.categoryService.getCategories()
      .subscribe(data => {
        this.categories = data;
        this.updateAppliedFilters();
      });
  }

  updateAppliedFilters(): void {
    if (this.activeParams.categories && this.categories.length) {
      this.appliedFilters = this.categories
        .filter(category => this.activeParams.categories?.includes(category.url))
        .map(category => ({ name: category.name, url: category.url }));
    } else {
      this.appliedFilters = [];
    }
  }

  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }

  toggleCategory(categoryUrl: string): void {
    const params = { ...this.activeParams };
    
    if (!params.categories) {
      params.categories = [categoryUrl];
    } else if (params.categories.includes(categoryUrl)) {
      params.categories = params.categories.filter(item => item !== categoryUrl);
      
      if (params.categories.length === 0) {
        params.categories = undefined;
      }
    } else {
      params.categories = [...params.categories, categoryUrl];
    }
    
    // params.page = 1;
    this.navigateWithParams(params);
  }

  removeFilter(categoryUrl: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    const params = { ...this.activeParams };
    
    if (params.categories) {
      params.categories = params.categories.filter(item => item !== categoryUrl);
      
      if (params.categories.length === 0) {
        params.categories = undefined;
      }
    }
    
    params.page = 1;
    this.navigateWithParams(params);
  }

  navigateWithParams(params: ActiveParamsType): void {
    this.router.navigate(['/articles'], {
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  openPage(page: number) {
    this.navigateWithParams({ ...this.activeParams, page });
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.navigateWithParams({ ...this.activeParams, page: this.activeParams.page - 1 });
    }
  }

  openNextPage() {
    const currentPage = this.activeParams.page || 1;
    if (currentPage < this.pages.length) {
      this.navigateWithParams({ ...this.activeParams, page: currentPage + 1 });
    }
  }

  isCategoryActive(categoryUrl: string): boolean {
    return this.activeParams.categories?.includes(categoryUrl) || false;
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    const sortingElement = document.querySelector('.blog-sorting');
    if (this.sortingOpen && sortingElement && !(event.target as HTMLElement).closest('.blog-sorting')) {
      this.sortingOpen = false;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { ArticleType } from 'src/types/article.type';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  articles: ArticleType[] = [];
  services = ['Создание сайтов', 'Продвижение', 'Реклама', 'Копирайтинг'];

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  };

  public swiperConfig: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 1,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      type: 'bullets',
    },
    loop: true,
    speed: 500,
    effect: 'slide',
    watchSlidesProgress: true,
    resistanceRatio: 0,
    slideToClickedSlide: false,
    breakpoints: {
      768: {
        slidesPerView: 1
      },
      992: {
        slidesPerView: 1
      }
    }
  };

  offers = [
    {
      class: 'one',
      title: 'Предложение месяца',
      description: 'Продвижение в Instagram для вашего бизнеса <span class="span">-15%</span> !',
      text: '',
      service: 'Продвижение'
    },
    {
      class: 'two',
      title: 'Акция',
      description: 'Нужен грамотный <span>копирайтер</span> ?',
      text: 'Весь декабрь у нас действует акция на работу копирайтера.',
      service: 'Копирайтинг'
    },
    {
      class: 'three',
      title: 'Новость дня',
      description: '<span>6 место</span> в ТОП-10 SMM-агенств Москвы!',
      text: 'Мы благодарим каждого, кто голосовал за нас!',
      service: 'Реклама'
    }
  ];

  products = [
    {
      title: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 'От 7 500₽',
      image: '../../../assets/images/page/product1.png'
    },
    {
      title: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 'От 3 500₽',
      image: '../../../assets/images/page/product2.png'
    },

    {
      title: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 'От 1 000₽',
      image: '../../../assets/images/page/product3.png'
    },

    {
      title: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 'От 750₽',
      image: '../../../assets/images/page/product4.png'
    },

  ];

  reviews = [
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    }
  ];

  constructor(private sanitizer: DomSanitizer, private articlesService: ArticlesService,
    private popupService: PopupService
  ) {
  }

  ngOnInit(): void {
    this.articlesService.getPopularArticle()
      .subscribe((data: ArticleType[]) => {
        this.articles = data;
      });
  }

  safeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // openConsultation(): void {
  //   const dialogRef = this.popupService.openMainConsultation();

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       console.log('Данные заявки:', result);
  //       this.popupService.openSuccessPopup();
  //     }
  //   });
  // }

  openConsultation(offerIndex: number): void {
    const selectedService = this.offers[offerIndex].service;
    const dialogRef = this.popupService.openProductConsultation(selectedService);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.popupService.openSuccessPopup();
      }
    });
  }

  openProductConsultation(serviceName: string): void {
    const dialogRef = this.popupService.openProductConsultation(serviceName);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.popupService.openSuccessPopup();
      }
    });
  }
}
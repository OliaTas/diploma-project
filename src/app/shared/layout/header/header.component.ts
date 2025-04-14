import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { UserType } from 'src/types/user.type';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  isLogged: boolean = false;
  userName: string | null = null;
  activeLink: string = '';

  private burgerMenu: HTMLElement | null = null;
  private sidebar: HTMLElement | null = null;
  private closeBtn: HTMLElement | null = null;

  constructor(private authService: AuthService, private _snackBar: MatSnackBar,
    private router: Router, private renderer: Renderer2, private el: ElementRef, private userService: UserService) {
    this.isLogged = this.authService.getLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      if (isLoggedIn) {
        this.updateUserName();
      } else {
        this.userName = null;
      }
    });

    if (this.isLogged && !this.userName) {
      this.updateUserName();
    }

    this.detectActiveLink();

    this.router.events.subscribe(() => {
      this.detectActiveLink();
    });
  }

  updateUserName(): void {
    this.userService.getUserInfo()
      .subscribe((data: UserType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.userName = (data as UserType).name;
        console.log(this.userName)
      })
  }

  setActive(link: string): void {
    this.activeLink = link;
  }

  detectActiveLink(): void {
    const url = this.router.url;
    const fragment = this.router.url.split('#')[1];

    if (url.includes('articles')) {
      this.activeLink = 'articles';
    } else if (fragment === 'about') {
      this.activeLink = 'about';
    } else if (fragment === 'reviews') {
      this.activeLink = 'reviews';
    } else if (url.includes('contacts')) {
      this.activeLink = 'contacts';
    } else {
      this.activeLink = 'products';
    }
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogOut();
        },
        error: () => {
          this.doLogOut();
        }
      });

  }

  doLogOut(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.userName = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  ngAfterViewInit(): void {
    this.burgerMenu = this.el.nativeElement.querySelector('#burger-menu');
    this.sidebar = this.el.nativeElement.querySelector('#sidebar');
    this.closeBtn = this.el.nativeElement.querySelector('#close-btn');

    if (this.burgerMenu && this.sidebar && this.closeBtn) {
      this.renderer.listen(this.burgerMenu, 'click', () => {
        this.sidebar?.classList.add('active');
      });

      this.renderer.listen(this.closeBtn, 'click', () => {
        this.sidebar?.classList.remove('active');
      });

      this.renderer.listen(document, 'click', (event: Event) => {
        if (
          this.sidebar &&
          this.burgerMenu &&
          !this.sidebar.contains(event.target as Node) &&
          !this.burgerMenu.contains(event.target as Node)
        ) {
          this.sidebar.classList.remove('active');
        }
      });
    }
  }

}

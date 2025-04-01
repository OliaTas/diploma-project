import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agreement-page',
  templateUrl: './agreement-page.component.html',
  styleUrls: ['./agreement-page.component.scss']
})
export class AgreementPageComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) { 
        this.scrollToAnchor(fragment);
      }
    });
  }

  private scrollToAnchor(anchor: string): void {
    if (anchor) {
      setTimeout(() => {
        const element = document.getElementById(anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // Небольшая задержка для гарантированной прокрутки
    }
  }

}

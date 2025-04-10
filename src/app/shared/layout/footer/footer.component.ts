import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'footer-component',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: number;

  constructor(private dialog: MatDialog, private popupService: PopupService) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
  }

  openConsultation(): void {
    const dialogRef = this.popupService.openFooterConsultation();
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.popupService.openSuccessPopup();
      }
    });
  }

}

import { Injectable } from '@angular/core';
import { PopupComponent } from '../components/popup/popup.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessPopupComponent } from '../components/success-popup/success-popup.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private dialog: MatDialog) { }

  openSuccessPopup(): void {
    this.dialog.open(SuccessPopupComponent, {
      width: '727px',
      disableClose: true
    });
  }

  openFooterConsultation(): MatDialogRef<PopupComponent> {
    return this.dialog.open(PopupComponent, {
      width: '727px',
      data: { 
        title: 'Закажите бесплатную консультацию!',
        formType: 'footer',
        buttonText: 'Заказать консультацию'
      },
      disableClose: true
    });
  }
  
  openMainConsultation(): MatDialogRef<PopupComponent> {
    return this.dialog.open(PopupComponent, {
      width: '727px',
      data: { 
        title: 'Заявка на услугу',
        formType: 'main',
        buttonText: 'Оставить заявку'
      },
      disableClose: true
    });
  }

  openProductConsultation(serviceName: string): MatDialogRef<PopupComponent> {
    return this.dialog.open(PopupComponent, {
      width: '727px',
      data: { 
        title: 'Заявка на услугу',
        formType: 'product',
        buttonText: 'Оставить заявку',
        selectedService: serviceName
      },
      disableClose: true
    });
  }
}

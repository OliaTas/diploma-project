import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  consultationForm: FormGroup;
  services = [
    'Создание сайтов',
    'Продвижение',
    'Реклама',
    'Копирайтинг'
  ];
  errorMessage: string | null = null;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder, private http: HttpClient, private popupService: PopupService,
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      formType: 'main' | 'footer' | 'product';
      buttonText: string;
      selectedService?: string;
    }
  ) {
    this.consultationForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      serviceName: [data.selectedService || ''],
      type: [data.formType === 'footer' ? 'consultation' : 'order']
    });

    if (data.formType === 'product' && data.selectedService) {
      this.consultationForm.get('serviceName')?.setValue(data.selectedService);
    }
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.consultationForm.invalid) {
      return;
    }
  
    this.errorMessage = null;
  
    if (this.data.formType === 'product') {
      const requestData = {
        name: this.consultationForm.value.name,
        phone: this.consultationForm.value.phone,
        service: this.consultationForm.value.serviceName,
        type: 'order'
      };
  
      this.http.post(environment.api + 'requests', requestData).subscribe({
        next: (response: any) => {
          if (!response.error) {
            this.handleSuccess();
          } else {
            this.errorMessage = response.message;
          }
        },
        error: () => {
          this.errorMessage = 'Произошла ошибка при отправке формы, попробуйте еще раз.';
        }
      });
    } else {
      this.handleSuccess();
    }
  }
  
  private handleSuccess(): void {
    this.isSubmitted = true;
    this.dialogRef.close(this.consultationForm.value);
    if (this.data.formType === 'product') {
      this.popupService.openSuccessPopup();
    }
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatButtonModule,
  MatRippleModule,
  MatSnackBarModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule
} from '@angular/material';

import { Addon } from '@materia/addons';

import { StripeViewComponent } from './stripe-view/stripe-view.component';
import { StripeSetupComponent } from './stripe-setup/stripe-setup.component';

@Addon('@materia/stripe')
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule
  ],
  declarations: [StripeViewComponent, StripeSetupComponent],
  exports: [StripeViewComponent, StripeSetupComponent],
  entryComponents: [StripeSetupComponent]
})
export class AddonBoilerplateModule {}

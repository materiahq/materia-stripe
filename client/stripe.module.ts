import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';


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
    MatCheckboxModule,
    MatRadioModule,
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


import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AddonSetup } from '@materia/addons';

export interface IStripeSetup {
    name: string;
}

@AddonSetup('@materia/stripe')
@Component({
    selector: 'materia-stripe-setup',
    templateUrl: './stripe-setup.component.html',
    styleUrls: ['./stripe-setup.component.scss'],
    providers: []
})
export class StripeSetupComponent implements OnInit {
    @Input() app;
    @Input() settings;

    @Output() save = new EventEmitter<IStripeSetup>();
    @Output() cancel = new EventEmitter<void>();

    form: FormGroup;

    get apikeyRequiredError() { return this.form.get('apikey').hasError('required'); }

    constructor() { }

    ngOnInit() {
        this.form = new FormGroup({
            apikey: new FormControl(this.settings && this.settings.apikey ? this.settings.apikey : '', Validators.required),
            vat: new FormControl(
                this.settings && (this.settings.tax_percent || this.settings.eu_vat) ? true : false
            ),
            vat_type: new FormControl(this.settings && this.settings.public_key ? this.settings.public_key : 'eu'),
            tax_percent: new FormControl(this.settings && this.settings.public_key ? this.settings.public_key : '')
        });
    }

    saveClick() {
        if (this.form.valid) {
            const res: any = {
                apikey: this.form.value.apikey
            };
            if (this.form.value.vat) {
                if (this.form.value.vat_type === 'eu') {
                    res.eu_vat = true;
                } else if (this.form.value.tax_percent) {
                    res.tax_percent = this.form.value.tax_percent;
                }
            }
            this.save.emit(res);
        } else {
            console.log(this.form.errors);
        }
    }
}

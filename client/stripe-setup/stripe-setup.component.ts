
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

    get requiredError() { return this.form.get('name').hasError('required'); }

    constructor() { }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl(this.settings && this.settings.name ? this.settings.name : '', Validators.required)
        });
    }

    saveClick() {
        if (this.form.valid) {
            this.save.emit(this.form.value);
        }
    }
}

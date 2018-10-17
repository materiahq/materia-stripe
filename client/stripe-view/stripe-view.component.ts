
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddonView } from '@materia/addons';

@AddonView('@materia/stripe')
@Component({
    selector: 'materia-stripe',
    templateUrl: './stripe-view.component.html',
    styleUrls: ['./stripe-view.component.scss'],
    providers: []
})
export class StripeViewComponent implements OnInit {
    @Input() app;
    @Input() settings;

    @Output() openSetup = new EventEmitter<void>();

    constructor() { }

    ngOnInit() {
    }
}

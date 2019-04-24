const stripe = require('stripe');

module.exports = class StripeInvoiceModel {
  constructor(app, model) {
    this.app = app;
    this.model = model;

    this.config = this.app.addons.addonsConfig['@materia/stripe'];
    this.stripe = stripe(this.config.apikey);
  }

  list(params) {
    this.app.logger.log('listing invoices' + JSON.stringify(params));
    return this.stripe.invoices.list(params);
  }
}
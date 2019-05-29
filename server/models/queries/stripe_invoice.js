const stripe = require('stripe');
const stripPagination = require('../lib/strip-pagination');

module.exports = class StripeInvoiceModel {
  constructor(app, model) {
    this.app = app;
    this.model = model;

    this.config = this.app.addons.addonsConfig['@materia/stripe'];
    this.stripe = stripe(this.config.apikey);
  }

  listByCustomer(params) {
    return this.stripe.invoices.list(stripPagination(params));
  }

  list(params) {
    return this.stripe.invoices.list(stripPagination(params));
  }
}
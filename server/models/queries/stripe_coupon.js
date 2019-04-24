const stripe = require('stripe');

module.exports = class StripeCouponModel {
  constructor(app, model) {
    this.app = app;
    this.model = model;

    this.config = this.app.addons.addonsConfig['@materia/stripe'];
    this.stripe = stripe(this.config.apikey);
  }

  list(params) {
    return this.stripe.coupons.list(params);
  }

  create(params) {
    return this.stripe.coupons.create(params);
  }

  delete(params) {
    return this.stripe.coupons.delete(params);
  }
}
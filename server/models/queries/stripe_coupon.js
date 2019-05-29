const stripe = require('stripe');
const stripPagination = require('../lib/strip-pagination');

module.exports = class StripeCouponModel {
  constructor(app, model) {
    this.app = app;
    this.model = model;

    this.config = this.app.addons.addonsConfig['@materia/stripe'];
    this.stripe = stripe(this.config.apikey);
  }

  get(params) {
    return this.stripe.coupons.retrieve(params.coupon);
  }

  list(params) {
    return this.stripe.coupons.list(stripPagination(params));
  }

  create(params) {
    return this.stripe.coupons.create(params);
  }

  delete(params) {
    return this.stripe.coupons.delete(params);
  }
}
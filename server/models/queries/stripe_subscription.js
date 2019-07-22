const stripe = require('stripe');
const vatCountries = require('../../vat_countries');
const stripPagination = require('../lib/strip-pagination');

module.exports = class StripeCustomerModel {
	constructor(app, model) {
		this.app = app;
		this.model = model;

		this.config = this.app.addons.addonsConfig['@materia/stripe'];
		this.stripe = stripe(this.config.apikey);
	}

	list(params) {
		return this.stripe.subscriptions.list(stripPagination(params))
	}

	create(params) {
    let items = [];
    if (typeof params.plans == 'string') {
      items = [
        {
          plan: params.plans
        }
      ];
    } else if (params.plans.length > 0) {
      items = params.plans
    } else {
      return Promise.reject('invalid params `plans`');
    }
		const sub = {
			customer: params.id_customer,
			items: items
		};
		if (this.config.eu_vat && !params.vat_number && params.customer_country) {
			sub.tax_percent = vatCountries[params.customer_country] || 0;
		} else if (this.config.tax_percent) {
			sub.tax_percent = this.config.tax_percent;
		}
		if (params.coupon) {
			sub.coupon = params.coupon;
		}
		return this.stripe.subscriptions.create(sub);
	}

	delete(params) {
		return this.app.entities
			.get('stripe_customer')
			.getQuery('getByUserId')
			.run({
				id_user: params.id_user
			})
			.then(customer => {
				if (
					customer.subscriptions.data.find(
						sub => sub.id == params.id_subscription
					)
				) {
					if (params.cancel_unsubscribe) {
						return this.stripe.subscriptions.update(params.id_subscription, {
							cancel_at_period_end: false
						});
					} else if (params.cancel_at_period_end) {
						return this.stripe.subscriptions.update(params.id_subscription, {
							cancel_at_period_end: true
						});
					} else {
						return this.stripe.subscriptions.del(params.id_subscription);
					}
				} else {
					return Promise.reject(new Error('Subscription not found'));
				}
			})
	}

	update(params) {
    this.app.logger.log('params: ' + JSON.stringify(params));
		return this.app.entities
			.get('stripe_customer')
			.getQuery('getByUserId')
			.run({
				id_user: params.id_user
			})
			.then(customer => {
				if (
					customer.subscriptions.data.find(
						sub => sub.id == params.id_subscription
					)
				) {
          return this.stripe.subscriptions.update(params.id_subscription, {
            items: params.plans
          });
				} else {
					return Promise.reject(new Error('Subscription not found'));
				}
			});
	}
}

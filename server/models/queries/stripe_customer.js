const stripe = require('stripe');

module.exports = class StripeCustomerModel {
  constructor(app, model) {
    this.app = app;
    this.model = model;

    this.config = this.app.addons.addonsConfig['@materia/stripe'];
    this.stripe = stripe(this.config.apikey);
  }

  list(params) {
    return this.stripe.customers.list(params);
  }

  get(params) {
    return this.stripe.customers.retrieve(params.id_customer).then(customer => {
      if (!customer || (customer && customer.deleted)) {
        return Promise.reject(new Error('customer deleted'));
      }
      return customer;
    });
  }

  getByUserId(params) {
    return this.app.entities
      .get('user')
      .getQuery('get')
      .run({
        id_user: params.id_user
      })
      .then(user => {
        if (user.id_stripe) {
          return this.get({
            id_customer: user.id_stripe
          });
        } else {
          return Promise.reject(user);
        }
      });
  }

  getOrCreate(params) {
    this.getByUserId({
      id_user: params.id_user
    })
      .then(customer => {
        return this.stripe.customers
          .createSource(customer.id, {
            source: params.cardToken
          })
          .then(() => customer);
      })
      .catch(user => {
        return this.stripe.customers
		.create({
		  email: user.email,
		  source: params.cardToken
		})
		.then(customer => {
		  return this.app.entities
			.get('user')
			.getQuery('update')
			.run({
			  id_user: params.id_user,
			  id_stripe: customer.id
			})
			.then(() => customer);
		});
      });
  }

  create(params) {
    return this.stripe.customers.create(params);
  }

  update(params) {
    return this.stripe.customers.update(params);
  }

  delete(params) {
    return this.stripe.customers.delete(params);
  }
};

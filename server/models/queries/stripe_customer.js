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
          }).catch(e => {
            return Promise.reject(user);
          });
        } else {
          return Promise.reject(user);
        }
      });
  }

  _getCustomerData(params) {
    const result = {};
    if (params.address && params.name) {
      result.shipping = {
        address: {
          line1: params.address,
          country: params.country,
          city: params.city,
          postal_code: params.postal_code,
          state: params.state
        },
        name: params.name
      };
    }
    if (params.tax_info) {
      result.tax_info = this._getTaxObject(params.tax_info);
    }
    return result;
  }

  _getTaxObject(tax_info) {
    return {
      tax_id: tax_info,
      type: 'vat'
    };
  }

  getOrCreate(params) {
    return this.getByUserId({
      id_user: params.id_user
    })
      .then(customer => {
        return this.stripe.customers
          .createSource(customer.id, {
            source: params.card_token
          })
          .then(() => {
            if (!params.address && !params.country && !params.tax_info) {
              return this.stripe.customers.retrieve(customer.id);
            }
            return this.stripe.customers.update(
              customer.id,
              this._getCustomerData(params)
            );
          });
      })
      .catch(user => {
        const baseCustomerData = {
          email: user.email,
          source: params.card_token
        };
        const customerData = Object.assign(
          {},
          baseCustomerData,
          this._getCustomerData(params)
        );

        return this.stripe.customers.create(customerData).then(customer => {
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

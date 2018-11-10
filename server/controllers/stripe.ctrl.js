var stripe = require('stripe');
const vatCountries = require('../vat_countries');
module.exports = class StripeCtrl {
  constructor(app) {
    this.app = app;
    this.config = this.app.addons.addonsConfig['@materia/stripe'];
    this.stripe = stripe(this.config.apikey);
  }

  getCustomer(req, res, next) {
    this.app.entities
      .get('stripe_customer')
      .getQuery('getByUserId')
      .run({
        id_user: req.user.id_user
      })
      .then(customer => {
        res.status(200).send(customer);
      })
      .catch(e => {
        res.status(404).send();
      });
  }

  updateSubscription(req, res, next) {
    this.app.entities
      .get('stripe_customer')
      .getQuery('getByUserId')
      .run({
        id_user: req.user.id_user
      })
      .then(customer => {
        if (
          customer.subscriptions.data.find(
            sub => sub.id == req.params.subscription
          )
        ) {
          return this.stripe.subscriptions.update(req.params.subscription, {
            items: req.body.plans.split(',').map(plan => {
              return {
                plan: plan
              };
            })
          });
        } else {
          return Promise.reject(new Error('Subscription not found'));
        }
      })
      .then(() => {
        res.status(200).send();
      })
      .catch(e => {
        res.status(400).send(e);
      });
  }

  unsubscribe(req, res, next) {
    this.app.entities
      .get('stripe_customer')
      .getQuery('getByUserId')
      .run({
        id_user: req.user.id_user
      })
      .then(customer => {
        if (
          customer.subscriptions.data.find(
            sub => sub.id == req.params.subscription
          )
        ) {
          if (req.query.cancel_unsubscribe) {
            return this.stripe.subscriptions.update(req.params.subscription, {
              cancel_at_period_end: false
            });
          } else if (req.query.cancel_at_period_end) {
            return this.stripe.subscriptions.update(req.params.subscription, {
              cancel_at_period_end: true
            });
          } else {
            return this.stripe.subscriptions.del(req.params.subscription);
          }
        } else {
          return Promise.reject(new Error('Subscription not found'));
        }
      })
      .then(subscription => {
        res.status(200).send(subscription);
      })
      .catch(e => {
        res.status(400).send(e);
      });
  }

  subscribe(req, res, next) {
    this.app.logger.log(JSON.stringify(req.user), JSON.stringify(req.body));
    const params = {
      id_user: req.user.id_user,
      card_token: req.body.card_token,
      name: req.body.name,
      address: req.body.address,
      country: req.body.country,
      postal_code: req.body.postal_code,
      state: req.body.state
    };
    if (req.body.tax_info) {
      params.tax_info = req.body.tax_info
    }
    this.app.entities
      .get('stripe_customer')
      .getQuery('getOrCreate')
      .run(params)
      .then(customer => {
        console.log('customer', customer.sources.data[0]);
        const sub = {
          customer: customer.id,
          items: req.body.plans.split(',').map(plan => {
            return {
              plan: plan
            };
          })
        };
        if (this.config.eu_vat && !req.body.vat_number) {
          console.log('tax', vatCountries, customer.sources.data[0].address_country)
          sub.tax_percent = vatCountries[customer.sources.data[0].address_country] || 0;
        } else if (this.config.tax_percent) {
          sub.tax_percent = this.config.tax_percent;
        }
        console.log('sub data', sub);
        return this.stripe.subscriptions.create(sub);
      })
      .then(subscription => {
        this.app.logger.log(JSON.stringify(subscription));
        res.status(200).json(subscription);
      })
      .catch(err => {
        this.app.logger.log('ERROR' + JSON.stringify(err.message));
        res.status(400).json({
          message: err.message
        });
      });
  }
};
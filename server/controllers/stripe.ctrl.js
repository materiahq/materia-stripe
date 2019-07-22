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
    this.app.entities.get('stripe_subscription').getQuery('update').run({
      id_user: req.user.id_user,
      id_subscription: req.params.subscription,
      plans: req.body.plans
    }).then(r => {
      res.status(200).send(r);
    })
    .catch(e => {
      res.status(400).send(e);
    });
  }

  unsubscribe(req, res, next) {
    this.app.entities.get('stripe_subscription').getQuery('delete').run({
      id_user: req.user.id_user,
      cancel_at_period_end: !! req.query.cancel_at_period_end,
      cancel_unsubscribe: !! req.query.cancel_unsubscribe,
      id_subscription: req.params.subscription
    }).then(subscription => {
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
        return this.app.entities.get('stripe_subscription').getQuery('create').run({
          id_customer: customer.id,
          customer_country: customer.sources.data[0].address_country,
          vat_number: req.body.vat_number,
          plans: req.body.plans,
          coupon: req.body.coupon
        })
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

  getInvoices(req, res) {
    this.app.entities
      .get('stripe_customer')
      .getQuery('getByUserId')
      .run({
        id_user: req.user.id_user
      }).then(stripeUser => {
        const params = Object.assign({}, req.query, {
          customer: stripeUser.id
        })
        return this.app.entities.get('stripe_invoice').getQuery('list').run(params);
      }).then(result => {
        res.status(200).json(result);
      }).catch(err => {
        res.status(400).json({
          error: true,
          message: err.message
        });
      })
  }
};

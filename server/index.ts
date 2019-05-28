export default class Stripe {
  public static displayName = 'Stripe';
  public static logo =
    'https://materiahq.github.io/materia-website-content/logo/addons/stripe.png';

  // public static installSettings = [
  //   {
  //     name: 'apikey',
  //     description: 'Enter your Stripe API Key',
  //     type: 'string',
  //     required: true
  //   }
  // ];

  constructor(private app, private config) {}

  afterLoadEntities() {
    if ( ! this.app.database.disabled) {
      const userEntity = this.app.entities.get('user');
      return userEntity.addField({
        name: 'id_stripe',
        type: 'string',
        required: false,
        read: true,
        write: true,
        primary: false
      }, {
        apply: true,
        db: false,
        save: false,
        history: false,
        generateQueries: true
      });
    } else {
      return Promise.resolve();
    }
  }

  start() {}

  uninstall(app) {}
}

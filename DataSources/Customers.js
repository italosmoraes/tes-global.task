import customers from '../customers.json' assert { type: 'json' }

export class CustomersDataSource {
  static records = customers
}

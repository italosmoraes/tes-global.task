import orders from '../orders.json' assert { type: 'json' }

export class OrdersDataSource {
  static records = orders
}

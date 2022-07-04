import products from '../products.json' assert { type: 'json' }

export class ProductsDataSource {
  static records = products
}

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser'
import { UsersDataSource } from './DataSources/Users.js'
import { OrdersDataSource } from './DataSources/Orders.js'
import { CustomersDataSource } from './DataSources/Customers.js'
import { ProductsDataSource } from './DataSources/Products.js'
import { DateTime } from 'luxon'

const port = process.env.PORT || 8080
const server = express()

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

// -- middleware

server.use(bodyParser.urlencoded({ extended: false }))

// -- page resolvers

server.get('/', (request, response) => {
  response.end('tes-global server!')
})

server.get('/static', (request, response) => {
  response.sendFile(path.join(__dirname, '/static/index.html'))
})

server.get('/login.html', (request, response) => {
  response.sendFile(path.join(__dirname, '/static/login.html'))
})

server.get('/show.html', (request, response) => {
  response.sendFile(path.join(__dirname, '/static/show.html'))
})

// -- auth resolver

server.post('/auth', (request, response) => {
  console.log(JSON.stringify(request.body, null, 2))
  console.log(UsersDataSource)

  const user = UsersDataSource.records.find((r) => r.username === request.body.username)

  if (!user) {
    response.redirect('/login.html')
  } else {
    if (user.password !== request.body.password) {
      response.redirect('/login.html')
    }

    response.sendFile(path.join(__dirname, '/static/home.html'))
  }
})

// --- business resolvers

server.get('/show', (request, response) => {
  console.log(JSON.stringify(OrdersDataSource.records), null, 2)

  const parseOrderItem = (order, item) => {
    const buyer = CustomersDataSource.records.find((c) => c.name === order.buyer)

    const product = ProductsDataSource.records.find((p) => p.name === item.item)

    const shippingTarget = DateTime.fromFormat(
      `${order.shippingDate} ${order.shippingTime}`,
      'YYYY-MM-DD HH:MM'
    )
      .toUTC()
      .toMillis()

    return {
      buyer: buyer.name,
      productId: product.productId,
      quantity: item.quantity,
      shippingAddress: buyer.address,
      shippingTarget: shippingTarget
    }
  }

  const orderItems = []
  for (const order of OrdersDataSource.records) {
    order.items.forEach((item) => orderItems.push(parseOrderItem(order, item)))
  }

  console.log(JSON.stringify(orderItems, null, 2))
  response.send(orderItems)
})

// ---

server.listen(port, () => {
  console.log(`--- TES GLOBAL API listening on port ${port} `)
})

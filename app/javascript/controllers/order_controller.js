import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["orderProducts"]
  addProduct(event) {
    event.preventDefault()
    const content = this.element.querySelector('.order-product-fields').innerHTML
    const newProduct = content.replace(/order_products_attributes_\d+_/g, `order_products_attributes_${new Date().getTime()}_`)
    this.element.querySelector('#order_products').insertAdjacentHTML('beforeend', newProduct)
  }
  
  removeProduct(event) {
    event.preventDefault()
    const productField = event.target.closest('.flex')
    productField.remove()
  }
}

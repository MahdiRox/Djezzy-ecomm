import { Controller } from "@hotwired/stimulus"
import { Turbo } from "@hotwired/turbo-rails"
// Connects to data-controller="products"
export default class extends Controller {
  static values = { product: Object }
  addToCart() {
    let cartArray
    console.log(this.productValue)
    const cart = localStorage.getItem("cart")
    if (cart) {
      cartArray = JSON.parse(cart)
      const foundIndex = cartArray.findIndex(item => item.id === this.productValue.id)
      if(foundIndex >= 0) {
        cartArray[foundIndex].quantity = parseInt(cartArray[foundIndex].quantity) + 1
      } else {
        cartArray.push({
          id: this.productValue.id,
          name: this.productValue.name,
          price: this.productValue.price,
          quantity: 1
        })
        Turbo.visit(window.location)
      }
      localStorage.setItem("cart", JSON.stringify(cartArray))
    } else {
      cartArray = []
      cartArray.push({
        id: this.productValue.id,
        name: this.productValue.name,
        price: this.productValue.price,
        quantity: 1
      })
      localStorage.setItem("cart", JSON.stringify(cartArray))
      Turbo.visit(window.location)
    }
    const event = new CustomEvent("cart:updated", {
      bubbles: true
    })
    window.dispatchEvent(event)
  }
}

import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="cart"
export default class extends Controller {
  initialize() {
    console.log('cart controller initialized')
    const cart = JSON.parse(localStorage.getItem('cart'))
    if (!cart) {
      return
    }
    let total = 0
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i]
      total += cart[i].price * cart[i].quantity
      const div = document.createElement('div')
      div.classList.add('mt-2')
      div.innerHTML = `Item: ${item.name} -  ${item.price} DZ - Quantity: ${item.quantity}`
      const deleteButton = document.createElement('button')
      deleteButton.innerText = 'Remove'
      deleteButton.value = item.id
      deleteButton.classList.add("bg-gray-500", "rounded", "text-white", "px-2", "py-1", "ml-2")
      deleteButton.addEventListener("click", this.removeFromCart)
      div.appendChild(deleteButton)
      this.element.prepend(div)
    }
    const totalEl = document.createElement('div')
    totalEl.innerText = `Total:  ${total} DZ`
    let totalContainer = document.getElementById('total')
    totalContainer.appendChild(totalEl)
  }
  clearCart() {
    localStorage.removeItem('cart')
    window.location.reload()
  }
  removeFromCart(event) {
    const cart = JSON.parse(localStorage.getItem('cart'))
    const id = event.target.value
    const index = cart.findIndex(item => item.id === id)
    cart.splice(index, 1)
    localStorage.setItem('cart', JSON.stringify(cart))
    window.location.reload()
  }
  checkout() {
    console.log('checkout')
    const cart = JSON.parse(localStorage.getItem('cart'))
    const payload = {
      authenticity_token: document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      cart: cart
    }
    const csrfToken = document.querySelector('[name="csrf-token"]').content
    fetch('/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "x-csrf-token": csrfToken
      },
      body: JSON.stringify(payload)
    }).then(response => {
      if (response.ok) {
        window.location.href = body.url
      } else {
        const errorEl = document.createElement('div')
        errorEl.innerText = `There was an error processing your request. Please try again. ${body.error}`
        let errorContainer = document.getElementById('errorContainer')
        errorContainer.appendChild(errorEl) 
      }
    })
  }
}

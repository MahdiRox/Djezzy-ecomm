import { Controller } from "@hotwired/stimulus"
import { Turbo } from "@hotwired/turbo-rails"

// Connects to data-controller="cart"
export default class extends Controller {
  static targets = ["count"]

  handleCartUpdated(event) {
    const cart = JSON.parse(localStorage.getItem("cart"))
    if (!cart) {
      this.updateCount(0)
      return
    }
  
    let totalItems = 0
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i]
      totalItems += item.quantity
    }
    this.updateCount(totalItems)
  }

  initialize() {
    const event = new CustomEvent("cart:updated")
    event.preventDefault()
    console.log("cart controller initialized")
    const cart = JSON.parse(localStorage.getItem("cart"))
    if (!cart) {
      this.updateCount(0)
      return
    }
    
    let totalItems = 0
    let total = 0
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i]
      
      total += item.price * item.quantity
      totalItems += item.quantity
      const div = document.createElement("div")
      div.classList.add("mt-2")
      div.innerText = `Item: ${item.name} - ${item.price.toLocaleString(
        "fr-DZ",
        { style: "currency", currency: "DZD" }
      )} - Quantity: ${item.quantity}`;
      const deleteButton = document.createElement("button")
      deleteButton.innerText = "Remove"
      console.log("item.id: ", item.id)
      deleteButton.value = JSON.stringify({id: item.id})
      deleteButton.classList.add("bg-gray-500", "rounded", "text-white", "px-2", "py-1", "ml-2")
      deleteButton.addEventListener("click", this.removeFromCart)
      div.appendChild(deleteButton)
      this.element.prepend(div)
      const addOneButton = document.createElement("button")
      addOneButton.innerText = "add one"
      addOneButton.value = JSON.stringify({id: item.id})
      addOneButton.classList.add("bg-gray-500", "rounded", "text-white", "px-2", "py-1", "ml-2")

      addOneButton.addEventListener("click", this.addOneToCart)
      div.appendChild(addOneButton)

    }
    this.updateCount(totalItems)

    const totalEl = document.createElement("div")
  
    totalEl.innerText = `Total: ${total.toLocaleString("fr-DZ", {
      style: "currency",
      currency: "DZD",
    })}`;
    let totalContainer = document.getElementById("total")
    if (totalContainer) {
      totalContainer.appendChild(totalEl)
    } else {
      console.error('Element with ID "total" not found')
    }
    window.addEventListener("cart:updated", this.handleCartUpdated.bind(this))
  }
  updateCount(count) {
    this.countTarget.textContent = count
  }

  clearCart() {
    localStorage.removeItem("cart")
    Turbo.visit(window.location)
  }

  removeFromCart(event) {
    const cart = JSON.parse(localStorage.getItem("cart"))
    const values = JSON.parse(event.target.value)
    const {id} = values
    const index = cart.findIndex(item => item.id === id)
    if (index >= 0) {
      const item = cart[index]
      item.quantity -= 1
      if (item.quantity <= 0) {
        cart.splice(index, 1)
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart))
    
    Turbo.visit(window.location)
  }
  addOneToCart(event) {
    const cart = JSON.parse(localStorage.getItem("cart"))
    const values = JSON.parse(event.target.value)
    const {id} = values
    const index = cart.findIndex(item => item.id === id)
    if (index >= 0) {
      const item = cart[index]
      item.quantity += 1
    }
    localStorage.setItem("cart", JSON.stringify(cart))
    Turbo.visit(window.location)
  }

  checkout() {
    const cart = JSON.parse(localStorage.getItem("cart"))
    const payload = {
      authenticity_token: "",
      cart: cart
    }
  
    const csrfToken = document.querySelector("[name='csrf-token']").content
  
    fetch("/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
      body: JSON.stringify(payload)
    }).then(response => {
        if (response.ok) {
          response.json().then(body => {
            if (body.url) {
              localStorage.removeItem("cart")
              window.location.href = body.url; // Navigate to success URL
            } else if (body.error) {
              // Handle potential error response even when response.ok is true
              const errorEl = document.createElement("div");
              errorEl.innerText = `Error: ${body.error}`;
              let errorContainer = document.getElementById("errorContainer");
              if (!errorContainer) {
                errorContainer = document.createElement("div");
                errorContainer.id = "errorContainer";
                document.body.appendChild(errorContainer);
              }
              errorContainer.appendChild(errorEl);
            }
          })
        } else {
          // Handle non-200 responses with potential custom error message
          response.json().then(body => {
            const errorEl = document.createElement("div");
            errorEl.innerText = `There was an error processing your order. ${body.error}`;
            let errorContainer = document.getElementById("errorContainer");
            if (!errorContainer) {
              errorContainer = document.createElement("div");
              errorContainer.id = "errorContainer";
              document.body.appendChild(errorContainer);
            }
            errorContainer.appendChild(errorEl);
          })
        }
      }).catch(error => {
        console.error('Error:', error);
        const errorEl = document.createElement("div");
        errorEl.innerText = `There was an error processing your order: ${error}`;
        let errorContainer = document.getElementById("errorContainer");
        if (!errorContainer) {
          errorContainer = document.createElement("div");
          errorContainer.id = "errorContainer";
          document.body.appendChild(errorContainer);
        }
        errorContainer.appendChild(errorEl);
      });
  }
}
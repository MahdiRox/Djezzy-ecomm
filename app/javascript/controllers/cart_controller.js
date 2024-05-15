import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="cart"
export default class extends Controller {
  initialize() {

    console.log("cart controller initialized")
    const cart = JSON.parse(localStorage.getItem("cart"))
    if (!cart) {
      return
    }

    let total = 0
    for (let i=0; i < cart.length; i++) {
      const item = cart[i]
      total += item.price * item.quantity
      const div = document.createElement("div")
      div.classList.add("mt-2")
      div.innerText = `Item: ${item.name} - $${item.price} - Quantity: ${item.quantity}`
      const deleteButton = document.createElement("button")
      deleteButton.innerText = "Remove"
      console.log("item.id: ", item.id)
      deleteButton.value = JSON.stringify({id: item.id})
      deleteButton.classList.add("bg-gray-500", "rounded", "text-white", "px-2", "py-1", "ml-2")
      deleteButton.addEventListener("click", this.removeFromCart)
      div.appendChild(deleteButton)
      this.element.prepend(div)
    }

    const totalEl = document.createElement("div")
    totalEl.innerText= `Total: $${total}`
    let totalContainer = document.getElementById("total")
    totalContainer.appendChild(totalEl)
  }

  clear() {
    localStorage.removeItem("cart")
    window.location.reload()
  }

  removeFromCart(event) {
    const cart = JSON.parse(localStorage.getItem("cart"))
    const values = JSON.parse(event.target.value)
    const {id, size} = values
    const index = cart.findIndex(item => item.id === id)
    if (index >= 0) {
      cart.splice(index, 1)
    }
    localStorage.setItem("cart", JSON.stringify(cart))
    window.location.reload()
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

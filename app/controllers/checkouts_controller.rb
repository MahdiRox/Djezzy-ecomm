class CheckoutsController < ApplicationController
  def create
    stripe_secret_key = Rails.application.credentials.dig(:stripe, :secret_key)
    Stripe.api_key = stripe_secret_key
    cart = params[:cart]
    line_items = cart.map do |item|
      product = Product.find(item[:id])
      { 
        quantity: item["quantity"].to_i,
        price_data: { 
          product_data: {
            name: item["name"],
            metadata: { product_id: product.id }
          },
          currency: "usd",
          unit_amount: item["price"].to_i 
        }
      } 
    end
    session = Stripe::Checkout::Session.create(
      mode: "payment",
      line_items: line_items,
      success_url: "http://localhost:3000/cart/success",
      cancel_url: "http://localhost:3000/cart/cancel",
      shipping_address_collection: { 
        
      }
    )
    render json: { url: session.url }
  end


  def success
    render :success
  end
  def cancel
    render :cancel
  end
end

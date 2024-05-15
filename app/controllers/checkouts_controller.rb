class CheckoutsController < ApplicationController
  def create
    stripe_secret_key = Rails.application.credentials.dig(:stripe, :secret_key)
    Stripe.api_key = stripe_secret_key
    cart = params[:cart]
    line_items =
      cart.map do |item|
        product = Product.find(item[:id])
        product_stock = product.stocks.first
        if product_stock.amount < item["quantity"].to_i
          render json: { error: "Not enough stock for #{product.name}. Only #{product_stock.amount} left.", status: 400 }
          return
        end
        {
          quantity: item["quantity"].to_i,
          price_data: {
            product_data: {
              name: item["name"],
              metadata: {
                product_id: product.id,
                product_stock_id: product_stock.id
              }
            },
            currency: "usd",
            unit_amount: item["price"].to_i * 100
          }
        }
      end
    session =
      Stripe::Checkout::Session.create(
        mode: "payment",
        line_items: line_items,
        success_url: "http://localhost:3000/cart/success",
        cancel_url: "http://localhost:3000/cart/cancel",
        shipping_address_collection: {
          allowed_countries: ["DZ"]
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

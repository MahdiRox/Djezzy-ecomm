Rails.application.routes.draw do
  namespace :admin do
    resources :orders

    resources :products do
      resources :stocks
    end
    resources :categories
  end
  devise_for :admins
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", :as => :rails_health_check

  # Defines the root path route ("/")
  root "home#index"

  authenticated :admin_user do
    root to: "admins#index", as: :admin_root
  end
  resources :categories, only: [:show]
  resources :products, only: [:show]

  get "admin" => "admin#index"
  get "admins" => "admin#index"
  get "cart", to: "carts#show"
  post "checkout", to: "checkouts#create"
  get "cart/success", to: "checkouts#success"
  get "cart/cancel", to: "checkouts#cancel"
  post "webhooks", to: "webhooks#stripe"
  post "webhooks/stripe", to: "webhooks#stripe"

end

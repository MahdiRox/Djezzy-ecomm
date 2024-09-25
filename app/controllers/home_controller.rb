class HomeController < ApplicationController
  def index
    @main_categories = Category.all
  end
end

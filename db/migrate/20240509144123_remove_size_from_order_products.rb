class RemoveSizeFromOrderProducts < ActiveRecord::Migration[7.1]
  def change
    remove_column :order_products, :size
    remove_column :stocks, :size
  end
end

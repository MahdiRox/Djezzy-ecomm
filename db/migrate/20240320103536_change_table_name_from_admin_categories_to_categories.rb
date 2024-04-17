class ChangeTableNameFromAdminCategoriesToCategories < ActiveRecord::Migration[7.1]
  def change
    rename_table :admin_categories, :categories
  end
end

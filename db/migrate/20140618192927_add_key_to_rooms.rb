class AddKeyToRooms < ActiveRecord::Migration
  def change
    add_column :rooms, :key, :string
  end
end

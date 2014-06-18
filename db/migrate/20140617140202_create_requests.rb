class CreateRequests < ActiveRecord::Migration
  def change
    create_table :requests do |t|
      t.references :song
      t.references :room

      t.boolean :played, default: false
      t.integer :upvotes, default: 1

      t.timestamps
    end
  end
end

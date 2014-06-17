class CreateRequests < ActiveRecord::Migration
  def change
    create_join_table :songs, :rooms, table_name: :requests do |t|
      t.index :song_id
      t.index :room_id

      t.boolean :played, default: false
      t.integer :upvotes, default: 1

      t.timestamps
    end
  end
end

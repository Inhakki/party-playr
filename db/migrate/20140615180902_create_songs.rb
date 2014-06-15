class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :name, null: false
      t.string :artist, null: false
      t.float :length, null: false
      t.integer :upvotes, default: 1
      t.text :spotify_url, null: false
      t.references :room, null: false, index: true
      t.timestamps
    end
  end
end

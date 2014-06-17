class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :name, null: false
      t.string :artist, null: false
      t.float :length, null: false
      t.text :spotify_url, null: false
      t.text :album_art

      t.timestamps
    end

      add_index :songs, :spotify_url, unique: true
  end
end

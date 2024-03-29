# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140618192927) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "requests", force: true do |t|
    t.integer  "song_id"
    t.integer  "room_id"
    t.boolean  "played",     default: false
    t.integer  "upvotes",    default: 1
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "rooms", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "key"
  end

  create_table "songs", force: true do |t|
    t.string   "name",        null: false
    t.string   "artist",      null: false
    t.float    "length",      null: false
    t.text     "spotify_url", null: false
    t.text     "album_art"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "songs", ["spotify_url"], name: "index_songs_on_spotify_url", unique: true, using: :btree

end

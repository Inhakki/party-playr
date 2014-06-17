class Room < ActiveRecord::Base
  has_many :requests
  has_many :songs, through: :requests
end

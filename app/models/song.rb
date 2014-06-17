class Song < ActiveRecord::Base
  has_many :requests
  has_many :rooms, through: :requests
end

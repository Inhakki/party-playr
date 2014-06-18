require 'securerandom'

class Room < ActiveRecord::Base
  before_save :secure_random

  has_many :requests
  has_many :songs, through: :requests

  private

  def secure_random
    self.key = SecureRandom.hex(2).upcase
  end
end

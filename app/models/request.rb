class Request < ActiveRecord::Base
  belongs_to :room
  belongs_to :song

end

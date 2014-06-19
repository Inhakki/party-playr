class RequestSerializer < ActiveModel::Serializer
  attributes :id, :played, :upvotes
  has_one :song

end

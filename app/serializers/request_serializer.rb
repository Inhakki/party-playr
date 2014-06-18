class RequestSerializer < ActiveModel::Serializer
  attributes :played, :upvotes
  has_one :song

end

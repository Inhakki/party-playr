class RequestsController < ApplicationController

  def playlist
    @requests = Room.find(params[:room_id]).requests.where(played: false).order(upvotes: :desc, created_at: :asc)
    render json: @requests
  end

  def history
    @requests = Room.find(params[:room_id]).requests.where(played: true).order(updated_at: :desc)
  end

  def update

  end

end

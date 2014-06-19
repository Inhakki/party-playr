class RequestsController < ApplicationController

  def playlist
    @requests = Room.find_by(key: params[:room_id]).requests.where(played: false).order(upvotes: :desc, created_at: :asc)
    render json: @requests
  end

  def history
    @requests = Room.find_by(key: params[:room_id]).requests.where(played: true).order(updated_at: :desc)
  end

  def update
    @request = Request.find(params[:id])
    if @request.update(request_params)
      render status: 200, nothing: true
    else
      render status: 400, nothing: true
    end
  end

  private

  def request_params
    params.require(:request).permit(:played)
  end

end

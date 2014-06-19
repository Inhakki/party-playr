class RoomsController < ApplicationController

  def show
    @room = Room.find_by(key: params[:key])
  end

  def create
    @room = Room.create
    redirect_to "/rooms/#{@room.key}"
  end

  def search
    @room = Room.find_by(key: params[:search_room].upcase)
    redirect_to "/rooms/#{@room.key}"
  end

end

class RoomsController < ApplicationController

  def show
    @room = Room.find_by(key: params[:key])
    @songs = @room.songs
  end

  def create
    @room = Room.create
    redirect_to "/rooms/#{@room.key}"
  end

  def search
    @room = Room.find(params[:search_room])
    redirect_to @room
  end

end

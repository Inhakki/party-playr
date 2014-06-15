class RoomsController < ApplicationController

  def show
    @room = Room.find(params[:id])
  end

  def create
    @room = Room.create
    redirect_to @room
  end

  def search
    @room = Room.find params[:search_room]
    render action: "show"
  end

end

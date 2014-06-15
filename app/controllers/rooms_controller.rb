class RoomsController < ApplicationController

  def show
    @room = Room.find(params[:id])
  end

  def create
    @room = Room.create
    redirect_to @room
  end

end

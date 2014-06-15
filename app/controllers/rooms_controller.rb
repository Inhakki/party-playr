class RoomsController < ApplicationController

  def show

  end

  def create
    @room = Room.create
    redirect_to @room
  end

end

class SongsController < ApplicationController

  def index
    @songs = Song.where(room_id: params[:room_id]).order("upvotes DESC")
    render json: @songs
  end

  def new

  end

  def create
    # binding.pry
    @song = Song.new(song_params)

    if @song.save
      # link the song to this room in the database
      # Room.find(:room_id).songs << @song
      render json: @song
    else
      # otherwise, something went wrong
      render status: 400, nothing: true
    end
  end

  private

  def song_params
    params.require(:song).permit(:name, :artist, :length, :spotify_url, :room_id)
  end

end

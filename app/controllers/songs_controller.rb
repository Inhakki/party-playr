class SongsController < ApplicationController

  def index
    @songs = Room.find(params[:room_id]).order("upvotes DESC").songs
    render json: @songs
  end

  def new

  end

  def create
    @song = Song.new(song_params)
    @song = Song.find_or_create_by(spotify_url: song_params[:spotify_url])
    # binding.pry


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

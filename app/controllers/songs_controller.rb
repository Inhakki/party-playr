class SongsController < ApplicationController

  def create
    @song = Song.find_or_create_by(song_params)
    Room.find_by(key: params[:room_id]).requests.create(song_id: @song.id)

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
    params.require(:song).permit(:name, :artist, :length, :spotify_url, :album_art)
  end

end

require 'faye/websocket'
require 'yajl'
require 'sinatra/base'
require './rdio'

module FriendJam

	class Jammer

		def self.rdio
	  	@rdio ||= Rdio.new([ENV['RDIO_KEY'], ENV['RDIO_SECRET']])
	  end

		def self.get_rdio_keys
			rdio_keys = []
			listeners = Listener.all
			listeners.each do |listener|
				rdio_keys.push (listener[:rdio_key])
			end
			rdio_keys
		end

		def self.do_search(term, artist)
			rdio.call('search', {'query' => "#{term} #{artist}", 'types' => 'track'})
		end

		def self.get_queue
			Song.all
		end
	end

	class Player < Sinatra::Base
		Tilt.register Tilt::ERBTemplate, 'html.erb'
		get "/" do
	    erb :index
	  end

	  get '/add' do
	  	erb :add_track
	  end

	  get '/socket-test' do
	  	erb :socket_test
	  end

	  get '/helper.html' do
	  	erb :helper_page
	  end

	end
end
require 'faye/websocket'

module FriendJam
  class SocketBackend
  	KEEPALIVE_TIME = 15

  	def initialize(app)
  		@app = app
  		@@clients = []
  	end

  	def self.clients
  		@@clients
  	end

  	def call(env)
  		if Faye::WebSocket.websocket?(env)
  			ws = Faye::WebSocket.new(env, nil, {ping: KEEPALIVE_TIME })

  			ws.on :open do |event|
  				p [:open, ws.object_id]
  				@@clients << ws
				end

				ws.on :close do |event|
					p [:close, ws.object_id, event.code, event.reason]
					@@clients.delete(ws)

					ws = nil
				end

  			ws.rack_response
  		else
  			@app.call(env)
  		end
  	end
  end
end
require 'spec_helper'

describe Rdiographer do
	include Rack::Test::Methods

	def app
		Rdiographer
	end

	describe Rdiographer do
		describe 'GET /api/v1/hello' do
			it 'says hello' do
				get "/api/v1/hello"
				expect( last_response.status ).to eq( 200 )
        expect( JSON.parse(last_response.body)["hello"] ).to eq( "world" )
			end
		end
	end
end
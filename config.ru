require 'rubygems'
require 'bundler'
require 'sass/plugin/rack'
require 'bootstrap-sass'

Bundler.require

require './friendjam'
require './middlewares/socket_backend'

use FriendJam::SocketBackend

Sass::Plugin.options[:style] = :compressed
use Sass::Plugin::Rack

# Here base URL's are mapped to rack apps.
run Rack::URLMap.new("/" => FriendJam::Player.new)

$stdout.sync = true
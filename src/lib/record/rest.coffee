$ = require 'jquery'

module.exports =
  # TODO render route in the object itself with getter, and normalize this methods
  get   : (data) -> request.call @, 'get'   , (if @_id then  "#{@route}/#{@_id}" else @route), data
  put   : (data) -> request.call @, 'put'   , "#{@route}/#{@_id}", data # TODO change from put to patch
  post  : (data) -> request.call @, 'post'  , @route, data
  delete: (data) -> request.call @, 'delete', @route, data

request = (method, url, data) ->
  param_name = @resource.param_name || @resource.toString()

  # TODO optmize this serialization lookup
  if not data and @json
   data = {}
   data[param_name] = @json()


  $.ajax
    url     : url
    data    : data
    type    : method
    dataType: 'json'
    context : @
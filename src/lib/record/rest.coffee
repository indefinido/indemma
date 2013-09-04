$ = require 'jquery'

module.exports =
  get : (data) -> request.call @, 'get' , (if @_id then  "#{@route}/#{@_id}" else @route), data
  put : (data) -> request.call @, 'put' , "#{@route}/#{@_id}", data # TODO change from put to patch
  post: (data) -> request.call @, 'post', @route, data

request = (method, url, data) ->
  param_name = @resource.param_name || @resource.toString()

  # TODO optmize this serialization lookup
  if not data and @json
   data = {}
   data[param_name] = @json()

  # Id is automatically propagated through url
  if data[param_name]
    delete data[param_name]._id
    delete data[param_name].id

  $.ajax
    url     : url
    data    : data
    type    : method
    dataType: 'json'
    context : @
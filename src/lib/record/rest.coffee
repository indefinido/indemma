$ = require 'jquery'

module.exports =
  get : (data) -> request.call @, 'get' , (if @_id then  "#{@route}/#{@_id}" else @route), data
  put : (data) -> request.call @, 'put' , "#{@route}/#{@_id}", data # TODO change from put to patch
  post: (data) -> request.call @, 'post', @route, data

request = (method, url, data) ->
  # TODO optmize this serialization lookup
  if not data and @json
   data = {}
   data[@resource] = @json()

  # Id is automatically propagated through url
  if data[@resource]
    delete data[@resource]._id
    delete data[@resource].id

  $.ajax
    url     : url
    data    : data
    type    : method
    dataType: 'json'
    context : @
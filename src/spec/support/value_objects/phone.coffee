# TODO locales support
class @Phone

  constructor: (@area_code, @number) ->
    {@area_code, @number} = @area_code if typeof @area_code == 'object'


    # TODO parse argument types to validate value object domain
    # constraints

    unless @number
      @number    = @area_code
      @area_code = null

    Object.defineProperty @, 'valid', get: @validate

  # TODO move type validation to indemma files
  validate: -> @area_code? && @number?

  toString: ->
    formatted_number = @number.substr(0, 4) + '-' + @number.substr(4) if @number?

    if @area_code?
      "(#{@area_code}) #{formatted_number}"
    else
      formatted_number

  toJSON: ->
    area_code: @area_code
    number: @number
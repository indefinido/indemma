require 'indemma/lib/record/resource'
require 'indemma/lib/record/restfulable'
require 'indemma/lib/record/scopable'

root = exports ? window

model  = root.model  # TODO model = require 'indemma/model'
record = root.record # TODO model = require 'indemma/record'

describe 'scopable', ->

  describe 'when included', ->
    it 'sets te scopable loaded flag on model', ->
      model.scopable.should.be.true

    # TODO check if it is better to create a queryable extension and
    # move finder methods there
    # it 'adds finder methods to records'

  describe 'model', ->

    describe '#(options)', ->

      beforeEach ->

        @person = model.call
          $hetero : true
          $by_type: []
          $by_name: String
          resource: 'person'

      it 'should add scope methods to model', ->
        @person.none.should.be.function

      it 'should generate scope methods based on model definition', ->
        @person.hetero.should.be.function

      describe '#none', ->
        it 'should return empty response on fetch calls', (done) ->
          # TODO implement getter for none property!
          @person.none().fetch null, (people) ->
            people.length.should.be.empty
            done()


      describe 'scope', ->

        describe '#(name, type)', ->

          it 'should add scope methods to model', ->
            @person.scope 'bissexual', Boolean
            @person.bissexual.should.be.function

      describe '#{generated_scope}', ->

        beforeEach ->
          @request = jQuery.Deferred()
          sinon.stub(jQuery, "ajax").returns @request
          @person.scope.clear()

        afterEach -> jQuery.ajax.restore()

        describe '#every', ->

          it 'should fetch models from the server', (done) ->

            # Will be called once for each saved record
            fetched = (people) ->
              people.should.be.array
              people[0].name.should.be.string
              done()

            @person.every fetched

            # TODO rename deferred to @request
            @request.resolveWith @person, [[{name: 'Arthur'}, {name: 'Ford'}]]
            jQuery.ajax.callCount.should.be.eq 1


        describe 'when string', ->
          it 'should acumulate data in scope object', ->
            @person.by_name()
            @person.scope.data.by_name.should.be.a 'string'

          it 'should override data throught parameters', ->
            @person.by_name 'Ford'
            @person.scope.data.by_name.should.be.eq 'Ford'

        describe 'when array', ->
          it 'should acumulate data in scope object', ->
            @person.by_type()
            @person.scope.data.by_type.should.be.a 'array'

          it 'should override data throught parameters', ->
            @person.by_type 1, 2, 3
            @person.scope.data.by_type.should.contain 1, 2, 3

          it 'should use default value'
          it 'should allow scope chaining'

          describe 'xhr request', ->

            it 'should build correct url', ->
              @person.by_type(1, 3, 4).fetch()

              settings = jQuery.ajax.firstCall.args[0]

              settings.should.have.property 'data'
              settings.data.should.have.property 'by_type'
              settings.data.by_type.should.include 1, 3, 4

            it 'should make call', ->
              @person.by_type(1, 3, 4).fetch()
              jQuery.ajax.callCount.should.be.eq 1


        describe 'when boolean', ->

          it 'should acumulate data in scope object', ->
            @person.hetero()
            @person.scope.data.hetero.should.be.eq true

          it 'should override data throught parameters', ->
            @person.hetero false
            @person.scope.data.hetero.should.be.eq false

          it 'should allow scope chaining'

          it 'should make ajax call', ->
            @person.hetero().fetch()
            jQuery.ajax.callCount.should.be.eq 1

        describe '#{generated_association}', ->

          describe 'of type belongs_to', ->

            beforeEach ->
              @person = model.call
                $hetero: true
                $by_type: []
                resource: 'person'

              @towel = model.call
                resource: 'towel'
                material: 'cotton'
                belongs_to: 'person'


            describe '#{generated_scope}', ->

              it 'can be called on association', ->
                soft_towel = @towel
                  material: 'silicon microfiber'

                soft_towel.build_person()

                expect(soft_towel.person).to.respondTo 'hetero'

          describe 'of type has_many', ->

            beforeEach ->
              @person = model.call
                $hetero: true
                $by_type: []
                resource: 'person'
                has_many: 'towels'

              @towel = model.call
                $by_material: []
                resource: 'towel'
                material: 'cotton'
                belongs_to: 'person'

              @arthur = @person
                name: 'Arthur'

              @person.scope.clear()

            describe '#{generated_scope}', ->

              it 'can be called on association', ->
                expect(@arthur.towels).to.respondTo 'by_material'

              it 'should be serializable into paramenters', ->
                @arthur.towels.by_material 'cotton', 'microfiber'
                query_string = decodeURIComponent(jQuery.param @arthur.towels.scope.data)
                query_string.should.be.eq 'by_material[]=cotton&by_material[]=microfiber'

              describe '#every', ->

                it 'should empty association when no models are returned', (done) ->

                  # Will be called once for each saved record
                  fetched = (towels) =>
                    towels.should.be.array
                    towels.should.be.empty
                    @arthur.towels.should.have.length 0
                    ` this.should.have.length(0) `
                    done()

                  @arthur.towels.every fetched

                  @request.resolveWith @arthur.towels, [[]]
                  jQuery.ajax.callCount.should.be.eq 1

                it 'should update resources when already exists in association', (done) ->
                  aditions = @arthur.towels.add _id: 1, material: 'colan'

                  # Will be called once for each saved record
                  fetched = (towels) =>
                    towels.should.be.array
                    towels.should.have.length 1
                    towels[0].material.should.be.eq 'cotton'

                    # Updated the associated object, instead of
                    # creating a new one
                    aditions[0].material.should.be.eq 'cotton'
                    @arthur.towels[0].material.should.be.eq 'cotton'
                    done()

                  @arthur.towels.every fetched

                  @request.resolveWith @arthur.towels, [[_id: 1, material: 'cotton']]
                  jQuery.ajax.callCount.should.be.eq 1
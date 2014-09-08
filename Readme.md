
indemma
=======

  Indemma (mind picture → memory), client side, ES5 observable and REST, extensible modular data model.

Summary
-------

 - We are tired of calling .attr on our models.
 - We are tired of using templates instead of data bindings.
 - We want a decent kind of polyfill to view models and rest clients until polymer is out of beta.
 - Requirements
   - ES5 Getters and Setters (Shim ships with component, IE 10+)
   - ES7 Observer            (Shim ships with component, IE ?+)

Installation
------------

    $ component install indefinido/indemma

Usage
-----

### Basic Functionality (Query, Observable, Advisable)

Basic functionality: Just a copy of [ActiveRecord Interface](https://github.com/rails/rails/blob/master/activerecord) on javascript.

#### Model

```javascript

  require('indemma');

  var person = model.call({
    resource: 'person',
    record: {
      after_initialize: []                                      // Callbacks

      // Default attributes
      avatar: "assets/images/layout/avatar_placeholder.png"
    }
  });

  // In the future will return a promise object
  // for now it doesn't, i know it's bad
  person.create({name: "Arthur Philip Dent"}, {name: "Ford Perfect"});

  // some time passed here

  person.find(1) //  {name: "Arthur Philip Dent", subscribe: ..., before: ..., after: ..., ... }

  person.every()   // [{name: "Arthur Philip Dent", subscribe: ..., ... }, {name: "Ford Perfect", subscribe: ..., ... }]

  // TODO active record interface like: person.where(attribute: value)
```

#### Record

```javascript

  require('indemma');

  var person = model.call({resource: 'person'}),

  arthur = person({
    name     : function () { return this.firstname + " " + this.surname; },
    firstname: "Arthur Philip",
    surname  : "Dent",
    species  : "Humam"
  });

  // Subscribe to all changes
  arthur.subscribe(function (updates) {
    var i = updates.length,  update;
    while (i--) {
       update = updates[i];
      console.log(update.name, update.type, update.oldValue, '→', update.object[update.name]); // also this[update.name]
    }
  });

  // Subscribe to single property change
  arthur.subscribe('firstname', function ( update) {
    console.log( update.name,  update.type,  update.oldValue, '→',  update.object[ update.name]); // also this[ update.name]
  });

  // Advice function calls
  arthur.after('name', function () {
    console.log('excuted after arthur.name()');
  });

  arthur.firstname = "Arthur Philip Dent";
  delete arthur.name
```

### Extensions

#### Associations

Basic active record like associations

```javascript
  require('indemma');

  // Activate association support
  require('indemma/lib/record/associations'); // Working on to be require('indemma/association')
  model.associable();

  var person = model.call({
    resource: 'person',
    has_many: 'towels'              // Yes! Say no to camelcase!
  }),

  towel = model.call({
    resource: 'towel',
    belongs_to: 'person'
  })

  // Lets have our data

  arthur = person({
    name     : function () { return this.firstname + " " + this.surname; },
    firstname: "Arthur Philip",
    surname  : "Dent",
    species  : "Humam"
  });

  // Magic (⚡) and Science (☣) happening now
  microfiber_towel = arthur.towels.create({
    material        : 'microfiber',
    color           : 'orange',
    functions_amount: Infinity
  });


  arthur.towels[0] === microfiber_towel                 // true
  arthur.towels.length                                  // 1

  microfiber_towel.person_id                            // 1
  microfiber_towel.person = person({name: "Ford"})      // 1
  microfiber_towel.person_id                            // 2 (This may vary depending on storage)
  arthur.towels.length                                  // 0
```

TODO table with all available methods per association


Nested Attributes

```javascript
  require('indemma');

  // Activate association support
  require('indemma/lib/record/associations'); // Working on to be require('indemma/association')
  model.associable();

  var person = model.call({
    resource: 'person',
    nest_attributes: 'towel'
  }),

  towel = model.call({
    resource: 'towel'
  }),

  arthur = person({
    name     : function () { return this.firstname + " " + this.surname; },
    firstname: "Arthur Philip",
    surname  : "Dent",
    species  : "Humam"
  });

  arthur.towel_attributes = { material: 'microfiber', functions: Infinity }
  arthur.towels[0]; // { material: 'microfiber', functions: Infinity } (Still in beta)

```

#### Restful

```javascript

  require('indemma');

  // Activate restful support
  // Compatible with default rails json rendering e.g. render :json => @person
  // Depends on resourceful module
  require('indemma/lib/record/restful'); // Working on to be require('indemma/restful')

  var person = model.call({
    resource: 'person'
  }),

  arthur = person({
    name     : function () { return this.firstname + " " + this.surname; },
    firstname: "Arthur Philip",
    surname  : "Dent",
    species  : "Humam"
  });

  // ⚡ + ☣ again
  arthur.save(); // POST /people

  // ... some time passes
  arthur.species = "Homo Sapiens Sapiens";
  arthur.save(); // PUT /people/1

  // serialization
  arthur.json(); //  {name: "Arthur Philip Dent", firstname: "Arthur Philip", surname: "Dent", species: "Humam"}

```

#### Resourcefull

Inflection and resource modules together.

```javascript

  require('indemma/lib/record/resource'); // Working on to be require('indemma/resourceable')

  var person = model.call({
    resource: {
      name      : 'person',
      param_name: 'guy',
      scope     : 'world'
      // singular: true         // Works as singular resource too =D
    }
  }),

  arthur = person({
    name   : "Arthur Philip",
    species: "Humam"
  });

  // Also sets the accept header to application/json

  arthur.save();   // POST /world/person?guy[name]=Arthur Philip&guy[species]=Human

```

#### Scopable

Active Record like scopes and some finders

```javascript
  require('indemma/lib/record/scopable'); // Working on to be require('indemma/scopable)

  // Sintax is up to change yet
  var person = model.call({
    resource: 'person',
    $gender: String,
    $age: Number
    $towel_ids: Array

    // $towel: function () {}          // Runtime scope builders to come
  });

  // Also sets the accept header to application/json

  person.all();               // GET /people
  person.gender('m');         // GET /people?gender=m
  person.age(32);             // GET /people?age=32
  person.none.age(32);        // GET /people
  person.towel_ids(1, 2, 3);  // GET /people?towel_ids[]=1&towel_ids[]=2&towel_ids[]=3

```

#### Maid

TODO make documentation

#### Storage (Persistance, Queryable & Storeable)

TODO make documentation

### Validations support

```javascript
  require('indemma');

  // model definition
  var person = model.call({
    resource  : 'person',

    email     : 'Email',                // By default uses type validation
    age       :  Number,
    birthday  : {type: Number},

    // You can use builtin validators sintax
    validates_presence_of  : 'age',
    validates_remotely     : 'email',   // Remote validator will do POST /people/validate?person[email]=arthur@earth.com

    // Coming soon!
    // validates  : {name: {beginsWith: 'arthur', presence: true}} // Or you can use the object syntax

  });


  arthur = person({
    name: "Arthur Philip Dent",
  });


  arthur.email = "arthur@earth.com";// "arthur@earth.com"
  arthur.valid;                     // true

  arthur.email = "wrong@@";
  arthur.valid;                     // false

  // When calling valid attribute will trigger validations
  arthur.errors;                    // [ email: ["Email 'wrongg@@' is in an invalid format.", "..."]
  arthur.errors.messages.email;     // "Email 'wrongg@@' is in an invalid format."

  // When using remote validations use the returned deferred
  arthur.validate(function (record, validation_results...) {
    alert(record.errors.messages.email);
  });

  <div>
    <input class="invalid" data-value="user.email" data-class-invalid="user.errors.messages.email" />
  </div>

  // Validators reference
  person.validators                 // [ {attribute_name: 'email', type: 'Email', ... } , ... ]


  // Suport for custom validators coming soon!
  // person.validators.phone = function (record, attribute, value) {... }

```

#### Adapters

##### Rivets

```javascript
 require('indemma');

  // Activate restful support
  // Requires observer-shim
  // Compatible with default rails json rendering e.g. render :json => @person
  require('indemma/lib/record/rivets'); // Working on to be require('indemma/adapters/rivets')

  var person = model.call({resource: 'person'}),

  arthur = person({
    name     : function () { return this.firstname + " " + this.surname; },
    firstname: "Arthur Philip",
    surname  : "Dent",
    species  : "Humam"
  }),

  template = '<div class="person">' +
             '  <span data-html="person.name"></span>    ' +
             '  <span data-html="person.species"></span> ' +
             '</div>';

  document.body.innerHTML = template;
  element = document.body.children[0];

  arthur.tie(element); // equivalent to rivets.bind(element, {person: arthur});

  arthur.species = "Homo Sapiens";

```

## TODO

Move API to a custom page or the github wiki

## Tests!

A medium part of tests has been written, but more on the go!
You can help by implementing the body of some spec


### Define property on steroids sintax support

With setter on steroids

```javascript
  require('indemma');

  // model definition
  var person = model.call({
    resource : 'person',
    name     : {
      set : function (name) { this.name = name.split(' '); },
      get : function (name) { this.name.join(' '); }
    },
    firstname: {
      get : function () { this.name[0] },
    }
  });

  arthur = person({
    name: "Arthur Philip Dent",
    species  : "Humam"
  });

  arthur.firstname  // Arthur
```

### Inflections support

```javascript
  require('indemma');

  var person = model.call({resource: 'person'});
  person.plural     // 'people'

```

### Storage extension

```javascript
  require('indemma');

  model.storable()

  arthur = person({
    name: "Arthur Philip Dent",
    species  : "Humam",
  });

  arthur.save() // Store on selected storage (localStorage, memory, etc ...)
```

### Single extensions call option

```javascript
  require('indemma');

  model(['advisable', 'observable', 'restfulable', 'maid', ... ]);
```

Credits
-------

  Built upon the lovely [coffeescript](http://coffeescript.org/) language
  Building with [the prototypal paradigm](http://ericleads.com/2013/02/fluent-javascript-three-different-kinds-of-prototypal-oo) library [stampit](https://github.com/dilvie/stampit)




This project rocks and uses [WTFP-LICENSE](http://www.wtfpl.net)

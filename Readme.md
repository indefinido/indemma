
# indemma

  Indemma (mind picture → memory), client side, ES5 observable and REST, extensible modular data model.

  Current version 0.0.1

## Summary

 - We are tired of calling .attr on my models.
 - We are tired of using templates
 - We want a decent kind of polyfill to view models until polymer is out of beta
 - Requirements
   - ES5 Getters and Setters (Shim ships with component, IE 10+)
   - ES7 Observer            (Shim ships with component, IE ?+)

## Installation

    $ component install indefinido/indemma

## API

### Basic Functionality (Query, Observable, Advisable)

Basic functionality, just copy [ActiveRecord Interface API](https://github.com/rails/rails/blob/master/activerecord) on javascript

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

  person.all()   // [{name: "Arthur Philip Dent", subscribe: ..., ... }, {name: "Ford Perfect", subscribe: ..., ... }]

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
  require('indemma/lib/record/restful); // Working on to be require('indemma/restful')
  model.restfulable();

  var person = model.call({resource: 'person'}),

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

TODO make documentation

#### Maid

TODO make documentation

#### Adapters

##### Rivets

```javascript
 require('indemma');

  // Activate restful support
  // Requires observer-shim
  // Compatible with default rails json rendering e.g. render :json => @person
  require('indemma/lib/record/rivets'); // Working on to be require('indemma/adapters/rivets')
  model.rivets();

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

## TESTS!

A tiny part of tests has been written, but more on the go!

### Validations support

```javascript
  require('indemma');

  // model definition
  var person = model.call({
    resource  : 'person',
    email     : {
      type: 'email'
    }
  });

  arthur = person({
    name: "Arthur Philip Dent",
  });

  arthur.email = "arthur@earth.com" // "arthur@earth.com"
  arthur.email = "wrong@@"          // TypeError: "wrong@@" is not a valid email
```


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

## License

  [WTFPL](http://www.wtfpl.net)

## Credits

  Built upon the lovely [coffeescript](http://coffeescript.org/) language

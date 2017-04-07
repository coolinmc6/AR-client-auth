# README
- These are the libraries are installed:
```sh
npm i --save express mongoose morgan body-parser
```

- After Lecture 63, this is what we have:
```js
// index.js
// Main starting point of our application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();


// App Setup


// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);
```
  - **NOTE:** I have also created my package.json file and .gitignore
- I don't understand everything really but here are the highlights:
  - We don't have access to ES6 syntax here, hence the 'require' statements (not 'import')
  - The first 4 const's (express, http, bodyParser and morgan) are from the libraries we've installed
  - `app` is just an instance of express
  - For our server, we established our port as 3090 and then created our server using the http library
  and passing in our instance of express, `app`
  - Now, when we run this file in our terminal `node index.js`, it says 'Server listening on: 3090'

## Lecture 64: Express Middleware
- both morgan and bodyParser are middleware
- morgan logs our requests
- bodyParser

```sh
npm install --save nodemon
```
- We also added a script in our package.json file so that we can just do `npm run dev` to start up our server.
Any subsequent changes made to our server file will automatically reset the server.
- To get started:
```sh
npm run dev
```
  - check out `localhost:3090` to see it

## Lecture 66: Mongoose Models
- We are going to be working on a library that sits on top of MongoDB called Mongoose, an ORM
- we already have Mongoose installed
- We are going to create a user model
- This is what we have thus far:
  - everything is in the `server` directory right now
  - we created our router and passed in some dummy output to check that it works and it does
  - after creating our router, we added `router(app)` to our `index.js` page to handle the request
  - we also created a `models` directory and `models/user.js` file for our User model.  I have some good
  notes in there about what each part is doing

## Lecture 67: MongoDB Setup
- install MongoDB: [https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
- to run mongodb
```sh
mongod
```
- We add the DB part to our index.js file to make our connection to mongodb
- We downloaded and installed [Robomongo](https://robomongo.org/download)
- We made the connection to the MongoDB local instance after installing Robomongo

- finish L68
- to get up and running:
```sh
npm run dev 
mongod 				# separate tab
```
  - launch Robomongo

## Lecture 69: Authentication Controller
- we created `/controllers/authentication.js` and imported it into `router.js` 
- We then used Postman to just test that our post request worked and it did:
```js
exports.signup = function(req, res, next) {
  res.send({ success: 'true'});
}
```
  - in Postman, we get the object back: ` { success: 'true' }`

## Lecture 70: Searching for Users
- we continued to build out our `authentication.js` file:
```js
const User = require('../models/user');

exports.signup = function(req, res, next) {
  
  const email = req.body.email;
  const password = req.body.password;

  // see if a user with a given email exists => we need to be able to search our records
  User.findOne({ email: email }, function(err, existingUser) {
    
  });

  // If a user with email does exist, return an error

  // If a user with email does NOT exist, create and save user record

  // Respond to request indicating the user was created

}
```
  - When first writing this, we did `console.log(req.body)` to see what the body of the post was.
  In Postman, we posted some JSON with an email and password.  In our Terminal where the server
  is running, we could the JSON object show up.  That's how we can see how to grab our email and
  password values
  - We then imported our user model (at the very top) and are now trying to implement our first
  step which is to see if the user's email already exists or not.

## Lecture 71: Creating User Records & Lecture 72
- At this point, I can successfully save new records to my auth database. 
- We did some error fixing to prevent users from submitting user info that doesn't have an email
or a password
- We now want to add bcrypt to no longer store simple unhashed passwords

## Lecture 73: Salting a Password
- we wrote a bunch of code in the last section
- I have commented the major parts but most of what we did is after the 'On Save Hook' comment
```js
// server/models/user.js
const mongoose = require('mongoose');
// Schema is what we use to tell mongoose about the particular fields that we have
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


// Define our model => Schema is an object that we are using to define our columns and their
// data types.  We need our user to be unique and to ensure that, everything is saved in lowercase
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true }, 
  password: String
})

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  // the context of the function is the user model; we are getting access to the user model
  const user = this;

  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    // after creating salt, hash (encrypt) our password using salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    })
  })
})

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
```
- finished L73, start L74 next

## Lecture 74: JWT Overview
- right now, in authentication.js, we are simply sending back `success: true`, which doesn't really do anything for us.
we want to send back that identifying token that the user can use to make authenticated requests
- User ID + Our Secret String = JSON Web Token
  - It sounds like: JWT = encrypted(User ID + Secret string)
- This means that a user can give us our JSON Web Token + Our Secret String, we'll be able to get our User ID
  - User submits JWT: decrypt(JWT, Secret String) => User ID

## Lecture 75: Creating a JWT
```sh
npm install --save jwt-simple
```
- We created `/server/config.js` to create our secret key.  This key must remain unknown to everyone and so we added
`config.js` to our `.gitignore` file.  This is the format:
```js
module.exports = {
  secret: 'random-string-of-characters'
};
```
- We updated our `authentication.js` file to bring in the jwt-simple library:
```js
const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

// CODE

// this saves the record to the database
user.save(function(err) {
  if(err) { return next(err); }

  // Respond to request indicating the user was created
  res.json({ token: tokenForUser(user)}); // UPDATED
});
```
  - first we create the token in `tokenForUser(user)` and then we return the token in our response near the bottom
- jwt.io => json web token info

## Lecture 76: Installing Passport
```sh
npm install --save passport passport-jwt
```
- We need an authentication layer, which is Passport
- Incoming Request -> Passport -> Route Handler
- In Passport, a strategy is a method for authenticating a user
- in the last section, we imported one strategy, ExtractJwt
- This is what we have after lecture 76 & 77:
```
// server/services/passport.js
const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Setup options for JWT strategy
const jwtOptions = {};

// Create JWT strategy
// payload = decoded jwt token; has the 'sub' and 'iat' properties from authentication.js
// done is a callback function that we need to call depending on whether or not we successfully authenticate the user
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // see if the user ID in the payload exists in our database
  // if it does, call 'done' with that other
  // otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    // err is populated only if it fails
    if (err) { return done(err, false); }

    if(user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell Passport to use this strategy
```

## Lecture 78: Using Strategies with Passport
- strategies are "plugins" that work with passport
- Passport is a library we use to figure out whether or not our user is authenticated to user our application
- we have to tell the strategy where to look to find the jwt

## Lecture 79: Making an Authenticated Request
- In this section, we added the `jwtOptions` to `passport.js`
- We also updated router.js
```js
const Authentication = require('./controllers/authentication')
const passportService = require('./services/passport')
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false});  // NEW

module.exports = function(app) {
  // rec = request; res = response; next = mostly for error handling
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there'});
  })
  app.post('/signup', Authentication.signup)
}
```
- We were able to successfully send a get request to our dummy route that was successfully authorized.  To do
that:
```
// router.js
app.get('/', requireAuth, function(req, res) {
  res.send({ hi: 'there'});
})
```
- In Postman, we sent a get request to `localhost:3090/` and then updated our headers to contain a (property? key?)
called 'authorization' and we entered our token.  It succeeded! 

## Lecture 80: Signing in with Local Strategy

```sh
npm install --save passport-local
```

## Lecture 82: Bcrypt Full Circle


## Lecture 85: Server Review













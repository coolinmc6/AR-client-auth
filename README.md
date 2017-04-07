# README

## Read later
- CORS
- .then()
- .catch()

## Lecture 87: App Architecture

## Lecture 88: Component and State Design
- we won't need to keep the JWT in our application state; instead, we'll use a boolean
for an 'authenticated' property
- we replaced our `<App />` with the code for our React Router:
```js
ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
  	<Router history={browserHistory}>
    	<Route path="/" component={App}>
    	</Route>
    </Router>
  </Provider>
  , document.querySelector('.container'));
```

## Lecture 89: Header Component
- nothing too crazy

## Lecture 90: Scaffolding the Signin Form
- install redux-form
```sh
npm i --save redux-form
```
- first we set up the basic part of ReduxForm which was giving it the name of the form and the
fields that we wanted to collect
```js
import React, { Component } from 'react';


class Signin extends Component {
	render() {

	}
}

export default reduxForm({
	form: 'signin',
	fields: ['email', 'password']
})(Signin)
```
- then we had to import our reduxForm reducer and put it into our rootReducer:
```js
import { combineReducers } from 'redux';
// ES6 allows me to import 'reducer' AS a name that I provide; in this case, 'form'
import { reducer as form } from 'redux-form';

const rootReducer = combineReducers({
  form: form   // this can get shortened to just 'form'
});

export default rootReducer;
```
- finally, we built the basics of our form.  I won't show it here as it's just JSX; the most
important parts to remember are the `export default` statement at the bottom of our Signin
component and how we wired our form into the rootReducer

## Lecture 91: Adding Signin Form
- Re-watch and get notes from the first minute of this lecture.  We are accessing the `handleSubmit`
method and the password and email fields from our props object which is provided by reduxForm. We
do this by: `const { handleSubmit, fields: { email, password }} = this.props;`
  - I have seen this before but I want to take another look at it.
- NOT FINISHED
- The console.log(email, password) in the Signin component is not working...it's not grabbing the
values properly.
- **FIX:** the issue was related to my redux-form version.  I had a 6.01 or so and when I want to console
log it out, it returned `undefined` in the console.  I updated my package.json file to match Grider's
and it worked.
'''json
"redux-form": "^5.0.1"
```

## Lecture 92: Action Creator with Many Responsibilities
- User submits info => Action Creator submits email/password to server => if correct, return JWT and
redirect to feature/protected resource; if not, show error message
- So this one action is going to redirect the user, update our state and save our tokens

## Lecture 93: Introducing Redux Thunk
- ReduxPromise isn't what we want; we want ReduxThunk
- The dispatch method makes sure all the action gets sent to all reducers. It is a key piece of Redux
```sh
npm i --save redux-thunk
```
- ReduxThunk is a middleware which we've imported into index.js and put in as an argument to our middleware
function
- adding ReduxThunk means that we can now return a **function** and not just an object from our action
creators.  So our new action creator will be written to return a function.

## Lecture 94: Signin Action Creator
- with ReduxThunk, we are no longer limited to issuing just one action
- with ReduxThunk, there is no synchronous action here; the action will be called with dispatch but we
can wait as long as we want before taking the next step
- **This was a big section; might be worth re-visiting for set-up purposes**
- This lecture is where we added the server from the last section.  I got an error because I needed to 
create a config.js file in our server
- When we tested our sign-in button, we got a 'No Access-Control-Allow-Origin' error

## Lecture 95: CORS in a Nutshell
- 'No Access-Control-Allow-Origin' is a CORS error: Cross-Origin Resource Sharing error
- CORS is a security protocol; it is there to protect users in a browser environment
- It's a security protocol and looks at your current domain and port
- Why no errors with Postman?
  - Headers can be faked easily; Postman is a dev tool, not a browser
- CORS is really only to protect users in a browser.  So the browser is just trying to prevent users
from making cross-origin API requests


## Lecture 96: Serverside Solution for CORS
- add cors library to server:
```sh
npm i --save cors
```
- we then imported it into our index.js file in our server AND made our app use it
- After installing cors, I used Postman to create a new email-password combination (colin@example.com, 
123).  After trying it in the browser, I was able to successfully receive a JWT

## Lecture 97: Programmatic Navigation
- Now, when we enter in a good email-password it changes the URL to '/feature' although there is no
page yet for it.  With a bad email-password, we get denied









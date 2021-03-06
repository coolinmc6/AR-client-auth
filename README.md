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

## Lecture 98: Updating Auth State
- In this section created our `types.js` file under actions (our action types), we created a simple 
authReducer

## Lecture 99: Review
- we don't need to store the JWT in our state, just the 'authenticated' boolean.
- the JWT will be sent via our hearders in axios
- good review, should revisit.  Good breakdown of main action creator

## Lecture 100: LocalStorage and JWT
- We are going to put our JWT into local storage
- Saving to local storage is pretty easy; in our action creator: 
`localStorage.setItem('token', response.data.token);` after the user has been successfully authenticated
and we have recieved so back from our server

## Lecture 101:
- we created the authError action creator to catch errors

## Lecture 102: Displaying Errors

## Lecture 103: Header Logic

## Lecture 104: Signout Component
- we built the signout component
- ...and added it to our router in `/src/index.js`

## Lecture 105: Signout Action Creator
- We then created the action creator for signing out the user.
- It worked
- One thing that I thought was interesting was that when the `Signout` button is clicked, we are loading
the Signout component which initiates the sign-out process.  I probably would have assumed that when we
clicked the button, the action creator would be called from Header component.  Instead, we use the
lifecycle method, componentWillMount(), that calls `this.props.signoutUser()` which is the action creator
that we just built.
- `signoutUser()` does two main things: it removes the token: `localStorage.removeItem('token');` and then
returns the `UNAUTH_USER` action type which, when passed through the authReducer, switches our 
'authenticated' property in state to false.

## Lecture 106: Signup Component
- boilerplate code; building component and adding route for it

## Lecture 107: Signup Form Scaffolding
- Here we built out the component using ReduxForm.  I want to a minute to quickly refresh HOW to setup
a ReduxForm:
1. Import the right items:
```js
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';
```
  - in addition to the normal React imports to make a class-based component, we need reduxForm AND
  we need want to bring in all of our actions

1. Build the component:

```js
class Signup extends Component {
  render() {
    
    return (
      <form>
        <fieldset className="form-group">
          <label>Email:</label>
          <input className="form-control" {...email} />
        </fieldset>
        <fieldset>
          <label>Password:</label>
          <input className="form-control" type="password" {...password} />
        </fieldset>
        <fieldset>
          <label>Confirm Password:</label>
          <input className="form-control" type="password" {...passwordConfirm} />
        </fieldset>
        <br />
        <button action="submit" className="btn btn-primary">Sign up</button>
      </form>
    )
  }
}
```
  - this is just the form with the fields for the user's email and then two password fields (chosen
  password and confirmation);
  - notice in the input I include `{...email}` or `{...password}`; they will be "enabled" in the next
  steps by defining them.  They are actually helper functions that are provided by ReduxForm that allow
  us certain functionality like showing an error to the user that we do below
```js
// code
render() {
  const { handleSubmit, fields: { email, password, passwordConfirm }} = this.props    
  return (
    <form>
// code
```
  - to get access to the handleSubmit method that comes with ReduxForm as well as the fields I want,
  I have to "peel off" the method and helpers from props.  The syntax used is (I believe) ES6.
1. I need to connect my form to my global state and the component itself.  The syntax is not super
difficult to understand but it does have a couple components.  First is the name of the form which
doesn't really matter, it's whatever I want to call it, and then fields that I'll want in my form.
  - This part could really be done second, right after I make the necessary import statements.  It
  probably would be best to do that so that I can properly plan which fields I'll want in my form.

```js
export default reduxForm({
  form: 'signup',
  fields: ['email', 'password', 'passwordConfirm']
})(Signup);
```
  - **Note:** what Grider initially failed to include was our actions to the reduxForm.  So after the
  reduxForm object, we need to add 'null' and our 'actions'.  This is what the good version looks like:
```js
export default reduxForm({
  form: 'signup',
  fields: ['email', 'password', 'passwordConfirm'],
  validate
}, null, actions)(Signup);
```

## Lecture 108: Redux Form Validation
- 

## Lecture 109: Implementing Validation Logic
- validate function is called when the user tries to submit
- if we want to show an error, in the validate() function we simply add a property to the errors
object with that name of the field (i.e. email, password, passwordConfirm) and then a string that
is the error that we want to display to the user.
- Here is the validate function thus far:
```js
function validate(formProps) {
  const errors = {};

  if(formProps.password !== formProps.passwordConfirm) {
    errors.password = 'Passwords must match'
    console.log(errors);
  }

  return errors;
}
```
- And this bit of code is what we added to show the user an error when the password they entered does
not match: `{password.touched && password.error && <div className="error">{password.error}</div>}`

## Lecture 110: More on Validation
- we added a few more checks for our form, mainly on the existence of input in each of the fields

## Lecture 111: Signup Action Creator


## Lecture 112: Finish Up Signup
- I need to finish this up later but after adding the actions to our `export default reduxForm` 
statement, I can successfully create a new record.
  - as a reminder, I setup the route in my server to receive signup requests from the `/signup` path.
  This is what it looks like: `app.post('/signup', Authentication.signup)`
- **NOTE:** I received a 422 (which is correct) and this error: 
`Uncaught (in promise) TypeError: Cannot read property 'error' of undefined`.  I looked at the error location and it's the signupUser action creator.  I tried troubleshooting but then used Grider's exact code so I'm afraid something might be off in the server that I am using (though I thought I used his version and not mine).  Either way, I am going to finish the project and then try downloading his server and see if this code works.

## Lecture 113: Securing Individual Routes
- We brought in our code for require_auth, a Higher Order Component that we built a couple sections
ago. 
- To protect a route, we simply wrap whatever component we want to protect (require authentication)
in our RequireAuth component.  Like so...`<Route path="feature" component={RequireAuth(Feature)} />`

## Lecture 115: Automatically Authenticating Users
- Here is a quick summary of what we did:
  - we removed our long store statement `createStoreWithMiddleware(reducers)` from the Provider tag
  - ...and created a new const called `store`
  - We then grabbed the user's token if they had one `const token = localStorage.getItem('token');`
  - If they had one, then we issued an action `store.dispatch({ type: AUTH_USER })` to say that the
  user was authenticated

## Lecture 116: Making Authenticated API Requests
- One of the key parts of making authenticated requests is that when we send our request, we also
send along our token.  We do that by using axios and then in the header, which is placed in an object
after our url, there is an authorization property:
```js
export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token')}
    })
      .then(response => {
        console.log(response);
      })
  }
}
```

## Lecture 117: Handling Data from Authenticated Requests
- We finished the fetchMessage() action creator:
```js
export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token')}
    })
      .then(response => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        })
      })
  }
}
```
- if we used ReduxPromise, it could've looked like this:
```js
// with Redux Promise
export function fetchMessage() {
 const request = axios.get(ROOT_URL, {
   headers: { authorization: localStorage.getItem('token')}
 })

 return {
   type: FETCH_MESSAGE,
   payload: request
 }
}
```




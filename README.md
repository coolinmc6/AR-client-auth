# README

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











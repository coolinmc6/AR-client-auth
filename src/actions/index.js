import axios from 'axios';
import { browserHistory } from 'react-router';

const ROOT_URL = 'http://localhost:3090';

// the argument to this function implies that it will be an object with email
// and password properties
export function signinUser({ email, password}) {
	return function(dispatch) {
		// Submit email/password to the server
		// {email: email, password: password}
		axios.post(`${ROOT_URL}/signin`, { email, password })
			.then(response => {
				// If request is good...
				//  - Update state to indicate user is authenticated
				//  - Save the JWT token
				//  - redirect to the route '/feature'
				browserHistory.push('/feature')
			})
			.catch(() => {

				// If request is bad...
				//  - Show an error to the user

			})

		



	}
	

}
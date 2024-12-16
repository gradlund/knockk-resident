import axios from "axios";
import { UUIDTypes } from "uuid";

// URL for the api
const apiURL = "http://localhost:3000/residents";

// Interface for response
interface UserLoggedIn {
  id: UUIDTypes;
  verified: Boolean;
}

//TODO: create models instead of passing a bunch of variables around
// Function to handle user login
export const login = async (email: String, password: string) => {
  try {
    // Data object (credentials) to be sent in the post request
    const data = {
      // Email provided by the user
      email: email.toLowerCase(),
      // Password provided by the user
      password: password,
    };

    // Send POSt request to the API with login credentials
    const response = await axios.post(`${apiURL}/login`, data);

    // If response is successul, return the login response
    if (response.data.status == 204) {
      const user: UserLoggedIn = response.data.data;
      return user;
    }

    // TODO: handling if the error is unsuccessful
    return response.data;

    //TODO: error handling
  } catch (error) {
    console.log(error);
  }
  return "";
};

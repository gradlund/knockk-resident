import axios from "axios";
import { UUIDTypes } from "uuid";
import { number } from "zod";

// URL for the api
const apiURL = "http://localhost:3000/residents";

// Interface for login response
interface UserLoggedIn {
  id: UUIDTypes;
  verified: Boolean;
}

// Interface for getting neighboring units response
interface NeighborUnit {
  direction: String;
  floor: number;
  room: number;
}

// Must match what api is sending
// Interface for getting neighboring residents response
interface NeighborResident {
  name: string;
  profilePhoto: string; //?
  connected: boolean;
  residentId: UUIDTypes;
}

//TODO: create models instead of passing a bunch of variables around
// Function to handle user login
export const login = async (email: string, password: string) => {
  try {
    // Data object (credentials) to be sent in the post request
    const data = {
      // Email provided by the user
      email: email.toLowerCase(),
      // Password provided by the user
      password: password,
    };

    // Send POST request to the API with login credentials
    const response = await axios.post(`${apiURL}/login`, data);

    // If response is successful, return the login response
    if (response.data.status == 204) {
      // could do response.status? data.status is checking the code I send
      const user: UserLoggedIn = response.data.data;
      console.log(response.data.data);
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

export const getNeighborUnits = async (residentId: UUIDTypes) => {
  try {
    // Send GET request
    const response = await axios.get(`${apiURL}/${residentId}/neighbor-units`);

    // If response is successful
    if (response.status == 200) {
      const neighbors: [NeighborUnit] = response.data.data;
      return neighbors;
    }

    //Handle errors
  } catch (e) {
    //TODO: error handling
    console.log(e);
  }
};

// if profile photo is  null, set it to the default ? photo
export const getNeighborResidents = async (
  residentId: UUIDTypes,
  floor: number,
  room: number
) => {
  try {
    // Send GET request
    const response = await axios.get(
      `${apiURL}/${residentId}/neighbor-units/${floor}-${room}`
    );

    // If response is successful
    if (response.status == 200) {
      //TODO: what if profile photo is null?
      const neighbors: [NeighborResident] = response.data.data;

      return neighbors;
    }

    //Handle errors
  } catch (e) {
    //TODO: error handling
    console.log(e);
  }
};

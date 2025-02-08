import axios from "axios";
import { UUIDTypes } from "uuid";

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

// Interface for friendship response
interface FriendshipResponse {
  inviteeId: UUIDTypes;
  invitorId: UUIDTypes;
  accepted: boolean;
}

// Interface for resident
export interface Resident extends OptionalResident {
  id: UUIDTypes;
  firstName: string;
  lastName: string;
  gender: Gender;
}

// Interface for fields that are optional for the resident
export interface OptionalResident {
  age: number;
  hometown: string;
  biography: string;
  profilePhoto: string;
  backgroundPhoto: string;
  instagram: string;
  snapchat: string;
  x: string;
  facebook: string;
}

// Enum for gender
enum Gender {
  Female,
  Male,
  Undisclosed,
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

      //TODO: if verfied is false
    }

    // TODO: handling if the error is unsuccessful
    return response.data;

    //TODO: error handling
  } catch (error) {
    console.log(error);
  }
  return "";
};

// Function to retrieve neighboring units by the resident's id
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

    //If can't get neighbors
    if (e.response.status == 404) {
      console.log("Problem retrieving units.");
      return null;
    } else if (e.response.status == 500) {
      console.log("Problem with API.");
      return null;
    }
  }
};

// if profile photo is  null, set it to the default ? photo
// Function to retrieve neighboring residents, given the resident's (user's) id, floor, and room
export const getNeighborResidents = async (
  residentId: UUIDTypes,
  floor: number,
  room: number
) => {
  try {
    console.log(residentId);
    // Send GET request
    const response = await axios.get(
      `${apiURL}/${residentId}/neighbor-units/${floor}-${room}`
    );

    // If response is successful
    if (response.status == 200) {
      //TODO: what if profile photo is null?
      const neighbors: [NeighborResident] = response.data.data;

      // Return the response
      return neighbors;
    }

    //Handle errors
  } catch (e) {
    //TODO: error handling
    console.log(e);
  }
};

// Function to retrieve friendship, given the resident and friend's ids
export const getFriendship = async (
  residentId: UUIDTypes,
  neighborId: UUIDTypes
) => {
  try {
    // Send GET request
    const response = await axios.get(
      `${apiURL}/${residentId}/friendship/${neighborId}`
    );

    // If response is successful
    if (response.status == 200) {
      const friendship: FriendshipResponse = response.data.data;

      // Return response
      return friendship;
    }

    //Handle errors
  } catch (e) {
    //If not friendship exists
    if (e.response.status == 404) {
      console.log("Friendship does noto exist.");
      return null;
    }
    //TODO: other error handling
    else {
      console.log(e);
    }
  }
};

// Function to retrieve resident, given their id
export const getResident = async (residentId: UUIDTypes) => {
  try {
    // Send GET request
    const response = await axios.get(`${apiURL}/${residentId}`);

    // If response is successful
    if (response.status == 200) {
      //TODO: what if profile photo is null?
      const resident: Resident = response.data.data;

      // Return response
      return resident;
    }

    //Handle errors
  } catch (e) {
    //TODO: error handling
    console.log(e);
  }
};

// Function to update the resident, given the resident's  id and optional fields that will be updated
export const updateResident = async (
  resident: OptionalResident,
  id: UUIDTypes
) => {
  try {
    // Data object to be sent in the post request
    const data: OptionalResident = {
      age: resident.age,
      hometown: resident.hometown,
      biography: resident.biography,
      profilePhoto: resident.profilePhoto,
      backgroundPhoto: resident.backgroundPhoto,
      instagram: resident.instagram,
      snapchat: resident.snapchat,
      x: resident.x,
      facebook: resident.facebook,
    };

    // Send POST request to the API
    const response = await axios.post(`${apiURL}/${id}`, data);

    console.log(response);

    // Return true if no problems with the response
    return true;

    //Handle errors
  } catch (e) {
    //TODO: error handling
    console.log(e);
    return false;
  }
};

// Function to update the friendship, given the invitor id, invitee id, and if it's accepted
export const updateFriendship = async (
  invitorId: UUIDTypes,
  inviteeId: UUIDTypes,
  accepted: boolean
) => {
  try {
    // Data object (friendship) to be sent in the post request
    const data = {
      // Invitor id - resident making friendship request
      invitorId: invitorId,
      // Invitee id = resident who is receiving the request
      inviteeId: inviteeId,
      // isAccepted; required in the post request
      isAccepted: accepted,
    };

    // Send POST request to the API with login credentials
    const response = await axios.post(`${apiURL}/friendship`, data);

    // If response is successful, return the login response
    //TODO: probably don't need to return the response
    if (response.data.status == 201) {
      // could do response.status? data.status is checking the code I send
      const friendship: FriendshipResponse = response.data.data;
      console.log(response.data.data);
      return friendship;
    }
    // TODO: handling if the error is unsuccessful
    return response.data;

    //TODO: error handling
  } catch (error) {
    console.log(error);
  }
};

// Function to delete the friendship given the resident's (user's) id and friend's id
export const deleteFriendship = async (
  residentId: UUIDTypes,
  friendId: UUIDTypes
) => {
  try {
    // Send POST request to the API with the id's
    const response = await axios.delete(
      `${apiURL}/${residentId}/friendship/${friendId}`
    );

    // If response is successful, return the login response
    //TODO: probably don't need to return the response. error handling
    if (response.data.status == 204) {
      // could do response.status? data.status is checking the code I send
      const responseRe = response.data;
    }
    // Return the response
    return response.data;

    //TODO: error handling
  } catch (error) {
    console.log(error);
  }
};

import axios from "axios";
import { UUIDTypes } from "uuid";
import { RegisterState } from "../state/RegisterStore";
import {
  UserLoggedIn,
  NeighborUnit,
  NeighborResident,
  FriendshipResponse,
  Register,
  Resident,
  Gender,
  OptionalResident,
} from "./types/types";

// URL for the api
const apiURL = "http://localhost:3000/residents";

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
    //if (response.data.status == 204) {
    // could do response.status? data.status is checking the code I send
    const user: UserLoggedIn = response.data.data;
    if (user.id != undefined) {
      if (user.verified) {
        return user.id;
      }
      return Promise.reject("User is not verified.");
    } else {
      return Promise.reject("User does not exist.");
    }
    //Handle errors
  } catch (error) {
    return handleError(error)
  }
};

export const getBuildings = async (street: string) => {
  try {
    // Send GET request
    const response = await axios.get(`${apiURL}/building/${street}`);

   
    console.log(response.data.data)
    console.log("getting buildings")
    // If response is successful
    return response.data.data;
    

    //Handle errors
  } catch (error) {
    // Return the error
    return handleError(error);
  }
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
  } catch (error) {
    // Return the error
    return handleError(error);
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
  } catch (error) {
    // Return the error
    return handleError(error);
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
  } catch (error) {
    // Return the error
    return handleError(error);
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
  } catch (error) {
    // Return the error
    return handleError(error);
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

    // Return true if no problems with the response
    return true;

    //Handle errors
  } catch (error) {
    // Return the error
    return handleError(error);
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

    //Handle errors
  } catch (error) {
    // Return the error
    return handleError(error);
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

    // Return the response
    return response.data;

    //Handle errors
  } catch (error) {
    // Return the error
    return handleError(error);
  }
};

export const register = async (resident: RegisterState) => {
  try {
    // Data object (friendship) to be sent in the post request
    // TODO - does it only map strings?
    const data = {
      id: resident.id,
      firstName: resident.firstName,
      lastName: resident.lastName,
      gender: resident.gender,
      leaseId: resident.leaseId,
      age: resident.age != undefined ? resident.age : null,
      hometown: resident.hometown ? resident.hometown : null,
      biography: resident.biography ? resident.biography : null,
      profilePhoto: resident.profilePhoto ? resident.profilePhoto : null,
      backgroundPhoto: resident.backgroundPhoto
        ? resident.backgroundPhoto
        : null,
      instagram: resident.instagram ? resident.instagram : null,
      snapchat: resident.snapchat ? resident.snapchat : null,
      x: resident.x ? resident.x : null,
      facebook: resident.facebook ? resident.facebook : null,
    };

    // Send POST request to the API with login credentials
    const response = await axios.post(`${apiURL}/`, data);

    // could do response.status? data.status is checking the code I send
    return response.data.data;


    //Handle errors
  } catch (error) {
    // Return the error
    return handleError(error);
  }
};

// Function to handle account registration
export const registerAccount = async (email: string, password: string) => {
  try {
    // Data object (credentials) to be sent in the post request
    const data = {
      // Email provided by the user
      email: email.toLowerCase(),
      // Password provided by the user
      password: password,
    };

    // Send POST request to the API with login credentials
    const response = await axios.post(`${apiURL}/create-account`, data);

   
    // could do response.status? data.status is checking the code I send
    const uuid: UUIDTypes = response.data.data;
    return uuid;

    //Handle errors
  } catch (error) {
    // Return the error
    return handleError(error);
  }
};

// Function to retrieve resident, given their id
export const getLease = async (
  address: String,
  buildingName: String,
  room: number,
  floor: number,
  startDate: Date,
  endDate: Date
) => {
  try {
    console.log(startDate)
    console.log(endDate)
    // Send GET request
    const response = await axios.get(`${apiURL}/lease`, {
      params: {
        address: address,
        buildingName: buildingName,
        room: room,
        floor: floor,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      },
    });

    return response.data.data;

    //Handle errors
  } catch (error) {
    // Return the error
    return handleError(error);
  }
};

const handleError = (error) => {
  if (error.response == undefined) {
    return Promise.reject("Network error.");
  }
  else if(error.response.status == undefined){
    return Promise.reject("Network error.")
  }
  // Don't show sql errors
  else if(error.response.data.data.Error.includes("PreparedStatementCallback")){
    return Promise.reject("Problem saving data.")
  }
  else if(error.response.status == 302){
    return Promise.reject(error.response.data.data.Error)
  }
  else if(error.response.status == 400){
    console.log(error.response.data.data.Error)
    return Promise.reject(error.response.data.data.Error.toString())
  }
  else if (error.response.status == 403) {
    // Is resulting in " Invalid UUID string: undefined"
    //return Promise.reject(error.response.data.data.Error);
    return Promise.reject("invalid credentials")
  }
  // If it does not exist or problem retrieving
  else if (error.response.status == 404) {
    console.log("oops 404")
    return Promise.reject("does not exist or problem retrieving.");
  } else if (error.response.status == 500) {
    //console.log("500")
    //console.log(error.response.data.data.Error);
    // If sent by the database
    if (error.response.data.error) {
      console.log("ope");
      return Promise.reject(error.response.data.error);
    }
    // Else if not
    else if(error.response.status){
      console.log(error.response.status)
    }
    else {
      console.log("here")
      //console.log(error.response.data.data.Error);
      return Promise.reject("Problem with the API.");
    }
  }
  else{
  return Promise.reject("Problem with API service.");
  }
};

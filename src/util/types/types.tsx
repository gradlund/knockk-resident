import { UUIDTypes } from "uuid";

// Interface for login response
export interface UserLoggedIn {
  id: UUIDTypes;
  verified: Boolean;
}

// Interface for getting neighboring units response
export interface NeighborUnit {
  direction: String;
  floor: number;
  room: number;
}

// Must match what api is sending
// Interface for getting neighboring residents response
export interface NeighborResident {
  name: string;
  profilePhoto: string; //?
  connected: boolean;
  residentId: UUIDTypes;
}

// Interface for friendship response
export interface FriendshipResponse {
    inviteeId: UUIDTypes;
    invitorId: UUIDTypes;
    accepted: boolean;
  }
  
  export interface Register extends Resident {
    leaseId: UUIDTypes;
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
  export enum Gender {
    Female,
    Male,
    Undisclosed,
  }
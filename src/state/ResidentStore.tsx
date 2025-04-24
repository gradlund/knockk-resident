import { create } from "zustand";
import { Gender, OptionalResident, Resident } from "../util/types/types";
import { UUIDTypes } from "../util/types/types";

// Define actions of the store
type ResidentAction = {
  // Set resident state
  setResidentId(id: UUIDTypes): void;
  // Get the residents id
  getResidentId(): UUIDTypes;
  // Set the resident
  setResident(resident: Resident): void;
  // Update resident
  updateResidentStore(optionalInfo: OptionalResident): void;
  //Get if the resident is verified
  isVerified(): boolean;
  // Clear the id
  logout(): void;
};

// Define state of the store
type ResidentState = {
  // Unique identifier of the admin
  id: UUIDTypes;
  // If the user has been verified by the admin
  // Sent in the response
  verified: boolean;
  //resident
  resident: Resident;
};

// Create the store which includes actions and state
export const useResidentStore = create<ResidentAction & ResidentState>(
  (set, get) => ({
    id: "",
    verified: false,
    resident: {
      id: "",
      firstName: "",
      lastName: "",
      gender: Gender.Undisclosed,
      age: 0,
      hometown: "",
      biography: "",
      profilePhoto: "",
      backgroundPhoto: "",
      instagram: "",
      snapchat: "",
      x: "",
      facebook: "",
    },

    setResidentId: (id: UUIDTypes) => {
      set({ id: id });
    },
    getResidentId: () => {
      return get().id;
    },
    isVerified: () => {
      return get().verified;
    },
    setResident: (resident: Resident) => {
      set({ resident: resident });
    },
    updateResidentStore: (optionalInfo: OptionalResident) => {
      const updatedResident = {
        id: get().resident.id,
        firstName: get().resident.firstName,
        lastName: get().resident.lastName,
        gender: get().resident.gender,
        age: optionalInfo?.age,
        hometown: optionalInfo?.hometown,
        biography: optionalInfo?.biography,
        profilePhoto: optionalInfo?.profilePhoto,
        backgroundPhoto: optionalInfo?.backgroundPhoto,
        instagram: optionalInfo?.instagram,
        snapchat: optionalInfo?.snapchat,
        x: optionalInfo?.x,
        facebook: optionalInfo?.facebook,
      };
      set({ resident: updatedResident });
    },
    //TODO: add logout functionality
    logout: () => {
      set({ id: undefined });
    },
  })
);

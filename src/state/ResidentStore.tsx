import { create } from "zustand";
import { UUIDTypes } from "uuid";

// Define type for UUID
type UUID = UUIDTypes;

// Define actions of the store
type ResidentAction = {
  // Set resident state
  setResident(id: UUID): void;
  // Get the residents id
  getResidentId(): UUID;
  //Get if the resident is verified
  isVerified(): boolean;
  // Clear the id
  logout(): void;
};

// Define state of the store
type ResidentState = {
  // Unique identifier of the admin
  id: UUID;
  // If the user has been verified by the admin
  // Sent in the response
  verified: boolean;
};

// Create the store which includes actions and state
export const useResidentStore = create<ResidentAction & ResidentState>(
  (set, get) => ({
    id: "",
    verified: false,

    setResident: (id: UUID) => {
      set({ id: id });
    },
    getResidentId: () => {
      return get().id;
    },
    isVerified: () => {
      return get().verified;
    },
    //TODO: add logout functionality
    logout: () => { set({id: undefined})},
  })
);

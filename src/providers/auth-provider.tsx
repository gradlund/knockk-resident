import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";
import { useResidentStore } from "../state/ResidentStore";
import { getResident } from "../util/APIService";
import { UUIDTypes } from "../util/types/types";

// Create the auth context.
const AuthContext = createContext<{
  // Used to sign in a user by id
  signIn: (uuid: UUIDTypes) => void; //TODO - change to UUID
  // Used to signout the user
  signOut: () => void;
  session?: string | null;
  // Used to see if component is still mounting
  mounting: boolean;
}>({
  signIn: (uuid: UUIDTypes) => null,
  signOut: () => null,
  session: null,
  mounting: true,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }
  return value;
}

// Auth provider that wraps the app and provides authentication context.
export function AuthProvider({ children }: PropsWithChildren) {
  // Functions from the useResidentStore
  const { setResidentId, setResident, logout, id } = useResidentStore();
  //const [session, setSession] = useState(null);
  // State to track if component is still mounting
  const [mounting, setMount] = useState(true);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (uuid: UUIDTypes) => {
          console.log(uuid);
          // Perform sign-in logic here
          setResidentId(uuid);
          try {
            const resident = await getResident(uuid);
            console.log(resident?.firstName + "authprovicer");
            setResident(resident!); // force unwarp; handle null
          } catch {
            // TODO - redirect to error page
          }
          setMount(false);
        },
        signOut: () => {
          logout();
        },
        //session,
        mounting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

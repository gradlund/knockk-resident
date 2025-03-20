import { Slot } from "expo-router";
import { AuthProvider } from "../providers/auth-provider";

export default function Root() {
  // Wrap in the auth provider
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}

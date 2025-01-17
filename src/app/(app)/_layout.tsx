import { TouchableOpacity } from "react-native";
import { Redirect, Stack } from "expo-router";

import { useAuth } from "../../providers/auth-provider";
import { useResidentStore } from "../../state/ResidentStore";
import { Ionicons } from "@expo/vector-icons";

export default function AppLayout() {
  const { mounting } = useAuth();
  const { id } = useResidentStore();

  // You can keep the splash screen open, or render a loading screen like we do here.
  // if (mounting) {
  //   return <Text>Loading...</Text>;
  // }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!id) {
    //Redirect to sign in if not logged in
    return <Redirect href="/sign-in" />;
  }

  // Return the stack of home page and profile
  return (
    <Stack screenOptions={{ headerShown: false, title: "" }}>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Home" }}
      />
      <Stack.Screen
        name="profile"
        //options={{ headerShown: true, title: "Profile" }}
        options={({ navigation }) => ({
          headerShown: true,
          title: "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack>
  );
}
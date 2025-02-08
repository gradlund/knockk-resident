import { Alert, Button, Text, TouchableOpacity, View } from "react-native";
import { Redirect, Stack, useNavigation, useRouter } from "expo-router";

import { useAuth, useSession } from "../../providers/auth-provider";
import { useResidentStore } from "../../state/ResidentStore";
import { Ionicons } from "@expo/vector-icons";
import Profile from "./profile";
import { useEffect, useState } from "react";
import Edit from "./edit";
import { Resident, getResident } from "../../util/APIService";

export default function AppLayout() {
  const { id, logout } = useResidentStore();

  const router = useRouter();

  // If an id is not stored, redirect to login
  if (!id) {
    //Redirect to sign in if not logged in
    return <Redirect href="/sign-in" />;
  }

  // State for resident
  const [resident, setResident] = useState<Resident>();

  // On load, fetch the resident's infomration. This will be passed as a param to the edit screen
  useEffect(() => {
    fetchResident();
  });

  // This method handles fetching the resident's information
  const fetchResident = async () => {
    let resident: Resident | undefined = await getResident(id);
    setResident(resident);
  };

  // This function handles when a user clicks on the elipsis on the right hand navigation bar
  const handleAlert = async () => {
    if (resident!) {
      Alert.alert("", "", [
        {
          // Clicking on edit, naigate them to the edit screen passing the resident information
          text: "Edit",
          onPress: () => {
            router.push({
              pathname: "edit",
              params: {
                resident: JSON.stringify(resident!),
              },
            });
          },
        },
        // Clicking logout, will pop up another alert
        {
          text: "Logout",
          onPress: () => {
            handleLogout();
          },
        },
      ]);
    }
  };

  // This function handles when a user clicks on the logout option of the alert.
  // Asks the user if they are sure they want to logout.
  const handleLogout = () => {
    Alert.alert("Are you sure you want to logout?", "", [
      // If yes, log them out and redirect them to login
      {
        text: "Yes",
        onPress: () => {
          console.log("Logging out");
          // AuthProvider
          logout(); // or should I use auth provider?
          router.push("/sign-in");
        },
      },
      // If no, dismiss the alert
      { text: "No", onPress: () => console.log("Not signing out") },
    ]);
  };

  // Return the stack of home page and profile
  return (
    <Stack screenOptions={{ headerShown: false, title: "" }}>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Home" }}
      />
      <Stack.Screen
        name="profile"
        options={({ navigation }) => ({
          headerShown: true,
          title: "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            // <View style={{}}>
            // <TouchableOpacity style={{right: 0}} onPress={() => {showPopup ? setShowPopup(false) : setShowPopup(true)
            //   navigation.navigate("profile", {showPopup: showPopup})}
            // }>
            //   <Ionicons name="ellipsis-vertical" size={18} color="black" />
            //   {/* {showPopup &&
            // } */}
            // </TouchableOpacity>
            // </View>
            <View style={{}}>
              <TouchableOpacity style={{ right: 0 }} onPress={handleAlert}>
                <Ionicons name="ellipsis-vertical" size={18} color="black" />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="edit"
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

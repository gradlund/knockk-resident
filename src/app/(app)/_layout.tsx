import { Alert, Button, Text, TouchableOpacity, View } from "react-native";
import { Redirect, Stack } from "expo-router";

import { useAuth } from "../../providers/auth-provider";
import { useResidentStore } from "../../state/ResidentStore";
import { Ionicons } from "@expo/vector-icons";
import Profile from "./profile";
import { useState } from "react";

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

  // on view, always set it to false
const [showPopup, setShowPopup] = useState(false)

const handleEdit = () => {
  console.log("edit")
  Alert.alert('Alert Title', 'My Alert Msg', [
    {
      text: 'Ask me later',
      onPress: () => console.log('Ask me later pressed'),
    },
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]);
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
        //component={Profile}
        //options={{ headerShown: true, title: "Profile" }}
        options={({ navigation }) => ({
          headerShown: true,
          title: "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{}}>
            <TouchableOpacity style={{right: 0}} onPress={() => {showPopup ? setShowPopup(false) : setShowPopup(true)
              navigation.navigate("profile", {showPopup: showPopup})}
            }>
              <Ionicons name="ellipsis-vertical" size={18} color="black" />
              {/* {showPopup && 
             
            } */}
            </TouchableOpacity>
           
            </View>
            
          ),
        })}
      />
    </Stack>
  );
}
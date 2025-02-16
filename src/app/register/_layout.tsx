import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function _layout() {
  // Return layout route for the directory
  return (
    // Hides header for all other routes
    <Stack screenOptions={{ headerShown: true, contentStyle: {backgroundColor: "white" }}} >
      {/* Name has to correlate with the file name*/}
      <Stack.Screen
        name="general"
        options={({ navigation }) => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="living"
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
       <Stack.Screen
        name="personal"
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
       <Stack.Screen
        name="photo"
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
       <Stack.Screen
        name="social"
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
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function _layout() {
  // Return layout route for the directory
  return (
    // Hides header for all other routes
    <Stack screenOptions={{ headerShown: false }}>
      {/* Name has to correlate with the file name*/}
      <Stack.Screen
        name="index"
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

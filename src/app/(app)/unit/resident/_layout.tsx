import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import ResidentScreen from ".";

export default function _layout() {
  return (
    // Hides header for all other routes
    <Stack screenOptions={{ headerShown: false}}>
      {/* Name has to correlate with the file name*/}
      <Stack.Screen
     // component={ResidentScreen}
        name="index"
        
        //options={{headerShown:false}}
        options={({ navigation }) => ({
        //   headerStyle: {
        //     backgroundColor: '#000000'
        //  },
          title: "",
          //component: "ResidentScreen",
          headerShown: true,
          //instead of go back I think I should route to unit
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

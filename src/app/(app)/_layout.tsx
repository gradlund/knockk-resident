import { Ionicons } from "@expo/vector-icons";
import { Redirect, Stack, useRouter } from "expo-router";
import { Alert, TouchableOpacity, View } from "react-native";
import { useResidentStore } from "../../state/ResidentStore";

export default function AppLayout() {
  const { id, logout } = useResidentStore();

  const router = useRouter();

  // If an id is not stored, redirect to login
  if (!id) {
    //Redirect to sign in if not logged in
    return <Redirect href="/sign-in" />;
  }

  // State for resident
  //const [resident, setResident] = useState<Resident>();
  const { resident } = useResidentStore();

  // This function handles when a user clicks on the elipsis on the right hand navigation bar
  const handleAlert = async () => {
    console.log("alert");
    if (resident!) {
      Alert.alert("", "", [
        {
          // Clicking on edit, naigate them to the edit screen passing the resident information
          text: "Edit",
          onPress: () => {
            router.push({
              pathname: "edit",
              // params: {
              //   resident: JSON.stringify(resident!),
              // },
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
    <Stack
      screenOptions={{
        headerShown: false,
        title: "",
        contentStyle: { backgroundColor: "white" },
      }}
    >
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
      <Stack.Screen
        name="error"
        options={({ navigation }) => ({
          headerShown: false,
          title: "",
        })}
      />
    </Stack>
  );
}

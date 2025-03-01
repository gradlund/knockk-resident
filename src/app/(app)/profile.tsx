import { Alert, Button, Pressable, Text, TouchableOpacity } from "react-native";
import { SafeAreaView, StyleSheet } from "react-native";
import { Resident } from "../../components/Resident";
import { useResidentStore } from "../../state/ResidentStore";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { getResident } from "../../util/APIService";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider } from "../../providers/auth-provider";
import { styles } from "../../assets/Stylesheet";

// Profile screen
// Matches '/profile' route?
const Profile = () => {
  const { id, logout } = useResidentStore();

  const [showPopup, setShowPopup] = useState(false);

  const navigator = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();

  // let popupParam : boolean = params.showPopup

  // const [popup, setPopup] = useState<boolean>(false);
  // console.log(popupParam + "popup is shown")

  const [edit, setEdit] = useState(false);

  // useEffect(() => {
  //   setPopup(popupParam);
  //   setEdit(false)
  //   console.log(popup + " new pop up");
  // }, [popupParam])

  // useFocusEffect(() => {
  //   // setEdit(false)
  //   // setPopup(false)
  //   //setEdit(false)

  //   //When out of focuse
  //   return() => {

  //   }
  // })

  return (
    <View 
    //style={{ flex: 1 }}
    >
      {/* <Button title="hi" onPress={handleEdit} />
      {popup && 
       <View style={styles.popup}>
       <TouchableOpacity style={styles.button} onPress={handleEdit}>
        <Text>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEdit(true)}>
        <Text style={{ color: "red"}}>Edit</Text>
        </TouchableOpacity>
        </View>
      //  <View>
      //   <TouchableOpacity style={styles.button}>
      //    <Button title="Edit" onPress={handleEdit} />
      //    </TouchableOpacity>
      //    <Text style={{ color: "red"}}>Logout</Text>
      //    </View>
      } */}
      <Resident
        residentId={id.toString()}
        name={""}
        photo={""}
        isConnected={false}
      />
    </View>
  );
};

export default Profile;


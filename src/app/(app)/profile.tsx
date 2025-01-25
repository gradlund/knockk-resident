import { Alert, Button, Text, TouchableOpacity } from "react-native";
import { SafeAreaView, StyleSheet } from "react-native";
import { Resident } from "../../components/Resident";
import { useResidentStore } from "../../state/ResidentStore";
import { useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { getResident } from "../../util/APIService";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider } from "../../providers/auth-provider"

// Profile screen
// Matches '/profile' route?
const Profile = () => {

  const {id, logout} = useResidentStore();

  const [showPopup, setShowPopup] = useState(false);

const navigator = useNavigation();
const params = useLocalSearchParams();


let popup : boolean = params.showPopup
console.log(popup)



  const fetchResident = async() => {
    //await getResident(id);
  }

  // useFocusEffect(() => {
  //   useCallback(()=>{
  //     fetchResident();
  //   }, [])
  // })

  // useEffect(() => {
  //     
  //     fetchResident();
  //   })

  const handleEdit = () => {
    console.log("edit")
    Alert.alert('Are you sure you want to logout?', '', [
      {
        text: 'Yes',
        onPress: () => 
        {
          console.log('Logging out')
         // AuthProvider
          logout(); // or should I use auth provider?

        }
      },
      // {
      //   text: 'No',
      //   onPress: () => console.log('Cancel Pressed'),
      //   style: 'cancel',
      // },
      {text: 'No', onPress: () => console.log('OK Pressed')},
    ]);
  }



  return (
    <SafeAreaView 
    //style={{ flex: 1 }}
    >
      {/* <Button title="hi" onPress={handleEdit} /> */}
      {popup && 
       <View>
         <Button title="Edit" onPress={handleEdit} />
         <Text style={{ color: "red"}}>Logout</Text>
         </View>
      }
      <Resident residentId={id.toString()} name={"profile"} photo={""} isConnected={false}/>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  popup: {
    top: -80,
  }
})

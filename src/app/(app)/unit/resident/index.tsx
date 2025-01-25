import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { Resident as ResidentComponent } from "../../../../components/Resident";
import { UUIDTypes } from "uuid";

//Must be named the name of the directoru
const Resident = () => {

      const router = useRouter();
      const params = useLocalSearchParams();

      const id = params.id.toString();
      const isConnectedParam = params.isConnected.toString().toLowerCase();
      const name = params.name.toString();
      const photo = params.photo.toString();

      let isConnected: boolean;


      // Need to convert param into boolean
      if(isConnectedParam.includes('true'))
        isConnected = true;
      else {
        isConnected = false;
      }


      return(
        <SafeAreaView style={{
          //backgroundColor: "pink", 
          top: -46,
          height: "100%"}}>
          <ResidentComponent residentId={id} name={name} photo={photo} isConnected={isConnected} />
        </SafeAreaView>
      )
      

}

export default Resident;
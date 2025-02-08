import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Resident as ResidentComponent } from "../../../../components/Resident";

// Must be named the name of the directory
// Resident screen
const Resident = () => {
  const params = useLocalSearchParams();

  // Retrieve the parameters so that they can be passed to the resident component
  const id = params.id.toString();
  const isConnectedParam = params.isConnected.toString().toLowerCase();
  const name = params.name.toString();
  const photo = params.photo.toString();

  let isConnected: boolean;

  console.log(isConnectedParam + "connection param");

  // Need to convert param into boolean
  if (isConnectedParam.includes("true")) {
    console.log("is connected");
    isConnected = true;
  } else {
    isConnected = false;
  }

  return (
    <SafeAreaView
      style={{
        top: -46,
        height: "100%",
      }}
    >
      <ResidentComponent
        residentId={id}
        name={name}
        photo={photo}
        isConnected={isConnected}
      />
    </SafeAreaView>
  );
};

export default Resident;

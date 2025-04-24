import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../assets/Stylesheet";

// Interface for props sent to component
interface ResidentRowProps {
  name: string;
  photo?: string;
  isConnected: boolean;
  //neighborId: UUIDTypes;
  neighborId: string;
}

// ResidentRow component that displays information about a neighboring resident
export const ResidentRow = ({
  name,
  photo,
  isConnected,
  neighborId,
}: ResidentRowProps) => {
  let photoURI = "";

  // If the photo is undefined and is connected, set the image to a circle
  if (photo == undefined && isConnected) {
    photoURI = ""; //TODO: line not necessary
  }
  // If the photo is undefined and they are not connected, show ? image
  else if (!isConnected) {
    photoURI = "not-connected"; // TODO: this line doesn't do anythign
  }
  // Show their photo
  else if (isConnected) {
    // Trim photo because it is stored in the db with ""
    // Force unwrap
    photoURI = photo!.replaceAll('"', "");
  }

  return (
    <View
      style={[
        styles.rowContainer,
        {
          backgroundColor: isConnected
            ? "rgb(230, 224, 255)"
            : "rgb(242, 240, 253)",
        },
      ]}
    >
      <Link
        href={{
          pathname: "unit/resident",
          params: {
            id: neighborId.toString(),
            isConnected: isConnected.toString(),
            name: name,
            photo: photoURI,
          },
        }}
      >
        <Pressable>
          {isConnected && (
            <Image
              style={styles.RowImage}
              source={{
                uri: photoURI ? `data:image/jpeg;base64,${photoURI}` : photoURI,
              }}
            />
          )}
          {!isConnected && (
            <View
              style={[
                styles.RowImage,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Ionicons name="help-circle-outline" size={40} color={"white"} />
            </View>
          )}

          <Text style={styles.RowName}>{name}</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default ResidentRow;

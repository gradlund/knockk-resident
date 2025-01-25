import { Pressable, StyleSheet, View } from "react-native";
import { UUIDTypes } from "uuid";
import { Image, Text } from "react-native"; //could also import from expo
import { Link } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Asset } from "expo-asset";

interface ResidentRowProps {
  name: string;
  photo?: string;
  isConnected: boolean;
  neighborId: UUIDTypes;
}
// ResidentRow component that displays information about a neighboring resident
export const ResidentRow = ({
  name,
  photo,
  isConnected,
  neighborId,
}: ResidentRowProps) => {
  let photoURI = "";
  console.log(name + isConnected);
  // If the photo is undefined and is connected, set the image to a circle
  if (photo == undefined && isConnected) {
    photoURI = ""; //TODO: line not necessary
  }
  // If the photo is undefined and they are not connected, show ? image
  //else if (photo == undefined && !isConnected) {
  else if (!isConnected) {
    photoURI = "../assets/not-connected"; // TODO: this line doesn't do anythign
    //console.log(photoURI);
  }
  // Show their photo
  else if (isConnected) {
    // Trim photo because it is stored in the db with ""
    // Force unwrap
    photoURI = photo!.replaceAll('"', "");
  }

  //console.log("resident row")

  //TODO : if isConnected, show profile, otherwise show default logo
  // if isconnected, but no photo, show different logo
  return (
    //TODO: touching over image isn't pressable for some reason
    <View
      style={[
        styles.container,
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
          {/* {isConnected && (photo == null) && 
          <FontAwesome5 style={styles.image} icon="question-circle" color="white" size={20}/>} */}
          {isConnected && (
            <Image
              style={styles.image}
              source={{
                uri: photoURI ? `data:image/jpeg;base64,${photoURI}` : photoURI,
              }}
            />
          )}
          {!isConnected && (
            <Image
              style={styles.image}
              source={require("../assets/not-connected.png")}
            />
          )}

          <Text style={styles.name}>{name}</Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 110,
    width: 350,
    backgroundColor: "F2F0FD",
    // flex: 1,
    // flexDirection: "row",
    // backgroundColor: "blue",
  },
  image: {
    borderRadius: 100,
    height: 50,
    width: 50,
    borderColor: "white",
    borderWidth: 2,
    top: 35,
    left: 26,
    resizeMode: "contain",
  },
  name: {
    left: 110,
    fontSize: 16,
    fontFamily: "AlbertSans-Regular",
    color: "#000",
    textAlign: "left",
    width: "100%",
  },
});

export default ResidentRow;

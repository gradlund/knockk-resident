import { Image, StyleSheet, View, Text } from "react-native";
import { styles } from "../assets/Stylesheet";
import { Ionicons } from "@expo/vector-icons";

// Interface for props
interface ProfileProps {
  isFriends: boolean;
  isUser: boolean;
  uri: string | undefined;
}

// Profile photo component
export const ProfilePhoto = ({ isFriends, isUser, uri }: ProfileProps) => {
  // console.log("=")
  // console.log(uri == undefined && !isUser && isFriends)
  // console.log(uri?.includes("../assets/not-connected"))
  // console.log(isUser && uri!)
  // console.log(uri == undefined && isUser)
  // console.log(!isUser && !uri?.includes("../assets/not-connected"))
  console.log(uri)
  return (
    <View style={{height: 0}}>
      {uri == undefined && !isUser && isFriends && (
        <Image
          style={styles.residentNotConnected}
          source={require("../assets/no-profile.png")}
        />
      )}
      {/* if the photo is undefined, that means that they are not connected? could also check if connected is false */}
      {uri?.includes("not-connected") && (
        <View style={[styles.residentPhoto, {justifyContent: "center", alignItems: "center"}]} >
        <Ionicons name="help-circle-outline" size={40} color={"white"} />
        </View>
      )}

      {!isUser && uri && (
        <View>
          <Text>hi</Text>
        <Image
          style={styles.residentPhoto}
          source={{ uri: `data:image/jpeg;base64,${uri?.replaceAll('"', "")}` }}
        />
        </View>
      )}
      {isUser && uri && (
        <Image
          style={styles.profile}
          source={{ uri: `data:image/jpeg;base64,${uri?.replaceAll('"', "")}` }}
        />
      )}
      {uri == undefined && isUser && (
        <View style={[styles.profile, {justifyContent: "center", alignItems: "center"}]} >
       {/* <Ionicons name="help-circle-outline" size={40} color={"white"} />*/}
        </View>
      )}
      {/* if they are not connected, it will say not connected. if connected and no photo,  it will be blank */}
      {!isUser && !uri?.includes("not-connected") && !isFriends && (
        // <Image
        //   style={styles.residentPhoto}
        //   source={{ uri: `data:image/jpeg;base64,${uri?.replaceAll('"', "")}` }}
        // />
        <View style={[styles.residentPhoto, {justifyContent: "center", alignItems: "center"}]} >
        <Ionicons name="help-circle-outline" size={80} color={"white"} />
        </View>
      )}
      {/* {!isFriends && (
        <Image style={styles.residentNoTConnected} source={require("../assets/no-profile.png")} />
      )} */}
    </View>
  );
};



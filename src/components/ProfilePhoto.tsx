import { Image, StyleSheet, View } from "react-native";

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
  return (
    <View style={{height: 0}}>
      {uri == undefined && !isUser && isFriends && (
        <Image
          style={styles.residentNotConnected}
          source={require("../assets/no-profile.png")}
        />
      )}
      {/* if the photo is undefined, that means that they are not connected? could also check if connected is false */}
      {uri?.includes("../assets/not-connected") && (
        <Image
          style={styles.residentNotConnected}
          source={require("../assets/not-connected.png")}
        />
      )}

      {isUser && !uri && (
        <Image
          style={styles.profile}
          source={{ uri: `data:image/jpeg;base64,${uri?.replaceAll('"', "")}` }}
        />
      )}
      {isUser && uri && (
        <Image
          style={styles.profile}
          source={{ uri: `data:image/jpeg;base64,${uri?.replaceAll('"', "")}` }}
        />
      )}
      {/* {uri == undefined && isUser && (
        <Image
          style={styles.profile}
          source={require("../assets/no-profile.png")}
        />
      )} */}
      {/* if they are not connected, it will say not connected. if connected and no photo,  it will be blank */}
      {!isUser && !uri?.includes("../assets/not-connected") && !isFriends && (
        <Image
          style={styles.residentPhoto}
          source={{ uri: `data:image/jpeg;base64,${uri?.replaceAll('"', "")}` }}
        />
      )}
      {/* {!isFriends && (
        <Image style={styles.residentNoTConnected} source={require("../assets/no-profile.png")} />
      )} */}
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  profile: {
    top: -80,
    left: 10,
    alignSelf: "center",
    borderRadius: 100,
    height: 150,
    width: 150,
    borderColor: "white",
    borderWidth: 4,
    //resizeMode: "cover",
    backgroundColor: "#CBC1F6",
  },
  residentNotConnected: {
    top: -50,
    left: 26,
    borderRadius: 100,
    height: 100,
    width: 100,
    borderColor: "#CBC1F6",
    borderWidth: 4,
    resizeMode: "cover",
    backgroundColor: "#E6E0FF",
  },
  residentPhoto: {
    top: -50,
    left: 26,
    borderRadius: 100,
    height: 100, // Should use a circle instaed because this is throwing the other styles off
    width: 100,
    borderColor: "white",
    borderWidth: 4,
    resizeMode: "contain",
    backgroundColor: "#CBC1F6",
  },
});

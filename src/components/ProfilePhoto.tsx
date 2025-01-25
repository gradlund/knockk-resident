import { Image, StyleSheet, View } from "react-native";

interface ProfileProps {
    isFriends: boolean;
  isUser: boolean;
  uri: string;
}

export const ProfilePhoto = ({isFriends, isUser, uri}: ProfileProps) => {
    console.log(uri + "uri")
    console.log(isUser)
    console.log(uri.includes("../assets/no-profile"))
    console.log(isFriends + " is firends")

    return(
        <View>
{/* if the photo is undefined, that means that they are not connected? could also check if connected is false */}
      {(uri.includes("../assets/not-connected")) && 
        <Image
          style={styles.residentNotConnected}
          source={require("../assets/not-connected.png")}
        />
      }

       {isUser && <Image style={styles.profile} source={{ uri: `data:image/jpeg;base64,${uri}` }} />}
       {/* if they are not connected, it will say not connected. if connected and no photo,  it will be blank */}
      {!isUser && (!uri.includes("../assets/not-connected")) && <Image style={styles.residentPhoto} source={{ uri: `data:image/jpeg;base64,${uri}` }} /> }
      {/* {!isFriends && (
        <Image style={styles.residentNoTConnected} source={require("../assets/no-profile.png")} />
      )} */}
      </View>
    )
}

const styles = StyleSheet.create({
    profile : {
        position: "absolute",
        top: 120,
        //left: 26,
        alignSelf: "center",
        borderRadius: 100,
        height: 150,
        width: 150,
        borderColor: "white",
        borderWidth: 4,
        resizeMode: "contain",
        backgroundColor: "#CBC1F6",
    },
    residentNotConnected : {
        position: "absolute",
        top: 150,
        left: 26,
        borderRadius: 100,
        height: 100,
        width: 100,
        borderColor: "#CBC1F6",
        borderWidth: 4,
        resizeMode: "contain",
        backgroundColor: "#E6E0FF"
    },
    residentPhoto : {
        position: "absolute",
        top: 150,
        left: 26,
        borderRadius: 100,
        height: 100,
        width: 100,
        borderColor: "white",
        borderWidth: 4,
        resizeMode: "contain",
        backgroundColor: "#CBC1F6",
    }
})
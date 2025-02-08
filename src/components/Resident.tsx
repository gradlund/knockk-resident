import { useCallback, useEffect, useState } from "react";
import { useResidentStore } from "../state/ResidentStore";
import {
  getResident,
  Resident as ResidentModel,
} from "../util/APIService";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
} from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";

import { FriendshipButton } from "./FriendshipButton";
import Warning from "./Warning";
import { ProfilePhoto } from "./ProfilePhoto";
import { SocialMedia } from "./SocialMedia";

// Interface for props being sent to the component
interface ResidentProps {
  residentId: string;
  name: string;
  photo: string;
  isConnected: boolean;
}

// Interface for variables being sent to the SocialMedia component
interface Socials {
  platform: string;
  username: string;
}

export const Resident = ({
  residentId,
  name,
  photo,
  isConnected,
}: ResidentProps) => {

  // Id of the resident (saved in the store upon login)
  const { id } = useResidentStore();

  // State variables
  const [resident, setResident] = useState<ResidentModel>();
  const [errorMessage, setErrorMessage] = useState("");
  const [hasConnection, setConnection] = useState<boolean>(isConnected)

  // Social media array to be passed to the social media component
  let socials: Socials[] = [];
  let connection = true;

  const [socialMedia, setSocialMedia] = useState<Socials[]>();

  // Handles state when a user clicks on the friendship button
  const handleIsFriendsState = async (isFriends: boolean) => {
    connection = isFriends ? true : false ;

    setConnection(isFriends);
    // Empty resident (in case they are unconnected)
    setResident(undefined)
    // Fetch resident
    await fetchData()
  };

  const fetchData = async () => {
    // If on the profile page, retrieve resident
    // Or if they are connected, retrieve resident (all resident's info)
    if (residentId == id || (hasConnection && connection)) {
      const resident: ResidentModel | undefined = await getResident(residentId);
      if (resident?.snapchat)
        socials.push({ platform: "snapchat", username: resident.snapchat });
      if (resident?.x) socials.push({ platform: "x", username: resident.x });
      if (resident?.instagram)
        socials.push({ platform: "instagram", username: resident.instagram });
      if (resident?.facebook)
        socials.push({ platform: "facebook", username: resident.facebook });
      setSocialMedia(socials);
      setResident(resident);
    }
    // Else retrieve information about the friendship - is the invite is pending?
    else {
      setResident(undefined) // Do I need to clear this again?
      setErrorMessage(
        "Please connect with " + name + " to view their profile."
      );
    }
  };

  // Invoked every time this page is focused
  useFocusEffect(
    useCallback(() => {
      // Set states to undefined
      setResident(undefined)
      setSocialMedia(undefined);
      
      // Fetch data
      fetchData();

      // Does something when the screen is unfocused
      return () => {};
    }, [])
  );


  return (
    <View
      style={{
        backgroundColor: "white",
        height: "100%",
      }}
    >
      {id != residentId && (
        <FriendshipButton
          userId={id.toString()}
          friendId={residentId}
          isConnected={hasConnection}
          handleIsFriendsState={handleIsFriendsState}
        />
      )}
      {!hasConnection && residentId != id && (
        <View style={{ top: 400, alignSelf: "center", position: "absolute" }}>
          <Warning message={errorMessage} />
        </View>
      )}

      {/* Background  has to go ahead of profile photo, or else it will be on top of */}
      <Image
        style={styles.image}
        source={{
          //add default photo
          uri: resident?.backgroundPhoto
            ? `data:image/jpeg;base64,${resident.backgroundPhoto.replaceAll(
                '"',
                ""
              )}`
            : ``,
        }}
      />

      <ProfilePhoto
        isUser={id == residentId}
        uri={resident?.profilePhoto}
        isFriends={hasConnection}
      />

      {/* Name is shown regardless */}
      {resident?.firstName && <Text style={styles.name}>{resident?.firstName} {resident?.lastName}</Text>}
      {!resident?.firstName && <Text style={styles.name}>{name}</Text> }

      {(resident?.gender || isConnected || id == residentId) &&<Text style={styles.gender}>{resident?.gender}</Text>}
      {(resident?.hometown || isConnected || id == residentId) && (
        <Text style={styles.hometown}>{resident?.hometown}</Text>
      )}
      {(resident?.age || isConnected || id == residentId) && <Text style={styles.age}>{resident?.age ? resident!.age : ""}</Text>}
      {((resident?.biography && isConnected) || (resident?.biography && id == residentId)) && (
        <Text style={styles.bio}>{resident?.biography}</Text>
      )}
 

      {/* TODO: flatlist extends beyond safe area */}
      <FlatList
        style={styles.socials}
        data={socialMedia}
        renderItem={({ item }) => (
          <SocialMedia platform={item.platform} username={item.username} />
        )}
        keyExtractor={(item) => item.platform}
      />

      {!hasConnection && residentId != id && (
        <View style={styles.warning}>
          <Warning message={errorMessage} />
        </View>
      )}
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  age: {
    fontSize: 20,
    top: 310,
    right: 56,
    position: "absolute",
  },
  bio: {
    top: 410,
    width: 320,
    height: 150,
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "#E6E0FF",
    padding: 20,
    borderRadius: 10,
  },
  button: {},
  //TODO: font family not working
  gender: {
    fontSize: 16,
    fontStyle: "italic",
    fontFamily: "AlbertSans-Italic",
    top: 335,
    left: 36,
    position: "absolute",
  },
  hometown: {
    fontSize: 16,
    top: 360,
    left: 36,
    position: "absolute",
  },
  image: {
    //top: -4,
    position: "absolute",
    height: 212,
    width: "100%",
    resizeMode: "cover",
    backgroundColor: "#f2f0fd",
  },
  name: {
    fontSize: 22,
    fontFamily: "Albert-Sans",
    position: "absolute",
    top: 300,
    left: 36,
  },
  profile: {
    //width: 200,
  },
  socials: {
    width: 280,
    top: 600,
    alignSelf: "center",
    height: 100,
    overflow: "hidden",
  },
  warning: {
    // position: "absolute",
    top: 350,
  },
});

import { useCallback, useEffect, useState } from "react";
import { useResidentStore } from "../state/ResidentStore";
import {
  getResident,
} from "../util/APIService";
import { Resident as ResidentModel } from "../util/types/types";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  Touchable,
  ScrollView,
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
  const [residentInfo, setResidentInfo] = useState<ResidentModel>();
  const [errorMessage, setErrorMessage] = useState("");
  const [hasConnection, setConnection] = useState<boolean>(isConnected)

  // Social media array to be passed to the social media component
  let socials: Socials[] = [];
  let connection = true;

  const {resident} = useResidentStore()

  const [socialMedia, setSocialMedia] = useState<Socials[]>();

  // Handles state when a user clicks on the friendship button
  const handleIsFriendsState = async (isFriends: boolean) => {
    connection = isFriends ? true : false ;
    setConnection(isFriends);

    if(!connection){
      setErrorMessage(
        "Please connect with " + residentInfo?.firstName + " to view their profile."
      );
    // Empty resident (in case they are unconnected)
    setResidentInfo(undefined)
    setSocialMedia(undefined)
  }else{
    // Fetch resident
    await fetchData()
  }
  };

  const fetchData = async () => {
    // If on the profile page, retrieve resident
    // Or if they are connected, retrieve resident (all resident's info)
    if (residentId != id && (hasConnection && connection)) {
      console.log("resident")
      const resident: ResidentModel | undefined = await getResident(residentId);
      if (residentInfo?.snapchat)
        socials.push({ platform: "snapchat", username: residentInfo.snapchat });
      if (residentInfo?.x) socials.push({ platform: "x", username: residentInfo.x });
      if (residentInfo?.instagram)
        socials.push({ platform: "instagram", username: residentInfo.instagram });
      if (residentInfo?.facebook)
        socials.push({ platform: "facebook", username: residentInfo.facebook });
      setSocialMedia(socials);
      setResidentInfo(resident);
    }
    else if(residentId == id){
      setResidentInfo(resident)
      console.log("profile")
    }
    // Else retrieve information about the friendship - is the invite is pending?
    else {
      setResidentInfo(undefined) // Do I need to clear this again?
      setErrorMessage(
        "Please connect with " + name + " to view their profile."
      );
    }
  };

  // Invoked every time this page is focused
  useFocusEffect(
    useCallback(() => {
      // Set states to undefined
      setResidentInfo(undefined)
      setSocialMedia(undefined);
      
      // Fetch data
      fetchData();

      // Does something when the screen is unfocused
      return () => {};
    }, [])
  );

//https://reactnative.dev/docs/scrollview
  return (
    <ScrollView showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: "white",
        //flex: 1
        //overflow: "hidden"
      }}
    >

      {/* Background  has to go ahead of profile photo, or else it will be on top of */}
      <Image
        style={styles.image}
        source={{
          //add default photo
          uri: residentInfo?.backgroundPhoto
            ? `data:image/jpeg;base64,${resident.backgroundPhoto.replaceAll(
                '"',
                ""
              )}`
            : ``,
        }}
      />
      

      <ProfilePhoto
        isUser={id == residentId}
        uri={residentInfo?.profilePhoto}
        isFriends={hasConnection}
      />

      {id != residentId && (
        <FriendshipButton
          userId={id.toString()}
          friendId={residentId}
          isConnected={hasConnection}
          handleIsFriendsState={handleIsFriendsState}
        />
      )}

{/*Profile phtoo is throwing everything else off */}

      {/* Name is shown regardless */}
      {(residentInfo?.firstName && hasConnection) && <Text style={styles.name}>{residentInfo?.firstName} {residentInfo?.lastName}</Text>}
      {(residentInfo?.firstName && id == residentId) && <Text style={[styles.name, {top: 100}]}>{residentInfo?.firstName} {residentInfo?.lastName}</Text>}
      {!residentInfo?.firstName && <Text style={styles.name}>{name.split(" ")[0]}</Text> }

      {(residentInfo?.gender || hasConnection || id == residentId) &&<Text style={styles.gender}>{residentInfo?.gender}</Text>}
      {(residentInfo?.hometown || hasConnection || id == residentId) && (
        <Text style={styles.hometown}>{residentInfo?.hometown}</Text>
      )}
      {(residentInfo?.age || hasConnection || id == residentId) && <Text style={styles.age}>{residentInfo?.age ? resident!.age : ""}</Text>}
      {/* {((residentInfo?.biography && isConnected) || (residentInfo?.biography && id == residentId)) && (
        <Text style={styles.bio}>{residentInfo?.biography}</Text>
      )} */}
       {((hasConnection) || (id == residentId)) && (
        <Text style={styles.bio}>{residentInfo?.biography}</Text>
      )}
 

      {/* TODO: flatlist extends beyond safe area */}
      {/* <FlatList
        
        data={socialMedia}
        renderItem={({ item }) => (
         <></>
        )}
        keyExtractor={(item) => item.platform}
      /> */}

<View style={{marginBottom: 100, top: 60}}>
{socialMedia?.map((social) => (
  <View key={social.platform.toString()} style={styles.socials}>
          <SocialMedia platform={social.platform} username={social.username} />
          </View>
        ))}
        </View>
       

      {!hasConnection && residentId != id && (
        <View style={styles.warning}>
          <Warning message={errorMessage} />
        </View>
      )}



    </ScrollView>
  );
};

// Styling
const styles = StyleSheet.create({
  age: {
    fontSize: 20,
    top: -10,
    right: 40,
    alignSelf:"flex-end"
   // position: "absolute",
  },
  bio: {
    top: 40,
    width: 320,
    height: 150,
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
    top: 25,
    left: 36,
   // position: "absolute",
  },
  hometown: {
    fontSize: 16,
    top: 25,
    left: 36,
   // position: "absolute",
  },
  image: {
    //top: -4,
    height: 212,
    width: "100%",
    //resizeMode: "cover",
    backgroundColor: "#f2f0fd",
  },
  name: {
    fontSize: 22,
    fontFamily: "Albert-Sans",
    position: "relative",
   //top: 15,
    left: 36,
  },
  profile: {
    //width: 200,
  },
  socials: {
    width: 280,
    alignSelf: "center",
  },
  warning: {
    // position: "absolute",
    top: 20,
  },
});

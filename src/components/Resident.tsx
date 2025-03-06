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
import { styles } from "../assets/Stylesheet";

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

//TODO: if clikc firend, need to retieve their id

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
  const [error, setError] = useState<String>();
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
        "Please connect with " + name + " to view their profile."
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
    try{
      setError(undefined)

    // If on the profile page, retrieve resident

    // Or if they are connected, retrieve resident (all resident's info)
    if (residentId != id && (hasConnection && connection)) {
      
      // This variable is different than the resident store resident
      const neighbor: ResidentModel | undefined = await getResident(residentId);
      if (neighbor?.snapchat)
        socials.push({ platform: "snapchat", username: neighbor.snapchat });
      if (neighbor?.x) socials.push({ platform: "x", username: neighbor.x });
      if (neighbor?.instagram)
        socials.push({ platform: "instagram", username: neighbor.instagram });
      if (neighbor?.facebook)
        socials.push({ platform: "facebook", username: neighbor.facebook });
      setSocialMedia(socials);
      setResidentInfo(resident);
    }
    else if(residentId == id){
      //console.log(resident.backgroundPhoto.slice(0,15))
      //setResidentInfo(resident)
      console.log("profile")
      console.log(socials[0])
    }
    // Else retrieve information about the friendship - is the invite is pending?
    else {
      setResidentInfo(undefined) // Do I need to clear this again?
      setErrorMessage(
        "Please connect with " + name + " to view their profile."
      );
    }
  }catch(error){
    setError(error)
  }
  };

  // Invoked every time this page is focused
  useFocusEffect(
    useCallback(() => {

      console.log(residentId)
      console.log(id)
      setSocialMedia(undefined
      )
      
      // Will be null if going back from edit
      if(residentId == id || residentId == null){
console.log("profile")
console.log(resident)
        setResidentInfo(resident)

        if (resident?.snapchat)
          socials.push({ platform: "snapchat", username: resident.snapchat });
        if (resident?.x) socials.push({ platform: "x", username: resident.x });
        if (resident?.instagram)
          socials.push({ platform: "instagram", username: resident.instagram });
        if (resident?.facebook)
          socials.push({ platform: "facebook", username: resident.facebook });
        setSocialMedia(socials);
      }
      else{
      // Fetch data
      fetchData();
      }

      // Does something when the screen is unfocused
      return () => {
        // Set states to undefined
      setResidentInfo(undefined)
      setSocialMedia(undefined);
      };
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
        style={styles.backgroundImage}
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

{error && <View style={{position:"absolute", alignSelf:"center", top: 20}}><Warning message={error.toString()} /></View>}
      

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
      {id == residentId && <View style={{padding: 40}}></View>}
      {(residentInfo?.firstName && hasConnection) && <Text style={styles.name}>{residentInfo?.firstName} {residentInfo?.lastName}</Text>}
      {(residentInfo?.firstName && id == residentId) && <Text style={[styles.name, {}]}>{residentInfo?.firstName} {residentInfo?.lastName}</Text>}
      {!residentInfo?.firstName && <Text style={styles.name}>{name.split(" ")[0]}</Text> }

      {(residentInfo?.gender || hasConnection || id == residentId) &&<Text style={styles.gender}>{residentInfo?.gender}</Text>}
      {(residentInfo?.hometown || hasConnection || id == residentId) && (
        <Text style={styles.hometown}>{residentInfo?.hometown}</Text>
      )}
      {(residentInfo?.age || hasConnection || id == residentId) && <Text style={styles.age}>{residentInfo?.age ? resident!.age : ""}</Text>}
      {/* {((residentInfo?.biography && isConnected) || (residentInfo?.biography && id == residentId)) && (
        <Text style={styles.bio}>{residentInfo?.biography}</Text>
      )} */}
       {((hasConnection) || (id == residentId)) && residentInfo?.biography && (
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
        <View style={[{top: 20}]}>
          <Warning message={errorMessage} />
        </View>
      )}



    </ScrollView>
  );
};



import { useCallback, useEffect, useState } from "react";
import { UUIDTypes } from "uuid";
import { useResidentStore } from "../state/ResidentStore";
import {
  getFriendship,
  getResident,
  Resident as ResidentModel,
} from "../util/APIService";
import {
  Button,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
} from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";
import { FontAwesome, Ionicons, SimpleLineIcons } from "@expo/vector-icons";

import { FriendshipButton } from "./FriendshipButton";
import Warning from "./Warning";
import { ProfilePhoto } from "./ProfilePhoto";
import { SocialMedia } from "./SocialMedia";

interface ResidentProps {
  residentId: string;
  name: string;
  photo: string;
  isConnected: boolean;
  edit: boolean;
}

interface Socials {
  platform: string;
  username: string;
}

interface ResidentModel {
  age: number;
  hometown: string;
  biography: string;
  profilePhoto: string;
  backgroundPhoto: string;
  instagram: string;
  snapchat: string;
  x: string;
  facebook: string;
  id: UUIDTypes;
  firstName: string;
  lastName: string;
  gender: string; //tp do change to Gender enum
}

export const Resident = ({
  residentId,
  name,
  photo,
  isConnected,
  edit,
}: ResidentProps) => {
  const { id } = useResidentStore();
  const [resident, setResident] = useState<ResidentModel>();
  const [errorMessage, setErrorMessage] = useState("");
  const [hasConnection, setConnection] = useState<boolean>(isConnected)

  let socials: Socials[] = [];

  let connection = true;

  const [showModel, setShowModel] = useState(false);

  //const [isFriends, setIsFriends] = useState(isConnected);
  const [socialMedia, setSocialMedia] = useState<Socials[]>();

  const handleIsFriendsState = async (isFriends: boolean) => {
    console.log("handle  is friend button", isFriends);
    connection = isFriends ? true : false ;

    setConnection(isFriends);
    //empty resident
    setResident(undefined)
    await fetchData()
  };

  const navigation = useNavigation();

  // if (edit) {
  //   navigation.navigate("edit", {
  //     resident: JSON.stringify(resident!),
  //   });
  // }

 console.log(hasConnection + "has connection state")
 console.log(isConnected + "prop")
  // if the resident id (in props) matches the id of the user, retrieving friendship isn't necessary
  if (residentId == id) {
    console.log("profile");
    console.log(id);
  } else {
    console.log("resident");
    console.log(isConnected);
  }

  //{"_h": 0, "_i": 0, "_j": null, "_k": null} is because of async await
  // useEffect(() => {
  //     // Do nothing because they are viewing themselves
  //     if(residentId == id){}
  //     // Else if they are connected, retrieve all the information about the resident
  //     else if(isConnected){
  //         // Retrieve information about the resident
  //     }
  //     // Else retrieve information about the friendship - is the invite is pending?
  //     else{
  //         // Retrieve friendship
  //        const friendship = fetchFriendship();
  //        console.log(friendship)

  //     }

  // }, [])

  const fetchData = async () => {

    console.log("has " + hasConnection);
    

    // Invocked whenever the route is focused
    // Do nothing because they are viewing themselves
    if (residentId == id) {
      const resident: ResidentModel | undefined = await getResident(id);
      console.log("resident");
      console.log(resident?.age);
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
    // Else if they are connected, retrieve all the information about the resident
    else if (hasConnection && connection) {
      console.log("connected")
      // Retrieve information about the resident
      const resident: ResidentModel | undefined = await getResident(residentId);
      if (resident?.snapchat)
        socials.push({ platform: "snapchat", username: resident.snapchat });
      if (resident?.x) socials.push({ platform: "x", username: resident.x });
      if (resident?.instagram)
        socials.push({ platform: "instagram", username: resident.instagram });
      if (resident?.facebook)
        socials.push({ platform: "facebook", username: resident.facebook });
      setResident(resident);
    }
    // Else retrieve information about the friendship - is the invite is pending?
    else {
      setResident(undefined)
      console.log("No friendship");
      // Retrieve friendship
      setErrorMessage(
        "Please connect with " + name + " to view their profile."
      );
    }
  };

  // useEffect(() => {
  //   // If the friendship has changed, do something
  //   console.log("updated friendship button", handleIsFriendsState);
  //   // if (hasConnection) {
  //   //   setConnection(true)
  //   // } else {
  //   //   setConnection(false)
  //   // }
  //   fetchData();
  //   //handleIsFriendsState(false)
  // }, []); // will keep running if it's true

  useFocusEffect(
    useCallback(() => {
      // Fetch Data is asyncronous, but useFocus is synchronous.
      // So, wrapped the async call in a synchronous function
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
      {/* if not connected, only show name, button, and warning - wait I don't need to seperate
      {!isConnected && <Image style={styles.profile} source={{}} />} */}

      {!hasConnection && residentId != id && (
        <View style={{ top: 400, alignSelf: "center", position: "absolute" }}>
          <Warning message={errorMessage} />
        </View>
      )}

      {/* Background  has to go ahead of profile photo, or else it will be on top of */}

      {/* {resident?.backgroundPhoto && */}
      <Image
        //width="100%"
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
      {/* } */}

      <ProfilePhoto
        isUser={id == residentId}
        uri={resident?.profilePhoto}
        isFriends={hasConnection}
      />

      {/* Name is shown regardless */}
      {/*<Text style={styles.name}>{resident?.firstName} {resident?.lastName}</Text>*/}
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.gender}>{resident?.gender}</Text>
      {resident?.hometown && (
        <Text style={styles.hometown}>{resident?.hometown}</Text>
      )}
      {resident?.age && <Text style={styles.age}>{resident?.age}</Text>}
      {resident?.biography && (
        <Text style={styles.bio}>{resident?.biography}</Text>
      )}
      {/* {resident?.snapchat && <SocialMedia platform="snapchat" username={resident?.snapchat} />}
      {resident?.x && <SocialMedia platform="x" username={resident?.x} />}
      {resident?.instagram && <SocialMedia platform="instagram" username={resident?.instagram} />}
      {resident?.facebook && <SocialMedia platform="facebook" username={resident?.facebook} />} */}

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

      {/* {!isFriends && (
         <View style={styles.warning}>
         <Warning message={errorMessage} />
       </View>
      )} */}

      {/* other is only shown if connected */}
      {/* {isConnected && (
        <View> */}

      {/* </View> */}
    </View>
  );
};

// TODO: font family
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
    //backgroundColor: "white"
    //backgroundColor:"pink"
  },
  warning: {
    // position: "absolute",
    top: 350,
  },
});

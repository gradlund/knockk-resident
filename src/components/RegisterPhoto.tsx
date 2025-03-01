import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRegisterStore } from "../state/RegisterStore";
import { styles } from "../assets/Stylesheet";

export const RegisterPhoto = () => {
  // Router for navigating back
  const router = useRouter();

  const { setPhotos } = useRegisterStore();

  const [profileError, setProfileError] = useState<String>();
  const [backgroundError, setBackgroundError] = useState();

  // States for photos so that they will be displayed once a user selects a new photo using the picker
  const [profilePhoto, setProfilePhoto] = useState<String>("");
  const [backgroundPhoto, setBackgroundPhoto] = useState<String>("");

  // Method for the image picker of the profile photo. Gets the base64 image data.
  const pickProfilePhoto = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    // If result was not cancelled, set the photo
    if (!result.canceled) {
      //console.log(result)
      if (result.assets[0].base64 != "") {
        setProfilePhoto(result.assets[0].base64!);
        // setProfileError("Error with photo.")
      } else {
        console.log("error");
        setProfileError("Error with photo.");
      }
    }
  };

  // Method for the image picker of the background photo. Gets the base64 image data.
  const pickBackgroundPhoto = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    // If the result was not cancelled, set the photo
    if (!result.canceled) {
      setBackgroundPhoto(result.assets[0].base64!);
      //setBackgroundPhoto("Error with the photo.")
    }
  };

  const handleContinue = () => {
    setPhotos(profilePhoto, backgroundPhoto);
    router.push("register/social");
  };

  return (
    <View style={[styles.GeneralContainer, {flex: 7}]}>
      <View style={{top: -30}}>
        <TouchableOpacity
          onPress={pickProfilePhoto}
          style={styles.imageContainer}
        >
          {/*TODO: should probably do something like this
                         {image && <Image source={{ uri: image }} style={styles.image} />} */}
          {profilePhoto && (
            <Image
              style={styles.image}
              source={{
                //add default photo
                uri: `data:image/jpeg;base64,${profilePhoto.replaceAll(
                  '"',
                  ""
                )}`,
              }}
            />
          )}
          {!profilePhoto && <View style={styles.image}></View>}
          <Text style={{ fontFamily: "", fontSize: 16, top: 40 }}>
            Profile Image
          </Text>
        </TouchableOpacity>
        {profileError && <Text style={styles.photoError}>{profileError}</Text>}

        <TouchableOpacity
          onPress={pickBackgroundPhoto}
          style={styles.imageContainer}
        >
          {backgroundPhoto && (
            <Image
              style={styles.image}
              source={{
                //add default photo
                uri: `data:image/jpeg;base64,${backgroundPhoto.replaceAll('"',"")}`,
              }}
            />
          )}
          {!backgroundPhoto && <Image style={styles.image}></Image>}
          <Text style={{ fontFamily: "", fontSize: 16, top: 40 }}>
            Background Image
          </Text>
        </TouchableOpacity>
        {profileError && <Text style={styles.photoError}>{profileError}</Text>}

        <TouchableOpacity
          style={[styles.button, { top: 125 }]}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <Link style={[styles.link, {top: 135}]} href="/register/social">
          Skip
        </Link>
      </View>
    </View>
  );
};



import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRegisterStore } from "../state/RegisterStore";

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
    <View style={styles.container}>
      <View style={styles.form}>
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
          style={[styles.button, { top: 90 }]}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <Link style={styles.link} href="/register/social">
          Skip
        </Link>
      </View>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  // imagePicker: {
  //   top: 60,
  // },
  container: {
    flex: 1,
    //backgroundColor: "gray",
    alignItems: "center",
    //padding: 24,
    minWidth: 320,
  },
  form: {
    top: 125,
  },
  image: {
    alignSelf: "flex-start",
    backgroundColor: "#f2f0fd",
    borderRadius: 100,
    height: 100,
    width: 100,
    borderColor: "white",
    borderWidth: 2,
  },
  imageContainer: {
    //height: 50,
    alignItems: "flex-start",
    //flex: 1,
    flexDirection: "row",
    alignContent: "flex-start",
    gap: 40,
    padding: 40,
    paddingBottom: 20,
  },
  label: {
    fontFamily: "Albert Sans",
    fontSize: 16,
    alignSelf: "stretch",
    color: "#1e1e1e",
    textAlign: "left",
    paddingBottom: 10,
  },
  photoError: {
    left: 180,
    top: -60,
    fontFamily: "Inter-Regular",
    color: "#cbc1f6",
  },
  button: {
    top: 24,
    height: 50,
    width: 100,
    backgroundColor: "#8976ed",
    borderColor: "#8976ed",
    justifyContent: "center",
    padding: 12,
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    fontFamily: "Inter-Regular",
    lineHeight: 16,
    textAlign: "left",
    fontSize: 16,
    paddingVertical: 6,
    color: "#f5f5f5",
    alignSelf: "center",
  },
  link: {
    top: 110,
    fontSize: 16,
    lineHeight: 22,
    textDecorationLine: "underline",
    //lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#1e1e1e",
    alignSelf: "center",
  },
});

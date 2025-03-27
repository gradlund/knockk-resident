import * as ImagePicker from "expo-image-picker";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  SafeAreaView, Text,
  TouchableOpacity,
  View
} from "react-native";
import { styles } from "../../assets/Stylesheet";
import { Warning } from "../../components/Warning";
import { useRegisterStore } from "../../state/RegisterStore";

// photo screen (RegisterPhotoDetails)
const photo = () => {
  // Router for navigating back
  const router = useRouter();

  const { setPhotos } = useRegisterStore();

  // Photo error states
  const [profileError, setProfileError] = useState<String>();
  const [backgroundError, setBackgroundError] = useState<String>();

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
      if (result.assets[0].base64 != "") {
        setProfilePhoto(result.assets[0].base64!);
      } else {
        console.error("Profile photo is not base64.");
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

    // If result was not cancelled, set the photo
    if (!result.canceled) {
      if (result.assets[0].base64 != "") {
        setBackgroundPhoto(result.assets[0].base64!);
      } else {
        console.error("Background photo is not base64.");
        setBackgroundError("Error with photo.");
      }
    }
  };

  // Clears the photos
  const handleClear = () => {
    setProfilePhoto("");
    setBackgroundPhoto("");
  };

  // Save the photo information and continue registration
  const handleContinue = () => {
    setPhotos(profilePhoto, backgroundPhoto);
    router.push("register/social");
  };

  return (
    <SafeAreaView style={{ flex: 10 }}>
      <View style={{ top: 20, flex: 1 }}>
        <Warning
          message={
            "The following information is voluntary and will show up once you connect with a neighbor."
          }
        />
      </View>

      <View style={[styles.GeneralContainer, { flex: 7 }]}>
        <View style={{ top: -30 }}>
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
          {profileError && (
            <Text style={styles.photoError}>{profileError.toString()}</Text>
          )}

          <TouchableOpacity
            onPress={pickBackgroundPhoto}
            style={styles.imageContainer}
          >
            {backgroundPhoto && (
              <Image
                style={styles.image}
                source={{
                  //add default photo
                  uri: `data:image/jpeg;base64,${backgroundPhoto.replaceAll(
                    '"',
                    ""
                  )}`,
                }}
              />
            )}
            {!backgroundPhoto && <View style={styles.image}></View>}
            <Text style={{ fontFamily: "", fontSize: 16, top: 40 }}>
              Background Image
            </Text>
          </TouchableOpacity>
          {backgroundPhoto && (
            <Text style={styles.photoError}>{backgroundError?.toString()}</Text>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              { top: 0, backgroundColor: "white", borderColor: "white" },
            ]}
            onPress={handleClear}
          >
            <Text style={[styles.buttonText, { color: "black", fontSize: 12 }]}>
              Clear Photos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { top: 105 }]}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          <Link style={[styles.link, { top: 115 }]} href="/register/social">
            Skip
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default photo;

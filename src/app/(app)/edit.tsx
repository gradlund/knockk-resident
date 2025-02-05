import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OptionalResident, Resident, updateResident } from "../../util/APIService";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import Warning from "../../components/Warning";
import { navigate } from "expo-router/build/global-state/routing";

// Define zod schema for form validation
const formSchema = z.object({
  age: z.coerce //coerce will case string to a number
    .number({ message: "Invalid characters. Enter a number." })
    .min(18, { message: "Invalid age. Must be older than 18." })
    .max(100, { message: "Invalid age. Must be younger than 100" })
    .optional(), //TODO: optional not working
  // .or(z.literal(18))
  hometown: z
    .string()
    //.min(8, { message: "Password must be more than 8 characters." })
    .max(30, { message: "Hometown must be under 20 characters." }),
  biography: z.string().max(200, { message: "Biography is too long." }),
  instagram: z.string().max(50, { message: "Too long." }).optional(),
  snapchat: z.string().max(50, { message: "Too long." }).optional(),
  x: z.string().max(50, { message: "Too long." }).optional(),
  facebook: z.string().max(50, { message: "Too long." }).optional(),
});

//need to set edit to false?
const Edit = () => {
  const params = useLocalSearchParams();
  const resident: Resident = JSON.parse(params.resident);

  const [error, setError] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState<String>(
    resident?.profilePhoto.replaceAll('"', '')
  );
  const [backgroundPhoto, setBackgroundPhoto] = useState<String>(
    resident?.backgroundPhoto.replaceAll('"', '')
  );

  const navigation = useNavigation();

  //Initialize the form with hook form and zod schema resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    //form will be validated against schema before submission
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: resident.age,
      hometown: resident.hometown,
      biography: resident.biography,
      instagram: resident.instagram,
      snapchat: resident.snapchat,
      x: resident.x,
      facebook: resident.facebook,
    },
  });

  const pickProfilePhoto = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    console.log(result.assets[0].base64!.substring(0,18));

    if (!result.canceled) {
      //setImage(result.assets[0].uri);
      //   setProfilePhoto(btoa(result.assets[0].uri))
      //   resident.profilePhoto = result.assets[0].uri;
      setProfilePhoto(result.assets[0].base64!);
      resident.profilePhoto = result.assets[0].base64!;
    }
  };

  const pickBackgroundPhoto = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    console.log(result.assets[0].uri.substring(0,18));

    if (!result.canceled) {
      //setImage(result.assets[0].uri);
      setBackgroundPhoto(result.assets[0].base64!);
      resident.backgroundPhoto = result.assets[0].base64!;
    }
    //console.log(resident.backgroundPhoto);
  };

  const handleUpdate = async ({ age, hometown, biography, instagram, snapchat, x, facebook }) => {
    const optionalFields : OptionalResident = {
        age: age,
        hometown: hometown,
        biography: biography,
        profilePhoto: profilePhoto.toString(),
        backgroundPhoto: backgroundPhoto.toString(),
        instagram: instagram,
        snapchat: snapchat,
        x: x,
        facebook: facebook,
    }

    // WILL FAIL SENDING if only change one, because it still has the ""
    // SHOUDL HANDLE THIS IN THE RESPONSE PROBABLY

    console.log("background send " + backgroundPhoto.toString().substring(0,12))
    console.log("profile send " + profilePhoto.toString().substring(0,12))
    const result = await updateResident(optionalFields, resident.id);
    console.log(result + "result")

    if(result){
        // Navigate back to profile
       // navigate("/profile", {showPopup: false});
       navigation.navigate("profile", {
        showPopup: false
      })
    }
    else{
    // Show error
    setError(true);
    }
  };

  useEffect(() => {}, [profilePhoto]);


  return (
    <SafeAreaView style={styles.container}>
        {error && 
        <Warning message="Problem updating information." />}
      <ScrollView style={{}} showsVerticalScrollIndicator={false}>
        <View style={styles.formUpdate}>
          <TouchableOpacity
            onPress={pickProfilePhoto}
            style={styles.imageContainer}
          >
            {/*TODO: should probably do something like this
                 {image && <Image source={{ uri: image }} style={styles.image} />} */}
            <Image
              style={styles.image}
              source={{
                //add default photo
                uri: profilePhoto
                  ? `data:image/jpeg;base64,${profilePhoto.replaceAll('"', '')}`
                  : ``,
              }}
            />
            <Text style={{ fontFamily: "", fontSize: 16, top: 40 }}>
              Profile Image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickBackgroundPhoto} style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                //add default photo
                uri: backgroundPhoto
                  ? `data:image/jpeg;base64,${backgroundPhoto.replaceAll('"', '')}`
                  : ``,
              }}
            />
           <Text style={{ fontFamily: "", fontSize: 16, top: 40 }}>
              Background Image
            </Text>
          </TouchableOpacity>
          <Controller
            style={styles.controller}
            control={control}
            name="age"
            render={({ field: { onChange, value } }) => (
              <View>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value.toString()}
                  placeholder="Age"
                />
                {errors.age && (
                  <Text style={styles.error}>{errors.age.message}</Text>
                )}
                {!errors.age && <Text style={styles.error}></Text>}
              </View>
            )}
          />
          <Controller
            control={control}
            name="hometown"
            render={({ field: { onChange, value } }) => (
              <>
                <Text style={styles.label}>Hometown</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  placeholder={resident.hometown}
                />
                {errors.hometown && (
                  <Text style={styles.error}>{errors.hometown.message}</Text>
                )}
                {!errors.hometown && <Text style={styles.error}></Text>}
              </>
            )}
          />
          <Controller
            control={control}
            name="biography"
            render={({ field: { onChange, value } }) => (
              <>
                <Text style={styles.label}>Biography</Text>
                <TextInput
                  style={[styles.input, { height: 120 }]}
                  onChangeText={onChange}
                  value={value}
                  placeholder={resident.biography}
                  multiline={true}
                />
                <Text style={{ alignSelf: "flex-end" }}>
                  {value ? value.length : 0}/200
                </Text>
                {errors.hometown && (
                  <Text style={styles.error}>{errors.hometown.message}</Text>
                )}
                {!errors.hometown && <Text style={styles.error}></Text>}
              </>
            )}
          />
          <Controller
            control={control}
            name="instagram"
            render={({ field: { onChange, value } }) => (
              <>
                <Text style={styles.label}>Instagram</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  placeholder={resident.instagram}
                />
                {errors.instagram && (
                  <Text style={styles.error}>{errors.instagram.message}</Text>
                )}
                {!errors.instagram && <Text style={styles.error}></Text>}
              </>
            )}
          />
          <Controller
            control={control}
            name="snapchat"
            render={({ field: { onChange, value } }) => (
              <>
                <Text style={styles.label}>Snapchat</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  placeholder={resident.snapchat}
                />
                {errors.snapchat && (
                  <Text style={styles.error}>{errors.snapchat.message}</Text>
                )}
                {!errors.snapchat && <Text style={styles.error}></Text>}
              </>
            )}
          />
          <Controller
            control={control}
            name="x"
            render={({ field: { onChange, value } }) => (
              <>
                <Text style={styles.label}>X</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  placeholder={resident.x}
                />
                {errors.x && (
                  <Text style={styles.error}>{errors.x.message}</Text>
                )}
                {!errors.x && <Text style={styles.error}></Text>}
              </>
            )}
          />
          <Controller
            control={control}
            name="facebook"
            render={({ field: { onChange, value } }) => (
              <>
                <Text style={styles.label}>Facebook</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  placeholder={resident.facebook}
                />
                {errors.facebook && (
                  <Text style={styles.error}>{errors.facebook.message}</Text>
                )}
                {!errors.facebook && <Text style={styles.error}></Text>}
              </>
            )}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(handleUpdate)}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Edit;

// Styling
const styles = StyleSheet.create({
  imagePicker: {
    //textAlignVertical: "center",
    // verticalAlign: "middle",
    top: 40,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formUpdate: {
    //top: 30, cause unintended consequences
    width: "100%",
    padding: 24,
    minWidth: 320,
    flex: 1,
  },
  controller: {
    width: "100%",
    //gap: 8,
    //height: 250,
    flex: 1,
    alignSelf: "stretch",
  },
  input: {
    borderRadius: 8,
    backgroundColor: "#fff",
    borderStyle: "solid",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 240,
    alignSelf: "stretch",
  },
  image: {
    //top: -4,
    //position: "absolute",
    alignSelf: "flex-start",
    //width: "100%",
    //resizeMode: "contain",
    backgroundColor: "#f2f0fd",
    borderRadius: 100,
    height: 100,
    width: 100,
    borderColor: "white",
    borderWidth: 2,
    // top: 35,
    //left: 26,
  },
  imageContainer: {
    //backgroundColor: "red",
    height: 150,
    alignItems: "flex-start",
    flex: 1,
    flexDirection: "row",
    gap: 40,
  },
  label: {
    fontFamily: "Albert Sans",
    fontSize: 16,
    alignSelf: "stretch",
    color: "#1e1e1e",
    textAlign: "left",
    paddingBottom: 10,
  },
  error: {
    fontSize: 14,
    lineHeight: 20,
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
    fontSize: 16,
    lineHeight: 22,
    textDecorationLine: "underline",
    //lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#1e1e1e",
    alignSelf: "center",
  },
});

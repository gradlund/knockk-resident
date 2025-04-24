import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import Warning from "../../components/Warning";
import { useResidentStore } from "../../state/ResidentStore";
import { updateResident } from "../../util/APIService";
import { OptionalResident } from "../../util/types/types";

// TODO: seperate the validation to it's own file
// Define zod schema for form validation
const formSchema = z.object({
  age: z.coerce //coerce will case string to a number
    .number({ message: "Invalid characters. Enter a number." })
    .min(18, { message: "Invalid age. Must be older than 18." })
    .max(100, { message: "Invalid age. Must be younger than 100" })
    //.optional() //TODO: optional not working
    .or(z.literal(undefined))
    .or(z.literal("")),
  hometown: z.coerce
    .string()
    .max(100, { message: "Too long. Under 75 characters." })
    .or(z.literal(undefined)) // if they've never typed anything
    .or(z.literal(""))
    .transform((e) => (e === "" || e === undefined || e === null ? "" : e)),
  biography: z.coerce
    .string()
    .max(200, { message: "Too long. Under 200 characters." })
    .or(z.literal(undefined)) // if they've never typed anything
    .or(z.literal(""))
    .transform((e) => (e === "" || e === undefined || e === null ? "" : e)),
  instagram: z.coerce
    .string()
    .max(100, { message: "Too long. Under 75 characters." })
    .or(z.literal(undefined)) // if they've never typed anything
    .or(z.literal(""))
    .transform((e) => (e === "" || e === undefined || e === null ? "" : e)),
  snapchat: z.coerce
    .string()
    .max(100, { message: "Too long. Under 75 characters." })
    .or(z.literal(undefined)) // if they've never typed anything
    .or(z.literal(""))
    .transform((e) => (e === "" || e === undefined || e === null ? "" : e)),
  x: z.coerce
    .string()
    .max(100, { message: "Too long. Under 75 characters." })
    .or(z.literal(undefined)) // if they've never typed anything
    .or(z.literal(""))
    .transform((e) => (e === "" || e === undefined || e === null ? "" : e)),
  facebook: z.coerce
    .string()
    .max(100, { message: "Too long. Under 75 characters." })
    .or(z.literal(undefined)) // if they've never typed anything
    .or(z.literal(""))
    .transform((e) => (e === "" || e === undefined || e === null ? "" : e)),
});

//TODO - set update on the store; or fetch resident agin
// Edit screen
// Matches '/edit' route
const Edit = () => {
  // Parameters sent
  const params = useLocalSearchParams();
  //const resident: Resident = JSON.parse(params.resident.toString());
  const { resident, updateResidentStore } = useResidentStore();

  // Router for navigating back
  const router = useRouter();

  const [error, setError] = useState(false);

  // States for photos so that they will be displayed once a user selects a new photo using the picker
  const [profilePhoto, setProfilePhoto] = useState<String>(
    resident?.profilePhoto?.replaceAll('"', "")
  );
  const [backgroundPhoto, setBackgroundPhoto] = useState<String>(
    resident?.backgroundPhoto?.replaceAll('"', "")
  );

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
      setProfilePhoto(result.assets[0].base64!);
      resident.profilePhoto = result.assets[0].base64!;
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
      resident.backgroundPhoto = result.assets[0].base64!;
    }
  };

  // Removes the selected background image
  const removeBackground = () => {
    setBackgroundPhoto("");
  };

  // Removes the selected profile image
  const removeProfile = () => {
    setProfilePhoto("");
  };

  // Method to handle form submission. Save the information to the database.
  const handleUpdate = async ({
    age,
    hometown,
    biography,
    instagram,
    snapchat,
    x,
    facebook,
  }: {
    age: number;
    hometown: string;
    biography: string;
    instagram: string;
    x: string;
    facebook: string;
    snapchat: string;
  }) => {
    const optionalFields: OptionalResident = {
      age: age,
      hometown: hometown,
      biography: biography,
      profilePhoto: profilePhoto.toString(),
      backgroundPhoto: backgroundPhoto.toString(),
      instagram: instagram,
      snapchat: snapchat,
      x: x,
      facebook: facebook,
    };
    try {
      console.log(snapchat);
      // Update the resident
      const result = await updateResident(optionalFields, resident.id);

      // If successfully updated, go back to profile
      if (result) {
        updateResidentStore(optionalFields);
        //console.log({ resident });
        router.back();
      } else {
        // Show error
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: "white", marginBottom: 30, flex: 1 },
      ]}
    >
      {error && (
        <View style={{ top: 20, paddingBottom: 20 }}>
          <Warning message="Problem updating information." />
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
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
                  ? `data:image/jpeg;base64,${profilePhoto.replaceAll('"', "")}`
                  : ``,
              }}
            />
            <Text style={{ fontFamily: "", fontSize: 16, top: 40 }}>
              Profile Image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickBackgroundPhoto}
            style={styles.imageContainer}
          >
            <Image
              style={styles.image}
              source={{
                //add default photo
                uri: backgroundPhoto
                  ? `data:image/jpeg;base64,${backgroundPhoto.replaceAll(
                      '"',
                      ""
                    )}`
                  : ``,
              }}
            />
            <Text style={{ fontFamily: "", fontSize: 16, top: 40 }}>
              Background Image
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: 20,
            }}
          >
            <Text>Remove</Text>
            <TouchableOpacity onPress={removeProfile}>
              <Text>Profile photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={removeBackground}>
              <Text>Background photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form component doesn't have a placeholder, which this would need a vlue property to populate the value */}
          <Controller
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
                  placeholder={resident?.hometown}
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
                  placeholder={resident?.biography}
                  multiline={true}
                />
                <Text style={{ alignSelf: "flex-end" }}>
                  {value ? value.length : 0}/200
                </Text>
                {errors.biography && (
                  <Text style={styles.error}>{errors.biography.message}</Text>
                )}
                {!errors.biography && <Text style={styles.error}></Text>}
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
                  placeholder={resident?.instagram}
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
                  placeholder={resident?.snapchat}
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
                  placeholder={resident?.x}
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
                  placeholder={resident?.facebook}
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
        <View style={{ height: 50 }}></View>
      </ScrollView>
    </View>
  );
};

export default Edit;

// TODO : global styling
// Styling
const styles = StyleSheet.create({
  imagePicker: {
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
    alignSelf: "flex-start",
    backgroundColor: "#f2f0fd",
    borderRadius: 100,
    height: 100,
    width: 100,
    borderColor: "white",
    borderWidth: 2,
  },
  imageContainer: {
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

import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { RegisterState, useRegisterStore } from "../state/RegisterStore";
import { Register, register } from "../util/APIService";

// Define zod schema for form validation
const formSchema = z.object({
  instagram: z.coerce
    .string()
    .max(100, { message: "Too long. Under 75 characters." })
    .or(z.literal(undefined)) // if they've never typed anything
    .or(z.literal(""))
    .transform((e) => (e === "" || e === undefined ? undefined : e)),
  snapchat: z.coerce
    .string()
    .max(100, { message: "Too long. Under 75 characters." })
    .or(z.literal(undefined)) // if they've never typed anything
    .or(z.literal(""))
    .transform((e) => (e === "" || e === undefined ? undefined : e)),
  x: z.coerce
    .string()
    .max(100, { message: "Too long. Under 75 characters." })
    .or(z.literal(undefined)) // if they've never typed anything
    .or(z.literal(""))
    .transform((e) => (e === "" || e === undefined ? undefined : e)),
  facebook: z.coerce
    .string()
    .max(100, { message: "Too long. Under 75 characters." })
    .or(z.literal(undefined)) // if they've never typed anything
    .or(z.literal(""))
    .transform((e) => (e === "" || e === undefined ? undefined : e)),
});

export const RegisterSocial = () => {
  //Initialize the form with hook form and zod schema resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      instagram: "",
      snapchat: "",
      x: "",
      facebook: "",
    },
    //form will be validated against schema before submission
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const { setSocials } = useRegisterStore();
  const { getResidentInfo } = useRegisterStore();

  const handleContinue = async({ instagram, snapchat, x, facebook }) => {
    // store
    setSocials(instagram, snapchat, x, facebook);
    const resident: RegisterState = getResidentInfo();

    await register(resident)

    // push to login
    router.push("sign-in");
  };

  return (
    <View style={styles.container}>
      <View style={[styles.form]}>
        <View>
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
                  placeholder=""
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
                  placeholder=""
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
                  placeholder=""
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
                  placeholder=""
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
            onPress={handleSubmit(handleContinue)}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit(handleContinue)}
          >
            <Text style={styles.link}>Skip</Text>
          </TouchableOpacity>
        </View>
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
    //backgroundColor:"blue",
    //flexDirection: "column",
    alignItems: "center",
    //justifyContent: "center",
    //verticalAlign: "middle",
    // width: "100%",
    //padding: 24,
    minWidth: 320,
  },
  form: {
    top: 100,
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
    paddingHorizontal: 16,
    paddingVertical: 18,
    minWidth: 240,
    alignSelf: "stretch",
    marginBottom: 6,
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
    //lineHeight: 20,
    fontFamily: "Inter-Regular",
    color: "#cbc1f6",
    marginBottom: 12,
  },
  button: {
    top: 36,
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
    top: 50,
    fontSize: 16,
    lineHeight: 22,
    textDecorationLine: "underline",
    //lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#1e1e1e",
    alignSelf: "center",
  },
});

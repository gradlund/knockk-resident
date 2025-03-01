import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
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
import { register } from "../util/APIService";
import { styles } from "../assets/Stylesheet";
import { TextInputComponent } from "./FormComponent";

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

interface SocialProps {
  setError: (value: String | undefined) => void;
}

export const RegisterSocial = ({
  setError,
}: {
  setError: (value: String | undefined) => void;
}) => {
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

  const handleContinue = async ({ instagram, snapchat, x, facebook }) => {
    // store
    setSocials(instagram, snapchat, x, facebook);
    const resident: RegisterState = getResidentInfo();

    try {
      const id = await register(resident);

      if (id != undefined) {
        // push to login
        router.push("sign-in");
      } else {
        setError("Could not register.");
      }
    } catch (error) {
      if (error.toString().includes("Problem")) {
        setError("Problem signing up. Please contact admin.");
        console.log("hi");
      } else {
        setError(error.toString().toLowerCase());
        console.log("bye")
      }
      console.log(error)
      console.log("hi")
    }
  };

  return (
    <View style={[styles.GeneralContainer]}>
      {/* <Warning message="The following information is voluntary and will show up once you connect with a neighbor." /> */}
      <View style={[{ top: 40 }]}>
        <View>
          <TextInputComponent control={control} field={field} error={errors.instagram}></TextInputComponent>
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
            style={[styles.button, { top: 60 }]}
            onPress={handleSubmit(handleContinue)}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit(handleContinue)}>
            <Text style={[styles.link, { top: 70 }]}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { styles } from "../../assets/Stylesheet";
import { FormComponent } from "../../components/FormComponent";
import { useRegisterStore } from "../../state/RegisterStore";
import { registerAccount } from "../../util/APIService";

// Define zod schema for form validation
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  firstName: z
    .string({ message: "First name is required. Letters only." })
    .min(2, { message: "Must be longer than 2 characters." })
    .max(20, { message: "Must be less than 20 characters." }),
  lastName: z
    .string({ message: "Last name is required. Letters only." })
    .min(2, { message: "Must be longer than 2 characters." })
    .max(20, { message: "Must be less than 20 characters." }),
  password: z
    .string()
    .min(8, { message: "Password must be more than 8 characters." })
    .max(25, { message: "Password is too long. Under 25 characters." }),
});

//TODO: call the create account method and get the id. Save that

// general screen (general details)
const general = () => {

  const router = useRouter();
  const { setGeneral } = useRegisterStore();
  const [error, setError] = useState<String>();

  //Initialize the form with hook form and zod schema resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // NOTE: These where changed from undefined
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
    //form will be validated against schema before submission
    resolver: zodResolver(formSchema),
  });

  //Handle form submission
  const handleContinue = async ({
    email,
    firstName,
    lastName,
    password,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    try {
      // Check to see if email exists
      // If email is already registered, an id will not be returned
      const id = await registerAccount(email, password);
      console.log("User's id: " + id);

      // Store general detail to the store
      // NOTE: I don't need to store email and password if I don't want to
      setGeneral(id, email, firstName, lastName, password);
      router.push("register/living");
    } catch (error: any) {
      setError("An error occurred. Please try again later.");
      console.error(error.toString());
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "column" }}>
      <Text style={styles.header}>Knockk</Text>
      <View style={styles.GeneralContainer}>
        <View style={[{ paddingTop: 60 }]}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  placeholder="johndoe@gmail.com"
                />
                {error && !errors.email && (
                  <Text style={[styles.error]}>{error.toString()}</Text>
                )}
                {errors.email && (
                  <Text style={styles.error}>{errors.email.message}</Text>
                )}

                {!error && !errors.email && <Text style={styles.error}></Text>}
              </>
            )}
          />
          <FormComponent
            control={control}
            screen="register"
            name="firstName"
            label="First Name"
            error={errors.firstName}
            placeholder=""
          />
          <FormComponent
            control={control}
            screen="register"
            name="lastName"
            label="Last Name"
            error={errors.lastName}
            placeholder=""
          />
          <FormComponent
            control={control}
            screen="register"
            name="password"
            label="Password"
            error={errors.password}
            placeholder=""
          />
          <TouchableOpacity
            style={[styles.button, { top: 90 }]}
            onPress={handleSubmit(handleContinue)}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Link style={[styles.link, { top: 85 }]} href="/sign-in">
        Login
      </Link>
    </SafeAreaView>
  );
};

export default general;

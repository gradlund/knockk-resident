import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { LoginForm } from "../components/LoginForm";
import Warning from "../components/Warning";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResidentStore } from "../state/ResidentStore";
import { styles } from "../assets/Stylesheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { login, getResident } from "../util/APIService";
import { FormComponent } from "../components/FormComponent";

// Login screen
export default function SignIn() {
  // const { id } = useResidentStore();

  // return (
  //   <SafeAreaView style={{flex: 10}}>
  //     <View style={{flex: 1}}>
  //     {error && <Warning message={error.toString()} />}
  //     {!error && <View style={{
  //     padding: 28, maxHeight: 100 }}></View>}
  //     </View>
  //     <View style={{flex: 1}}>
  //     <Image style={styles.logo} source={require("../assets/logo.png")} /></View>
  //     <View style={{flex: 8}}>
  // //     <LoginForm setError={setError}/>
  //     </View>
  //   </SafeAreaView>
  // );

  // Define zod schema for form validation
  const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Must be more than 8 characters." })
      .max(25, { message: "Must be under 25 characters." }),
  });

  // State for different errors
  const [valid, setValid] = useState(true);
  const [verified, setVerified] = useState(true);
  const [error, setError] = useState<String>();

  const { setResidentId, setResident } = useResidentStore();

  //Initialize the form with hook form and zod schema resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    //form will be validated against schema before submission
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  //Handle form submission
  const handleLogin  = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      //validate credentials and save the user's id to the store
      const id = await login(email, password);

      // if the id is not undefined, save it to the store and get all information about the resident
      // also save that to the store and navigate to the home screen
      console.log(id);
      if (id != undefined) {
        setResidentId(id);
        const resident = await getResident(id);
        console.log(resident);
        if (resident) {
          console.log("resident is valid");
          // Store the resident data
          setResident(resident!); //be careful with forceunrap
          // signIn(id)

          router.replace("/");
        } else {
          console.log("Problem fetching user");
          throw Error("A problem occurred. Please contact admin.");
        }
      }
    } catch (error: any) {
      // If the error is that the crednetials are wrong, show that error
      if (error == "Invalid credentials.") {
        setError(undefined);
        setValid(false);
        setVerified(true);
      }
      // If it's that the user isn't verified, show that error
      else if (error == "User is not verified.") {
        setError(undefined);
        setValid(true);
        setVerified(false);
      }
      // If it's some other error, show that too
      else {
        setError(error.toString());
        setValid(true);
        setVerified(true);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 10 }}>
      <View style={{ flex: 1 }}>
        {error && <Warning message={error.toString()} />}
        {!error && (
          <View
            style={{
              padding: 28,
              maxHeight: 100,
            }}
          ></View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
      </View>
      <View style={{ flex: 8 }}>
        <View
          style={[
            styles.GeneralContainer,
            { flex: 1, maxWidth: "100%", marginHorizontal: 20 },
          ]}
        >
          <View style={[styles.formLogin, {}]}>
            <FormComponent
              control={control}
              name="email"
              label="Email"
              error={errors.email}
              screen="login"
            ></FormComponent>

            <FormComponent
              control={control}
              name="password"
              label="Password"
              error={errors.password}
              screen="login"
            ></FormComponent>

            <TouchableOpacity
              style={[styles.button, { top: 10 }]}
              onPress={handleSubmit(handleLogin)}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <Link style={[styles.link]} href="register/general">
              Register
            </Link>
          </View>
          {!verified && (
            <Text style={styles.credentialError}>
              Account not yet activated.
            </Text>
          )}
          {!valid && (
            <Text style={styles.credentialError}>
              Email or username is incorrect.
            </Text>
          )}
          {verified || (valid && <Text style={styles.credentialError}></Text>)}
        </View>
      </View>
    </SafeAreaView>
  );
}

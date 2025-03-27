import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { styles } from "../assets/Stylesheet";
import { FormComponent } from "../components/FormComponent";
import Warning from "../components/Warning";
import { useResidentStore } from "../state/ResidentStore";
import { getResident, login } from "../util/APIService";

// Define zod schema for form validation
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Must be more than 8 characters." })
    .max(25, { message: "Must be under 25 characters." }),
});

// Login screen
export default function SignIn() {
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
      password: "",
    },
  });

  //Handle form submission
  const handleLogin = async ({
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
      if (id != undefined) {
        setResidentId(id);
        const resident = await getResident(id);

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
      // Handle errors
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
        setError("An error occurred");
        setValid(true);
        setVerified(true);
      }
      console.error(error.toString());
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
              placeholder=""
            ></FormComponent>

            <FormComponent
              control={control}
              name="password"
              label="Password"
              error={errors.password}
              screen="login"
              placeholder=""
            ></FormComponent>

            <TouchableOpacity
              style={[styles.button, { top: 10 }]}
              onPress={handleSubmit(handleLogin)}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <Link style={[styles.link]} href="register/personal">
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

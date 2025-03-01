import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useResidentStore } from "../state/ResidentStore";
import { getResident, login } from "../util/APIService";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { styles } from "../assets/Stylesheet";
//import { signIn } from "../providers/auth-provider";
import Warning from "./Warning";
import { TextInputComponent } from "./FormComponent";

// Define zod schema for form validation
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Must be more than 8 characters." })
    .max(25, { message: "Must be under 25 characters." }),
});

interface LoginProps {
  setError : (value: String | undefined) => void;
}

// Login component
export const LoginForm = ({setError}: LoginProps) => {
  // State for errors
  const [valid, setValid] = useState(true);
  // State is the user is verified
  // TODO: add verified property to the store
  const [verified, setVerified] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const { setResidentId, setResident } = useResidentStore();

  //Initialize the form with hook form and zod schema resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    //form will be validated against schema before submission
    resolver: zodResolver(formSchema),
  });

  //Handle form submission
  const handleLogin = async ({ email, password }) => {
    try {
      //validate credentials
      const id = await login(email, password);

      //if credentials are valid
      // if (user.id != undefined) {
      //   if (user.verified) {
      //return UUID and save it to the store
      setResidentId(id);

      if (id != undefined) {
        try{
        const resident = await getResident(id);
        setResident(resident!); //be careful with forceunrap
        // signIn(id)
        //navigate to home, TODO: if successful
        router.replace("/");}
        catch(e){console.log(e)}
      }
    } catch(error) {
      console.log(error);
      if (error == "Invalid credentials.") {
        setError(undefined)
        setValid(false);
        setVerified(true);
      } else if (error == "User is not verified.") {
        setError(undefined);
        setVerified(false);
        setValid(true);
      }
      else {
        setError(error.toString());
        setValid(true);
        setVerified(true);
      }
    }
  };

  return (
    <View style={[styles.GeneralContainer, {flex: 1, maxWidth: "100%", marginHorizontal: 20}]}>
      <View style={[styles.formLogin, {}]}>


  <TextInputComponent control={control} name="email" label="Email" error={errors.email} screen="login"></TextInputComponent>
 
  <TextInputComponent control={control} name="password" label="Password" error={errors.password} screen="login"></TextInputComponent>

        {/* <Controller
          // style={styles.controller}
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.label}>Email</Text>
              <TextInput
                               style={[styles.input, {width: 250, maxWidth: 250}]}
                onChangeText={onChange}
                value={value}
                placeholder="email@email.com"
              />
              {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
              )}
              {!errors.email && <Text style={styles.error}></Text>}
            </>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.label}>Password</Text>
              <TextInput
                secureTextEntry={true}
                style={[styles.input, {width: 250, maxWidth: 250}]}
                onChangeText={onChange}
                value={value}
                placeholder="password"
              />
              {errors.password && (
                <Text style={styles.error}>{errors.password.message}</Text>
              )}
              {!errors.password && <Text style={styles.error}></Text>}
            </>
          )}
        /> */}
        <TouchableOpacity
          style={[styles.button, {top: 10}]}
          onPress={handleSubmit(handleLogin)}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <Link style={[styles.link]} href="register/general">
          Register
        </Link>
      </View>
      {!verified && (
        <Text style={styles.credentialError}>Account not yet activated.</Text>
      )}
      {!valid && (
          <Text style={styles.credentialError}>
            Email or username is incorrect.
          </Text>
        )}
      {verified || valid && <Text style={styles.credentialError}></Text>}
    </View>
  );
};



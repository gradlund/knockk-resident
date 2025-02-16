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
import {signIn} from "../providers/auth-provider"

// Define zod schema for form validation
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be more than 8 characters." })
    .max(25, { message: "Password is too long. Under 25 characters." }),
});

// Login component
export const LoginForm = () => {
  // State for errors
  const [valid, setValid] = useState(true);
  // State is the user is verified
  // TODO: add verified property to the store
  const [verified, setVerified] = useState(true);

  const {setResidentId, setResident} = useResidentStore();

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
    try{
    //validate credentials
    const id = await login(email, password);

    //if credentials are valid
    // if (user.id != undefined) {
    //   if (user.verified) {
        //return UUID and save it to the store
        setResidentId(id);
        const resident = await getResident(id)
        setResident(resident)
       // signIn(id)
        //navigate to home, TODO: if successful
        router.replace("/");
    //   } else {
    //     //show the error because they aren't verified
    //     setVerified(false);
    //   }
    // } else {
    //   //TODO: else show error
    //   setValid(false);
    // }
    }catch(error){
      console.log(error.toString())
      if(error == "User is not verified.") {setVerified(false); setValid(true)}
      else {setValid(false); setVerified(true)}
      
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.formLogin]}>
        <Controller
          style={styles.controller}
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
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
                style={styles.input}
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
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(handleLogin)}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        {!valid && (
          <Text style={styles.credentialError}>
            Email or username is incorrect.
          </Text>
        )}
        {valid && <Text style={styles.credentialError}></Text>}
        <Link style={styles.link} href="register/general">
          Register
        </Link>
      </View>
      {!verified && (
        <Text style={styles.accountError}>Account not yet activated.</Text>
      )}
      {verified && <Text style={styles.accountError}></Text>}
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  formLogin: {
    top: 30,
    width: "100%",
    height: 385,
    maxHeight: 385,
    padding: 24,
    //gap: 24,
    minWidth: 320,
    flex: 1,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 8,
    borderColor: "#d9d9d9",
    backgroundColor: "#fff",
  },
  controller: {
    width: "100%",
    gap: 8,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 240,
    alignSelf: "stretch",
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
    backgroundColor: "#8976ed",
    borderColor: "#8976ed",
    justifyContent: "center",
    padding: 12,
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 8,
    alignSelf: "stretch",
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
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#1e1e1e",
    alignSelf: "center",
  },
  accountError: {
    top: 15,
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "Inter-Regular",
    color: "#a495f7",
    textAlign: "left",
    alignSelf: "center",
    //paddingVertical: 33,
  },
  credentialError: {
    top: 15,
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "Inter-Regular",
    color: "#a495f7",
    textAlign: "left",
    alignSelf: "center",
    paddingVertical: 33,
  },
});

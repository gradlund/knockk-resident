import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { Warning } from "../../components/Warning";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { styles } from "../../assets/Stylesheet";
import { useRegisterStore, RegisterState } from "../../state/RegisterStore";
import { register } from "../../util/APIService";
import { z } from "zod";

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

// social screen (RegisterSocialDetails)
const social = () => {
  const [error, setError] = useState<String>(
    "The following information is voluntary and will show up once you connect with a neighbor."
  );

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

  const handleContinue = async ({
    instagram,
    snapchat,
    x,
    facebook,
  }: {
    instagram: string;
    snapchat: string;
    x: string;
    facebook: string;
  }) => {
    // Add socials to the store
    setSocials(instagram, snapchat, x, facebook);
    // Get the resident
    const resident: RegisterState = getResidentInfo();

    try {
      // Register the resident
      await register(resident);

      // push to login
      router.push("sign-in");
    } catch (error: any) {
      if (error.toString().includes("Problem")) {
        setError("Problem registering. Please contact admin.");
      } else {
        setError(error.toString());
      }
    }
  };

  return (
    <View style={[styles.GeneralContainer]}>
      <View style={{ top: 20, paddingBottom: 10, position: "absolute" }}>
        <Warning message={error.toString()} />
      </View>
      <View style={[{ top: 150 }]}>
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

export default social;

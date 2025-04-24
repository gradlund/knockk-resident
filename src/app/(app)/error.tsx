import { useFocusEffect } from "expo-router";
import * as Updates from "expo-updates";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../assets/Stylesheet";
import Warning from "../../components/Warning";

const Error = (message: { message: string | undefined }) => {
  const [errorMessage, setErrorMessage] = useState("");

  // Hook on screen focus
  useFocusEffect(
    useCallback(() => {
      if (errorMessage != undefined) {
        setErrorMessage(message.toString());
      } else {
        setErrorMessage("Please restart the app.");
      }

      // Cleanup when unfocuesed
      return () => {
        setErrorMessage("");
      };
    }, [])
  ); //empty array to fetch only when it mounts

  // OTA updates let you push code changes without requiring the user to update in the app store
  // Check for updates
  // TODO: implement in the future
  const checkForUpdates = async () => {
    try {
      const hasUpdate = await Updates.checkForUpdateAsync();
      if (hasUpdate.isAvailable) {
        await Updates.fetchUpdateAsync();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Restarts the app
  const handleRestart = async () => {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Warning message="Problem with the application. Please restart." />
      <View>
        <TouchableOpacity style={[styles.button, {}]} onPress={handleRestart}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Error;

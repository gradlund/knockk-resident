import {
  Link,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Index } from "../../components/Index";
import { useEffect } from "react";

// Home screen
// Matches '/' route
const Home = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {});

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Index />
    </SafeAreaView>
  );
};

export default Home;

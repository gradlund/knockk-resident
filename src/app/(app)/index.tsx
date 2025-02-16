import { SafeAreaView } from "react-native-safe-area-context";
import { Index } from "../../components/Index";

// Home screen
// Matches '/' route
const Home = () => {

  return (
    <SafeAreaView style={{backgroundColor:"white"}}>
      <Index />
    </SafeAreaView>
  );
};

export default Home;

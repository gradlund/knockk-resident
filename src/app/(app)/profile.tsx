import { SafeAreaView } from "react-native";
import { Resident } from "../../components/Resident";
import { useResidentStore } from "../../state/ResidentStore";

// Profile screen
// Matches '/profile' route
const Profile = () => {
  const { id, logout } = useResidentStore();

  return (
    <SafeAreaView
    >
      <Resident
        residentId={id.toString()}
        name={""}
        photo={""}
        isConnected={false}
      />
    </SafeAreaView>
  );
};

export default Profile;

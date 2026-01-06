import { View, Text, StyleSheet } from "react-native";
import ScheduleForm from "../components/ScheduleForm";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Schedule() {
  return (
   <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Schedule Birthday Wish 🎂</Text>
      <ScheduleForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

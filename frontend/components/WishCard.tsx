import { View, Text, StyleSheet } from "react-native";
import { Wish } from "../redux/wishSlice";

interface WishCardProps {
  wish: Wish;
  };


export default function WishCard({ wish }: WishCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.email}>{wish.receiverEmail}</Text>
      <Text>{wish.message}</Text>
      {wish.videoUrl && <Text style={styles.video}>🎥 Video attached</Text>}
      <Text style={styles.date}>
        {new Date(wish.sendAtUtc).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  email: { fontWeight: "bold", marginBottom: 4 },
  video: { color: "blue", marginTop: 4 },
  date: { marginTop: 6, fontSize: 12, color: "#555" },
});







// import { View, Text, StyleSheet } from "react-native";

// export default function WishCard({ wish }: any) {
//   return (
//     <View style={styles.card}>
//       <Text style={styles.name}>{wish.receiverEmail}</Text>
//       <Text>{wish.message}</Text>
//       <Text>{new Date(wish.scheduleDate).toDateString()}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     padding: 12,
//     margin: 10,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     elevation: 3,
//   },
//   name: {
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

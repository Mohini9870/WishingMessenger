import { View, Text, StyleSheet } from "react-native";

export default function WishCard({ wish }: any) {
  if (!wish) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.email}>{wish.receiverEmail}</Text>
      <Text style={styles.message}>{wish.message}</Text>

      {wish.videoUrl ? (
        <Text style={styles.video}>🎥 Video Attached</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  email: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
  },
  video: {
    marginTop: 6,
    color: "#4f46e5",
    fontWeight: "600",
  },
});

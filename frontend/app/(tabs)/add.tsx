import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWish } from "@/redux/wishSlice";
import { AppDispatch, RootState } from "@/redux/store";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function AddWishScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.wishes);

  const [receiverEmail, setReceiverEmail] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [time, setTime] = useState(""); // HH:mm
  const [videoUri, setVideoUri] = useState<string | undefined>();

  const pickVideo = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!res.canceled) {
      setVideoUri(res.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!receiverEmail || !message || !date || !time) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      await dispatch(
        addWish({ receiverEmail, message, date, time, videoUri })
      ).unwrap();

      Alert.alert("Success", "Wish created successfully 🎉");
      router.replace("/"); // 👈 Home tab
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create wish";

      Alert.alert("Error", msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Wish 💌</Text>

      <TextInput
        placeholder="Receiver Email"
        style={styles.input}
        value={receiverEmail}
        onChangeText={setReceiverEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Your Message"
        style={[styles.input, styles.textArea]}
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        style={styles.input}
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        placeholder="Time (HH:mm)"
        style={styles.input}
        value={time}
        onChangeText={setTime}
      />

      <TouchableOpacity style={styles.videoBtn} onPress={pickVideo}>
        <Text style={styles.videoText}>
          {videoUri ? "🎬 Video Selected" : "📹 Add Video (Optional)"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Create Wish</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  videoBtn: {
    backgroundColor: "#eef2ff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  videoText: {
    color: "#4f46e5",
    fontWeight: "600",
  },
  btn: {
    backgroundColor: "#4f46e5",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

 import { View, TextInput, Button, StyleSheet, Text, Pressable, Platform } from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";
import { addWish } from "../redux/wishSlice";
import { AppDispatch } from "../redux/store";
import { router } from "expo-router";

export default function ScheduleForm() {
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [videoUri, setVideoUri] = useState<string>("");

  const pickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return alert("Permission required");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (result.canceled) return;
    setVideoUri(result.assets[0].uri);
  };

  const onSubmit = () => {
    if (!email || !message || !date) {
      alert("Please fill all fields");
      return;
    }

    dispatch(
      addWish({
        receiverEmail: email,
        message,
        date: date.toISOString().split("T")[0],
        time: "00:00",
        videoUri, // optional
      })
    );

    router.replace("/");
  };

  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Receiver Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Birthday Message"
        value={message}
        onChangeText={setMessage}
        multiline
        style={[styles.input, styles.textArea]}
      />

      <Pressable style={styles.dateBtn} onPress={() => setShowPicker(true)}>
        <Text>{date ? date.toLocaleString() : "Select Date (12 AM IST)"}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="datetime"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selected) => {
            setShowPicker(false);
            if (selected) setDate(selected);
          }}
        />
      )}

      <Pressable style={styles.dateBtn} onPress={pickVideo}>
        <Text>{videoUri ? "Video Selected ✅" : "Select Video (optional)"}</Text>
      </Pressable>

      <Button title="Schedule Wish" onPress={onSubmit} />
    </View>
  );
}


const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
  },
  textArea: {
    height: 80,
  },
  dateBtn: {
    padding: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 6,
  },
});

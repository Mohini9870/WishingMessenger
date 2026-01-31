import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/authSlice";


export default function LoginScreen() {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<any>();

const login = async () => {
  try {
    await dispatch(
      loginUser({
        email: emailOrMobile,
        password,
      })
    ).unwrap();

    Alert.alert("Success", "Logged in");
    router.replace("/(tabs)");
  } catch (err) {
    Alert.alert("Login Failed", "Invalid credentials");
  }
};

  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          placeholder="Email or Mobile"
          style={styles.input}
          value={emailOrMobile}
          onChangeText={setEmailOrMobile}
        />

        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Password"
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Text
            style={styles.show}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.otpBtn}>
          <Text style={styles.otpText}>Login with OTP</Text>
        </TouchableOpacity>

        <Text style={styles.linkText}>
          New user?{" "}
          <Text
            style={styles.link}
            onPress={() => router.push({ pathname: "/register" })}
          >
            Register
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
  },
  show: {
    color: "#6366f1",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  otpBtn: {
    borderWidth: 1,
    borderColor: "#6366f1",
    padding: 14,
    borderRadius: 10,
  },
  otpText: {
    textAlign: "center",
    color: "#6366f1",
    fontWeight: "bold",
  },
  linkText: {
    textAlign: "center",
    marginTop: 20,
    color: "#6b7280",
  },
  link: {
    color: "#6366f1",
    fontWeight: "bold",
  },
});

//test code 

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { sendOtp, verifyOtpAndRegister } from "../redux/authSlice";
import { AppDispatch } from "../redux/store";

export default function RegisterScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    if (!email) return Alert.alert("Enter email");

    await dispatch(sendOtp({ email }));
    setOtpSent(true);
    Alert.alert("OTP sent to email");
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      return Alert.alert("Passwords do not match");
    }

    await dispatch(
      verifyOtpAndRegister({
        email,
        otp,
        password,
      })
    );

    Alert.alert("Account created 🎉");
    router.replace("/login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      {!otpSent && (
        <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </TouchableOpacity>
      )}

      {otpSent && (
        <>
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            style={styles.input}
            keyboardType="number-pad"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry={!showPassword}
          />

          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry={!showPassword}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.showText}>
              {showPassword ? "Hide Password" : "Show Password"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
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
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#6366f1",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  showText: {
    textAlign: "right",
    color: "#6366f1",
    marginBottom: 12,
  },
});




















  // Final code
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from "react-native";
// import { useState } from "react";
// import { router } from "expo-router";
// import api from "../services/api";

// export default function RegisterScreen() {

//   /* Form state */
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");


//   // OTP state

//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   /* 🔹 SEND OTP */
//   const sendOtp = async () => {
//   try {
//     const res = await api.post("/auth/register", {
//       name,
//       email,
//       password,
//     });

//     alert(`DEV OTP (console): ${res.data.otp}`); // frontend me test ke liye
//     setOtpSent(true);
//   } catch (err: any) {
//     alert(err.response?.data?.message || "Failed to send OTP");
//   }
// };


//   /* 🔹 VERIFY OTP */
//   const verifyOtp = async () => {
//     if (!otp) {
//       Alert.alert("Error", "Enter OTP");
//       return;
//     }

//     try {
//       await api.post("/auth/verify-otp", { phone: mobile, otp });
//       setOtpVerified(true);
//       Alert.alert("Success", "Mobile number verified ✅");
//     } catch {
//       Alert.alert("Error", "Invalid or expired OTP");
//     }
//   };

//   /* 🔹 REGISTER */
//   const register = async () => {
//     if (!name || !email || !mobile || !password || !confirmPassword) {
//       Alert.alert("Error", "All fields are required");
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match");
//       return;
//     }

//     if (!otpVerified) {
//       Alert.alert("Error", "Please verify mobile number first");
//       return;
//     }

//     try {
//       setLoading(true);

//       await api.post("/auth/register", {
//         name,
//         email,
//         password,
//         phone: mobile,
//         sendOtpOnly: true, //  FINAL CONFIRM
//       });

//       Alert.alert("Success 🎉", "Registration completed");
//       router.replace({ pathname: "/login" });
//     } catch (err: any) {
//       Alert.alert(
//         "Registration Failed",
//         err.response?.data?.message || "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={{ flex: 1 }}
//     >
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.title}>Create Account</Text>
//         <Text style={styles.subtitle}>
//           Verify mobile to continue registration
//         </Text>

//         <TextInput
//           placeholder="Full Name"
//           style={styles.input}
//           value={name}
//           onChangeText={setName}
//         />

//         <TextInput
//           placeholder="Email"
//           style={styles.input}
//           keyboardType="email-address"
//           value={email}
//           onChangeText={setEmail}
//         />

//         <TextInput
//           placeholder="Mobile Number"
//           style={styles.input}
//           keyboardType="phone-pad"
//           value={mobile}
//           onChangeText={setMobile}
//         />

//         {/* SEND OTP */}
//         {!otpSent && (
//           <TouchableOpacity style={styles.otpBtn} onPress={sendOtp}>
//             <Text style={styles.otpText}>Send OTP</Text>
//           </TouchableOpacity>
//         )}

//         {/* VERIFY OTP */}
//         {otpSent && !otpVerified && (
//           <>
//             <TextInput
//               placeholder="Enter OTP"
//               style={styles.input}
//               keyboardType="number-pad"
//               value={otp}
//               onChangeText={setOtp}
//             />

//             <TouchableOpacity style={styles.otpBtn} onPress={verifyOtp}>

//               <Text style={styles.otpText}>Verify OTP</Text>
//             </TouchableOpacity>
//           </>
//         )}

//         {/* PASSWORD */}
//         <View style={styles.passwordBox}>
//           <TextInput
//             placeholder="Password"
//             style={styles.passwordInput}
//             secureTextEntry={!showPassword}
//             value={password}
//             onChangeText={setPassword}
//           />
//           <Text
//             style={styles.show}
//             onPress={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? "Hide" : "Show"}
//           </Text>
//         </View>

//         <View style={styles.passwordBox}>
//           <TextInput
//             placeholder="Confirm Password"
//             style={styles.passwordInput}
//             secureTextEntry={!showPassword}
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//           />
//         </View>

//         <TouchableOpacity style={styles.button} onPress={register}>
//           <Text style={styles.buttonText}>
//             {loading ? "Creating..." : "Register"}
//           </Text>
//         </TouchableOpacity>

//         <Text style={styles.linkText}>
//           Already have an account?{" "}
//           <Text
//             style={styles.link}
//             onPress={() => router.push({ pathname: "/login" })}
//           >
//             Login
//           </Text>
//         </Text>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// /* 🎨 STYLES – COPY SAFE */

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 24,
//     justifyContent: "center",
//     backgroundColor: "#f3f4f6",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   subtitle: {
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#6b7280",
//   },
//   input: {
//     backgroundColor: "#fff",
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 14,
//   },
//   passwordBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     marginBottom: 14,
//     paddingHorizontal: 14,
//   },
//   passwordInput: {
//     flex: 1,
//     paddingVertical: 14,
//   },
//   show: {
//     color: "#6366f1",
//     fontWeight: "bold",
//   },
//   otpBtn: {
//     borderWidth: 1,
//     borderColor: "#6366f1",
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 14,
//   },
//   otpText: {
//     textAlign: "center",
//     color: "#6366f1",
//     fontWeight: "bold",
//   },
//   button: {
//     backgroundColor: "#6366f1",
//     padding: 16,
//     borderRadius: 10,
//     marginTop: 8,
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   linkText: {
//     textAlign: "center",
//     marginTop: 20,
//     color: "#6b7280",
//   },
//   link: {
//     color: "#6366f1",
//     fontWeight: "bold",
//   },
// });

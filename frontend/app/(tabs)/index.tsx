import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishes } from "@/redux/wishSlice";
import { RootState, AppDispatch } from "@/redux/store";
import dayjs from "dayjs";

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector((state: RootState) => state.wishes);

  useEffect(() => {
    dispatch(fetchWishes());
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (list.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No wishes yet 💌</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Receiver */}
            <Text style={styles.email}>{item.receiverEmail}</Text>

            {/* Message */}
            <Text style={styles.message}>{item.message}</Text>

            {/* Date */}
            <Text style={styles.date}>
              ⏰ {dayjs(item.sendAtUtc).format("DD MMM YYYY, hh:mm A")}
            </Text>

            {/* Status */}
            <View
              style={[
                styles.status,
                item.status === "SENT"
                  ? styles.sent
                  : item.status === "FAILED"
                  ? styles.failed
                  : styles.pending,
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#6b7280",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 2,
  },
  email: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4f46e5",
    marginBottom: 6,
  },
  message: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 10,
  },
  date: {
    fontSize: 13,
    color: "#6b7280",
  },
  status: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  pending: {
    backgroundColor: "#f59e0b",
  },
  sent: {
    backgroundColor: "#10b981",
  },
  failed: {
    backgroundColor: "#ef4444",
  },
});





// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchWishes } from "../../redux/wishSlice";
// import { RootState, AppDispatch } from "../../redux/store";
// import WishCard from "../../components/WishCard";
// import { logout } from "../../redux/authSlice";
// import { router } from "expo-router";

// export default function Home() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { list, loading } = useSelector((state: RootState) => state.wishes);

//   useEffect(() => {
//     dispatch(fetchWishes());
//   }, []);

//   const handleLogout = () => {
//     dispatch(logout());
//      router.replace("/login");
   
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.center}>
//         <ActivityIndicator size="large" />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* 🔝 HEADER */}
//       <View style={styles.header}>
//         <Text style={styles.title}>🎂 Scheduled Wishes</Text>

//         <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </View>

//       {/* 📋 LIST */}
//       <FlatList
//         data={list}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => <WishCard wish={item} />}
//         contentContainerStyle={{ paddingBottom: 20 }}
//         showsVerticalScrollIndicator={false}
//       />
//     </SafeAreaView>
//   );
// }

// /* =====================
//    🎨 STYLES
// ===================== */
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F5F5",
//     paddingHorizontal: 16,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginVertical: 12,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#111827",
//   },
//   logoutBtn: {
//     backgroundColor: "#EF4444",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   logoutText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 14,
//   },
// });

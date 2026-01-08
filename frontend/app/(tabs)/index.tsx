import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishes } from "../../redux/wishSlice";
import { RootState, AppDispatch } from "../../redux/store";
import WishCard from "../../components/WishCard";
import { logout } from "../../redux/authSlice";
import { router } from "expo-router";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector((state: RootState) => state.wishes);

  useEffect(() => {
    dispatch(fetchWishes());
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔝 HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🎂 Scheduled Wishes</Text>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* 📋 LIST */}
      <FlatList
        data={list}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <WishCard wish={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

/* =====================
   🎨 STYLES
===================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  logoutBtn: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

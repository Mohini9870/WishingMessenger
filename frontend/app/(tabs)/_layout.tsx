import { Tabs, router } from "expo-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe, logout } from "@/redux/authSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { ActivityIndicator, View } from "react-native";

export default function TabsLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // 🔐 Token hai but user nahi → backend se profile lao
    if (token && !user) {
      dispatch(fetchMe());
    }
  }, [token]);

  // ⏳ Jab tak user load ho raha hai
  if (loading || (token && !user)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="add" />
    </Tabs>
  );
}

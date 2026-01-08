import { Stack, Redirect } from "expo-router";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState, AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { fetchMe, setToken } from "@/redux/authSlice";
import { getToken } from "@/services/tokenStorage";
import { setAuthToken } from "@/services/api";
import { ActivityIndicator, View } from "react-native";

function AuthGate() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const bootstrap = async () => {
      const savedToken = await getToken();
      if (savedToken) {
        setAuthToken(savedToken);
        dispatch(setToken(savedToken));
        dispatch(fetchMe());
      }
    };
    bootstrap();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token) return <Redirect href="/login" />;
  return <Redirect href="/(tabs)" />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthGate />
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}

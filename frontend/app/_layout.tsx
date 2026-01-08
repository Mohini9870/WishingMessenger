import { Stack } from "expo-router";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState } from "@/redux/store";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { tokenRestored } from "@/redux/authSlice";

function AppStack() {
  const dispatch = useDispatch();
  const { token, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const restoreToken = async () => {
      const savedToken = await SecureStore.getItemAsync("token");
      dispatch(tokenRestored(savedToken));
    };
    restoreToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!token ? (
        <Stack.Screen name="login" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppStack />
    </Provider>
  );
}

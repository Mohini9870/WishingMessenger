import { Stack } from "expo-router";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState } from "@/redux/store";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";
import { getToken } from "@/services/tokenStorage";
import { restoreToken } from "@/redux/authSlice";
import { setAuthToken } from "@/services/api";

function AppStack() {
  const { token, loading } = useSelector(
    (state: RootState) => state.auth
  );

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

function Bootstrap() {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      const token = await getToken();
      if (token) {
        setAuthToken(token);      // ⭐ axios header set
        dispatch(restoreToken(token)); // ⭐ redux token set
      } else {
        dispatch(restoreToken(null));
      }
    };

    init();
  }, []);

  return <AppStack />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Bootstrap />
    </Provider>
  );
}

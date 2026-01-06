import { Stack } from 'expo-router';
import { Provider, useSelector }  from 'react-redux';
import { store, RootState } from '@/redux/store';
import React from 'react';


function AppStack() {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <Stack>
      {!token ? (
        <Stack.Screen name="login" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  
  return (
    <Provider store={store}>
      <AppStack />
    </Provider>
  )
}

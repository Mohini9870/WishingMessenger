import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishes } from "../../redux/wishSlice";
import { RootState, AppDispatch } from "../../redux/store";
import WishCard from "../../components/WishCard";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector((state: RootState) => state.wishes);

  useEffect(() => {
    dispatch(fetchWishes());
  }, []);

  if (loading) return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
  )

  return (
     <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "#F5F5F5" }}>
   <FlatList
  data={list}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => <WishCard wish={item} />}
/>

    </SafeAreaView>
  );
}

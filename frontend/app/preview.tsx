import { View, Text, Button } from 'react-native'
import { useSelector } from 'react-redux'
import { router } from 'expo-router'

export default function Preview() {
  const wish = useSelector((s: any) =>
    s.wishes.list[s.wishes.list.length - 1]
  )

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-white text-2xl font-bold mb-4">
        Preview Wish 👀
      </Text>

      <View className="bg-gray-800 p-4 rounded-xl mb-4">
        <Text className="text-white text-lg">
          🎉 {wish?.name}
        </Text>
        <Text className="text-gray-300 mt-2">
          {wish?.message}
        </Text>
        <Text className="text-gray-400 mt-2 text-sm">
          ⏰ {wish?.date} at {wish?.time}
        </Text>
      </View>

      <Button
        title="Confirm & Schedule"
        onPress={() => router.replace('/')}
      />
    </View>
  )
}

import * as Notifications from 'expo-notifications'

export default async function useSchedulePermission() {
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

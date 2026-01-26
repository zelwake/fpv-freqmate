# React Native Best Practices

## Expo APIs

- Use Expo APIs when available (expo-sqlite, expo-constants, etc.)
- Leverage Expo Router for navigation (file-based routing in `app/`)
- Use `expo-image` instead of React Native's Image component

## Platform Support

- Test on multiple platforms (iOS, Android, Web)
- Use SafeAreaView or react-native-safe-area-context

## Performance

- Use React.memo for expensive components
- Implement proper list virtualization (FlatList, not ScrollView for long lists)
- Use Suspense for code splitting when appropriate

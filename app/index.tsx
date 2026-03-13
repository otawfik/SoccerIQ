import { Redirect } from 'expo-router';

// Redirect root to the tabs home
export default function Root() {
  return <Redirect href="/(tabs)" />;
}

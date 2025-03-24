// This file is a placeholder to prevent expo-router from complaining about missing routes
// The actual app uses React Navigation instead of expo-router
import { Redirect } from 'expo-router';

export default function Page() {
  // Redirect to main app
  return <Redirect href="/" />;
} 
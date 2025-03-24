import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
import GameLobbyScreen from './src/screens/GameLobbyScreen';
import RoleAssignmentScreen from './src/screens/RoleAssignmentScreen';
import GameHistoryScreen from './src/screens/GameHistoryScreen';
import GameTutorialScreen from './src/screens/GameTutorialScreen';
import JoinGameScreen from './src/screens/JoinGameScreen';  
import SettingsScreen from './src/screens/settings/SettingsScreen';
import EditProfileScreen from './src/screens/settings/EditProfileScreen';
import GameStatsScreen from './src/screens/settings/GameStatsScreen';
import GameOverview from './src/screens/GameOverviewScreen';
import RolesAndAbilities from './src/screens/RolesAndAbilitiesScreen';
import WinningStrategies from './src/screens/WinningStrategiesScreen';
import GamePhases from './src/screens/GamePhasesScreen';
import HostGameScreen from './src/screens/HostGameScreen';
import PlayerRole from './src/screens/PlayerRoleScreen';  
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { ImageBackground, SafeAreaView, Platform } from 'react-native';
import theme from './src/theme'; // Import the theme
import { ErrorProvider } from './src/context/ErrorContext'; 
import GamePlayScreen from './src/screens/GamePlayScreen';
import GameControlScreen from './src/screens/GameControlScreen';  

// Create a custom navigation theme based on our app theme
const navigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.text.primary,
    border: 'rgba(255, 255, 255, 0.08)',
    notification: theme.colors.tertiary,
  },
};

const Stack = createNativeStackNavigator();

// Global screen options for a consistent look
const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  contentStyle: {
    backgroundColor: theme.colors.background,
  },
  cardStyle: { backgroundColor: 'transparent' },
};

export default function App() {
  // For web - Setup PWA related meta tags
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Add meta tags for PWA
      const setMetaTag = (name, content) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // Set viewport for mobile
      setMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      
      // Set theme color
      setMetaTag('theme-color', theme.colors.background);
      
      // Set apple-mobile-web-app properties for iOS
      setMetaTag('apple-mobile-web-app-capable', 'yes');
      setMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
      
      // Load PWA registration script
      const script = document.createElement('script');
      script.src = '/pwa.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <AuthProvider>
      <ErrorProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <NavigationContainer theme={navigationTheme}>
            <StatusBar style="light" />
            <Stack.Navigator screenOptions={screenOptions}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="GameOverview" component={GameOverview} />
              <Stack.Screen name="RolesAndAbilities" component={RolesAndAbilities} />
              <Stack.Screen name="WinningStrategies" component={WinningStrategies} /> 
              <Stack.Screen name="GamePhases" component={GamePhases} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="GameLobby" component={GameLobbyScreen} />
              <Stack.Screen name="RoleAssignment" component={RoleAssignmentScreen} />
              <Stack.Screen name="GameHistory" component={GameHistoryScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="GameStats" component={GameStatsScreen} />
              <Stack.Screen name="HostGame" component={HostGameScreen} />
              <Stack.Screen name="JoinGame" component={JoinGameScreen} />
              <Stack.Screen name="GameTutorial" component={GameTutorialScreen} /> 
              <Stack.Screen name="PlayerRole" component={PlayerRole} /> 
              <Stack.Screen name="GamePlay" component={GamePlayScreen} />
              <Stack.Screen name="GameControl" component={GameControlScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </ErrorProvider>
    </AuthProvider>
  );
}

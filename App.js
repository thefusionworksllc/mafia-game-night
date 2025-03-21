import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
import {  ImageBackground} from 'react-native';
import theme from './src/theme'; // Import the theme
import { ErrorProvider } from './src/context/ErrorContext'; 
import GamePlayScreen from './src/screens/GamePlayScreen';
import GameControlScreen from './src/screens/GameControlScreen';  

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <ErrorProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
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
      </ErrorProvider>
    </AuthProvider>
  );
}

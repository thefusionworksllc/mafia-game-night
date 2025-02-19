import React, { useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import { useAuth } from '../context/AuthContext';
import { gameService } from '../services/gameService';
import BottomNavigation from '../components/BottomNavigation';

const JoinGameScreen = ({ navigation }) => {
  const [gameCode, setGameCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleJoinGame = async () => {
    if (gameCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit game code');
      return;
    }

    setLoading(true);
    try {
      await gameService.joinGame(gameCode);
      navigation.navigate('GameLobby', {
        gameCode: gameCode.toUpperCase(),
        isHost: false,
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const CustomButton = ({ title, onPress, style }) => (
    <LinearGradient
      colors={theme.gradients.button}
      style={[theme.commonStyles.buttonGradient, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Button
        title={title}
        onPress={onPress}
        loading={loading}
        buttonStyle={theme.commonStyles.buttonContent}
        titleStyle={theme.commonStyles.buttonText}
        containerStyle={theme.commonStyles.buttonContainer}
      />
    </LinearGradient>
  );

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={theme.commonStyles.content}
      resizeMode="cover"
    >
      <LinearGradient
        colors={theme.gradients.background}
       style={theme.commonStyles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={theme.commonStyles.content}>
          <Text style={styles.title}>Join Game</Text>
          <View style={theme.commonStyles.card}>
            <Input
              placeholder="Enter 6-digit Game Code"
              value={gameCode}
              onChangeText={(text) => setGameCode(text.toUpperCase())}
              maxLength={6}
              autoCapitalize="characters"
              leftIcon={{ 
                type: 'material',
                name: 'input',
                color: theme.colors.text.secondary
              }}
              inputStyle={[
                theme.commonStyles.input,
                styles.codeInput
              ]}
              placeholderTextColor={theme.colors.text.secondary}
              containerStyle={theme.commonStyles.inputContainer}
            />
            <CustomButton
              title="JOIN GAME"
              onPress={handleJoinGame}
            />
             <CustomButton
            title="BACK"
            onPress={() => navigation.navigate('Home')}
            style={{ marginTop: 20 }}
          />
          </View>
         
        </View>
      </LinearGradient>

      <BottomNavigation navigation={navigation} activeScreen="JoinGame" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  codeInput: {
    fontSize: theme.typography.sizes.lg,
    textAlign: 'center',
    letterSpacing: 3,
    fontWeight: theme.typography.weights.bold,
  },
  container: {
    flex: 1,
    paddingBottom: 80,
  },
});

export default JoinGameScreen;

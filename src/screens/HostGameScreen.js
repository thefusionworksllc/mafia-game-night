import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ImageBackground, Alert, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { gameService } from '../services/gameService';
import BottomNavigation from '../components/BottomNavigation';

const CustomCheckbox = ({ title, checked, onPress }) => (
  <TouchableOpacity 
    style={styles.checkboxContainer} 
    onPress={onPress}
  >
    <View style={[
      styles.checkbox,
      checked && styles.checkboxChecked
    ]}>
      {checked && (
        <Icon 
          name="check" 
          size={16} 
          color={theme.colors.text.accent} 
        />
      )}
    </View>
    <Text style={styles.checkboxText}>{title}</Text>
  </TouchableOpacity>
);

const SliderControl = ({ 
  value = 0,
  onValueChange = () => {},
  minimumValue = 0,
  maximumValue = 100,
  label = '',
  onDecrement = () => {},
  onIncrement = () => {},
  disabled = false 
}) => (
  <View style={styles.sliderContainer}>
    <Text style={styles.sliderLabel}>{label}</Text>
    <View style={styles.mafiaControls}>
      <TouchableOpacity 
        style={[styles.controlButton, disabled && styles.controlButtonDisabled]} 
        onPress={onDecrement}
        disabled={disabled}
      >
        <Icon 
          name="remove" 
          size={24} 
          color={theme.colors.text.secondary} 
        />
      </TouchableOpacity>
      
      <Slider
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={1}
        style={styles.slider}
        thumbStyle={styles.sliderThumb}
        trackStyle={styles.sliderTrack}
        minimumTrackTintColor={theme.colors.text.accent}
        maximumTrackTintColor={theme.colors.text.secondary}
        allowTouchTrack={true}
        thumbProps={{
          children: (
            <View style={styles.sliderThumb} />
          ),
        }}
      />

      <TouchableOpacity 
        style={[styles.controlButton, disabled && styles.controlButtonDisabled]} 
        onPress={onIncrement}
        disabled={disabled}
      >
        <Icon 
          name="add" 
          size={24} 
          color={theme.colors.text.secondary} 
        />
      </TouchableOpacity>
    </View>
  </View>
);

const HostGameScreen = ({ navigation }) => {
  const [totalPlayers, setTotalPlayers] = useState(6);
  const [mafiaCount, setMafiaCount] = useState(2);
  const [maxMafia, setMaxMafia] = useState(Math.floor(6 / 3));
  const [detectiveCount, setDetectiveCount] = useState(1);
  const [hasDoctor, setHasDoctor] = useState(true);
  const [loading, setLoading] = useState(false);
  const [gameCode, setGameCode] = useState(null);
  const [players, setPlayers] = useState([{ id: 'host', name: 'Host Player', isHost: true }]);

  // Handle mafia count changes
  const handleMafiaCountChange = (value) => {
    setMafiaCount(Math.min(value, maxMafia));
  };

  // Handle total players changes
  const handleTotalPlayersChange = (value) => {
    setTotalPlayers(value);
    const newMaxMafia = Math.floor(value / 3);
    setMaxMafia(newMaxMafia);
    // Adjust mafia count if it exceeds new maximum
    if (mafiaCount > newMaxMafia) {
      setMafiaCount(newMaxMafia);
    }
  };

  const incrementMafia = () => {
    if (mafiaCount < maxMafia) {
      setMafiaCount(mafiaCount + 1);
    }
  };

  const decrementMafia = () => {
    if (mafiaCount > 1) {
      setMafiaCount(mafiaCount - 1);
    }
  };

  const incrementTotalPlayers = () => {
    if (totalPlayers < 12) {
      handleTotalPlayersChange(totalPlayers + 1);
    }
  };

  const decrementTotalPlayers = () => {
    if (totalPlayers > 4) {
      handleTotalPlayersChange(totalPlayers - 1);
    }
  };

  // Detective count handlers
  const incrementDetective = () => {
    if (detectiveCount < 2) {
      setDetectiveCount(detectiveCount + 1);
    }
  };

  const decrementDetective = () => {
    if (detectiveCount > 1) {
      setDetectiveCount(detectiveCount - 1);
    }
  };

  // Calculate remaining civilians (updated)
  const remainingCivilians = totalPlayers - mafiaCount - detectiveCount - (hasDoctor ? 1 : 0);

  const handleHostGame = async () => {
    console.log('Host Game button clicked');
    const specialRolesCount = detectiveCount + (hasDoctor ? 1 : 0);
    const civilians = totalPlayers - mafiaCount - specialRolesCount;

    if (civilians < 1) {
      Alert.alert('Error', 'Not enough players for selected roles');
      return;
    }

    setLoading(true);
    try {
      const createdGameCode = await gameService.createGame({
        totalPlayers,
        mafiaCount,
        detectiveCount,
        hasDoctor
      });

      setGameCode(createdGameCode);
      console.log('Game created with code:', createdGameCode);
      navigation.navigate('GameLobby', { gameCode: createdGameCode, isHost: true });
    } catch (error) {
      console.error('Error creating game:', error);
      Alert.alert('Error', error.message || 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  const CustomButton = ({ title, onPress, style, loading }) => (
    <LinearGradient
      colors={theme.gradients.button}
      style={[theme.commonStyles.buttonGradient, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Button
        title={title}
        onPress={onPress}
        buttonStyle={theme.commonStyles.buttonContent}
        titleStyle={theme.commonStyles.buttonText}
        containerStyle={theme.commonStyles.buttonContainer}
        loading={loading}
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
          <Text style={styles.title}>Host Game</Text>
          <View style={theme.commonStyles.card}>
            {/* Total Players Slider */}
            <SliderControl
              value={totalPlayers}
              onValueChange={handleTotalPlayersChange}
              minimumValue={4}
              maximumValue={12}
              label={`Total Players: ${totalPlayers}`}
              onDecrement={decrementTotalPlayers}
              onIncrement={incrementTotalPlayers}
            />

            {/* Mafia Players Slider */}
            <SliderControl
              value={mafiaCount}
              onValueChange={handleMafiaCountChange}
              minimumValue={1}
              maximumValue={maxMafia}
              label={`Mafia Players: ${mafiaCount} (Max: ${maxMafia})`}
              onDecrement={decrementMafia}
              onIncrement={incrementMafia}
            />

            {/* Detective Count */}
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>
                Detective Count: <Text style={styles.numberText}>{detectiveCount}</Text> (Max: 2)
              </Text>
              <View style={styles.mafiaControls}>
                <TouchableOpacity 
                  style={[
                    styles.controlButton,
                    detectiveCount <= 1 && styles.controlButtonDisabled
                  ]} 
                  onPress={decrementDetective}
                  disabled={detectiveCount <= 1}
                >
                  <Icon 
                    name="remove" 
                    size={24} 
                    color={theme.colors.text.secondary} 
                  />
                </TouchableOpacity>
                
                <View style={styles.detectiveCountDisplay}>
                  <Text style={styles.numberText}>{detectiveCount}</Text>
                </View>

                <TouchableOpacity 
                  style={[
                    styles.controlButton,
                    detectiveCount >= 2 && styles.controlButtonDisabled
                  ]} 
                  onPress={incrementDetective}
                  disabled={detectiveCount >= 2}
                >
                  <Icon 
                    name="add" 
                    size={24} 
                    color={theme.colors.text.secondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Doctor Checkbox */}
            <View style={styles.rolesContainer}>
              <CustomCheckbox
                title="Doctor"
                checked={hasDoctor}
                onPress={() => setHasDoctor(!hasDoctor)}
              />
            </View>

            {/* Summary and Host Game Button */}
            <View style={styles.summary}>
              <Text style={[
                styles.summaryText,
                remainingCivilians < 1 && styles.errorText
              ]}>
                Civilians: <Text style={styles.numberText}>{remainingCivilians}</Text>
              </Text>
              {remainingCivilians < 1 && (
                <Text style={styles.errorText}>
                  Not enough players for selected roles
                </Text>
              )}
            </View>

            <CustomButton
              title="HOST GAME"
              onPress={handleHostGame}
              loading={loading}
            />
          </View>
        </View>
      </LinearGradient>
      <BottomNavigation navigation={navigation} activeScreen="HostGame" />
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
  sliderContainer: {
    marginBottom: theme.spacing.lg,
  },
  sliderLabel: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    fontWeight: theme.typography.weights.medium,
  },
  numberText: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.text.accent,
    fontWeight: theme.typography.weights.bold,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.text.accent,
  },
  sliderTrack: {
    height: 5,
    borderRadius: 3,
  },
  rolesContainer: {
    marginBottom: theme.spacing.lg,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    borderColor: theme.colors.text.accent,
  },
  checkboxText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
  },
  summary: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.sm,
    marginTop: theme.spacing.xs,
  },
  mafiaControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
  },
  controlButton: {
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
    height: 40,
  },
  controlButtonDisabled: {
    opacity: 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  detectiveCountDisplay: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HostGameScreen; 
import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import ModernBackground from '../../components/ModernBackground';
import CustomButton from '../../components/CustomButton';
import BottomNavigation from '../../components/BottomNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ChangeAvatarScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.photoURL);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  // Predefined avatar options
  const avatarOptions = [
    require('../../../assets/avatars/avatar1.png'),
    require('../../../assets/avatars/avatar2.png'),
    require('../../../assets/avatars/avatar3.png'),
    require('../../../assets/avatars/avatar4.png'),
    require('../../../assets/avatars/avatar5.png'),
    require('../../../assets/avatars/avatar6.png'),
    require('../../../assets/avatars/avatar7.png'),
    require('../../../assets/avatars/avatar8.png'),
    require('../../../assets/avatars/avatar9.png'),
  ];

  const handleSaveAvatar = async () => {
    setLoading(true);
    try {
      await userService.updateProfile({
        photoURL: selectedAvatar,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error updating avatar:', error);
      Alert.alert('Error', 'Failed to update avatar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground>
        <ScrollView 
          style={theme.commonStyles.scrollContainer}
          contentContainerStyle={theme.commonStyles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={theme.commonStyles.title}>Change Avatar</Text>

          <View style={styles.currentAvatarContainer}>
            <Text style={styles.sectionTitle}>Current Avatar</Text>
            <LinearGradient
              colors={theme.gradients.card}
              style={styles.currentAvatarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {user?.photoURL ? (
                <Image
                  source={{ uri: user.photoURL }}
                  style={styles.currentAvatar}
                />
              ) : (
                <LinearGradient
                  colors={theme.gradients.accent}
                  style={styles.defaultAvatar}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon 
                    name="person" 
                    size={50} 
                    color={theme.colors.text.primary} 
                  />
                </LinearGradient>
              )}
            </LinearGradient>
          </View>

          <Text style={styles.sectionTitle}>Choose New Avatar</Text>
          <View style={styles.avatarGrid}>
            <View style={styles.gridContainer}>
              {avatarOptions.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === avatar && styles.selectedAvatar,
                  ]}
                  onPress={() => setSelectedAvatar(avatar)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={theme.gradients.card}
                    style={styles.avatarGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Image source={avatar} style={styles.avatarImage} />
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="SAVE AVATAR"
              onPress={handleSaveAvatar}
              loading={loading}
              disabled={!selectedAvatar || loading}
              leftIcon={<Icon name="save" size={20} color={theme.colors.text.primary} />}
              fullWidth
            />
            
            <CustomButton
              title="BACK TO SETTINGS"
              onPress={() => navigation.navigate('Settings')}
              variant="outline"
              style={styles.backButton}
              leftIcon={<Icon name="arrow-back" size={20} color={theme.colors.text.accent} />}
              fullWidth
            />
          </View>
        </ScrollView>
      </ModernBackground>
      <BottomNavigation navigation={navigation} activeScreen="Settings" />
    </View>
  );
};

const styles = StyleSheet.create({
  currentAvatarContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  currentAvatarGradient: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
  currentAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  defaultAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  avatarGrid: {
    marginBottom: theme.spacing.xl,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
  },
  avatarOption: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    padding: theme.spacing.xs,
  },
  selectedAvatar: {
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.medium,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
});

export default ChangeAvatarScreen; 
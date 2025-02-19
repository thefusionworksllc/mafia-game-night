import React, { useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from 'react-native-elements';
import theme from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';

const ChangeAvatarScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(user.photoURL);
  const [loading, setLoading] = useState(false);

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
    <ImageBackground
      source={require('../../../assets/background.png')}
      style={theme.commonStyles.content}
      resizeMode="cover"
    >
      <LinearGradient
        colors={theme.gradients.background}
        style={theme.commonStyles.container}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Change Avatar</Text>

          <View style={styles.currentAvatarContainer}>
            <Text style={styles.subtitle}>Current Avatar</Text>
            {user.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.currentAvatar}
              />
            ) : (
              <View style={[styles.currentAvatar, styles.defaultAvatar]}>
                <Icon 
                  name="person" 
                  size={50} 
                  color={theme.colors.text.secondary} 
                />
              </View>
            )}
          </View>

          <Text style={styles.subtitle}>Choose New Avatar</Text>
          <ScrollView style={styles.avatarGrid}>
            <View style={styles.gridContainer}>
              {avatarOptions.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === avatar && styles.selectedAvatar,
                  ]}
                  onPress={() => setSelectedAvatar(avatar)}
                >
                  <Image source={avatar} style={styles.avatarImage} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Button
            title="Save Avatar"
            onPress={handleSaveAvatar}
            loading={loading}
            buttonStyle={styles.saveButton}
            titleStyle={styles.buttonText}
            disabled={!selectedAvatar || loading}
          />
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginVertical: theme.spacing.xl,
  },
  currentAvatarContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  subtitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  currentAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: theme.spacing.md,
  },
  defaultAvatar: {
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarGrid: {
    flex: 1,
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
    borderRadius: 15,
    padding: theme.spacing.xs,
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  buttonText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
  },
});

export default ChangeAvatarScreen; 
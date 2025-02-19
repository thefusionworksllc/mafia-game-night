import React, { useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Input, Button } from 'react-native-elements';
import theme from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import BottomNavigation from '../../components/BottomNavigation';

const EditProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Display name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await userService.updateProfile({ displayName });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return;
    }

    setPasswordLoading(true);
    try {
      await userService.updatePassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password updated successfully');
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setPasswordLoading(false);
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
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Edit Profile</Text>
          
          {/* Profile Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            <Input
              placeholder="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              placeholderTextColor={theme.colors.text.secondary}
            />
            <Button
              title="Save Profile"
              onPress={handleSaveProfile}
              loading={loading}
              buttonStyle={styles.saveButton}
              containerStyle={styles.buttonContainer}
            />
          </View>

          {/* Password Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Change Password</Text>
            <Input
              placeholder="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              placeholderTextColor={theme.colors.text.secondary}
            />
            <Input
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              placeholderTextColor={theme.colors.text.secondary}
            />
            <Input
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              placeholderTextColor={theme.colors.text.secondary}
            />
            <Button
              title="Change Password"
              onPress={handleChangePassword}
              loading={passwordLoading}
              buttonStyle={[styles.saveButton, styles.passwordButton]}
              containerStyle={styles.buttonContainer}
            />
          </View>
        </ScrollView>

       
      </LinearGradient>
      <BottomNavigation navigation={navigation} activeScreen="EditProfile" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80,
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  input: {
    color: theme.colors.text.primary,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
    paddingVertical: theme.spacing.md,
  },
  passwordButton: {
    backgroundColor: theme.colors.secondary,
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
  },
});

export default EditProfileScreen; 
import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, ScrollView, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import BottomNavigation from '../../components/BottomNavigation';
import ModernBackground from '../../components/ModernBackground';
import CustomButton from '../../components/CustomButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useError } from '../../context/ErrorContext';

const CustomInput = ({ placeholder, value, onChangeText, secureTextEntry, icon }) => (
  <View style={styles.inputWrapper}>
    <View style={styles.inputContainer}>
      {icon && (
        <View style={styles.inputIconContainer}>
          <Icon name={icon} size={20} color={theme.colors.text.secondary} />
        </View>
      )}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        placeholderTextColor={theme.colors.text.secondary}
        editable={true}
        pointerEvents="auto"
      />
    </View>
  </View>
);

const EditProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { showError } = useError();

  const handleUpdateProfile = async () => {
    if (displayName.trim() === '') {
      showError('Display name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await userService.updateUserProfile(displayName);
      showError('Profile updated successfully!', 'success');
      navigation.goBack();
    } catch (error) {
      showError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (email.trim() === '') {
      showError('Email cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await userService.updateUserEmail(email);
      showError('Email updated successfully!', 'success');
      navigation.goBack();
    } catch (error) {
      showError(error.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.trim() === '') {
      showError('New password cannot be empty');
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await userService.updateUserPassword(newPassword);
      showError('Password updated successfully!', 'success');
      setNewPassword('');
      setConfirmPassword('');
      navigation.goBack();
    } catch (error) {
      showError(error.message || 'Failed to update password');
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
          <Text style={theme.commonStyles.title}>Edit Profile</Text>
          
          {/* Profile Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="person" size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Profile Information</Text>
            </View>
            <LinearGradient
              colors={theme.gradients.card}
              style={styles.sectionContent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <CustomInput
                placeholder="Display Name"
                value={displayName}
                onChangeText={setDisplayName}
                icon="badge"
              />
              <CustomButton
                title="SAVE PROFILE"
                onPress={handleUpdateProfile}
                loading={loading}
                leftIcon={<Icon name="save" size={20} color={theme.colors.text.primary} />}
                style={styles.saveButton}
                fullWidth
              />
            </LinearGradient>
          </View>

          {/* Password Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="lock" size={24} color={theme.colors.info} />
              <Text style={styles.sectionTitle}>Change Password</Text>
            </View>
            <LinearGradient
              colors={theme.gradients.card}
              style={styles.sectionContent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <CustomInput
                placeholder="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                icon="vpn-key"
              />
              <CustomInput
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                icon="lock-outline"
              />
              <CustomInput
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                icon="lock-outline"
              />
              <CustomButton
                title="CHANGE PASSWORD"
                onPress={handleUpdatePassword}
                loading={loading}
                variant="secondary"
                leftIcon={<Icon name="security" size={20} color={theme.colors.text.primary} />}
                style={styles.passwordButton}
                fullWidth
              />
            </LinearGradient>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="BACK TO SETTINGS"
              onPress={() => navigation.navigate('Settings')}
              variant="outline"
              leftIcon={<Icon name="arrow-back" size={20} color={theme.colors.text.accent} />}
              style={styles.backButton}
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginLeft: theme.spacing.sm,
  },
  sectionContent: {
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  inputWrapper: {
    marginBottom: theme.spacing.md,
    pointerEvents: 'auto',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.sm,
    pointerEvents: 'auto',
  },
  inputIconContainer: {
    marginRight: theme.spacing.sm,
    pointerEvents: 'auto',
  },
  input: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    pointerEvents: 'auto',
  },
  saveButton: {
    marginTop: theme.spacing.md,
  },
  passwordButton: {
    marginTop: theme.spacing.md,
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
});

export default EditProfileScreen; 
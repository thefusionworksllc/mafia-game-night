import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../theme';
import { useAuth } from '../../context/AuthContext';
import BottomNavigation from '../../components/BottomNavigation';
import ModernBackground from '../../components/ModernBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';

const SettingsScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const menuItems = [
    {
      title: 'Edit Profile',
      icon: 'person',
      description: 'Update your name and personal information',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      title: 'Game Statistics',
      icon: 'bar-chart',
      description: 'View your game history and performance',
      onPress: () => navigation.navigate('GameStats'),
    },
    {
      title: 'Change Avatar',
      icon: 'photo-camera',
      description: 'Select a new profile picture',
      onPress: () => navigation.navigate('ChangeAvatar'),
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderMenuItem = ({ title, icon, description, onPress }) => (
    <TouchableOpacity
      key={title}
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={theme.gradients.card}
        style={styles.menuItemGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.menuIconContainer}>
          <Icon name={icon} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuItemText}>{title}</Text>
          <Text style={styles.menuItemDescription}>{description}</Text>
        </View>
        <Icon name="chevron-right" size={24} color={theme.colors.text.secondary} />
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={theme.commonStyles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ModernBackground>
        <ScrollView
          style={theme.commonStyles.scrollContainer}
          contentContainerStyle={theme.commonStyles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                {user?.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    style={styles.avatar}
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
              </View>
              <Text style={styles.displayName}>{user?.displayName || 'User'}</Text>
              <Text style={styles.email}>{user?.email || 'No email provided'}</Text>
            </View>

            <Text style={styles.sectionTitle}>Account Settings</Text>
            <View style={styles.menuSection}>
              {menuItems.map(renderMenuItem)}
            </View>

            <View style={styles.signOutContainer}>
              <CustomButton
                title="SIGN OUT"
                onPress={handleSignOut}
                variant="outline"
                leftIcon={<Icon name="logout" size={20} color={theme.colors.error} />}
                style={styles.signOutButton}
                textStyle={{ color: theme.colors.error }}
              />
            </View>
          </View>
        </ScrollView>
      </ModernBackground>
      <BottomNavigation navigation={navigation} activeScreen="Settings" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  avatar: {
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
  displayName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  email: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    marginBottom: theme.spacing.md,
  },
  menuSection: {
    marginBottom: theme.spacing.xl,
  },
  menuItem: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  menuItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  menuItemDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  signOutContainer: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  signOutButton: {
    borderColor: theme.colors.error,
  },
});

export default SettingsScreen; 
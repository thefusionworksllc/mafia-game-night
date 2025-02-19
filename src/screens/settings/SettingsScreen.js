import React from 'react';
import { View, StyleSheet, Text, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../theme';
import { useAuth } from '../../context/AuthContext';
import BottomNavigation from '../../components/BottomNavigation';

const SettingsScreen = ({ navigation }) => {
  const { user } = useAuth();

  const menuItems = [
    {
      title: 'Edit Profile',
      icon: 'person',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      title: 'Game Statistics',
      icon: 'bar-chart',
      onPress: () => navigation.navigate('GameStats'),
    },
    {
      title: 'Change Avatar',
      icon: 'photo-camera',
      onPress: () => navigation.navigate('ChangeAvatar'),
    },
  ];

  const renderMenuItem = ({ title, icon, onPress }) => (
    <TouchableOpacity
      key={title}
      style={styles.menuItem}
      onPress={onPress}
    >
      <LinearGradient
        colors={['rgba(187, 134, 252, 0.1)', 'rgba(187, 134, 252, 0.05)']}
        style={styles.menuItemGradient}
      >
        <Icon name={icon} size={24} color={theme.colors.text.accent} />
        <Text style={styles.menuItemText}>{title}</Text>
        <Icon name="chevron-right" size={24} color={theme.colors.text.secondary} />
      </LinearGradient>
    </TouchableOpacity>
  );

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
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {user.photoURL ? (
                <Image
                  source={{ uri: user.photoURL }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.defaultAvatar]}>
                  <Icon 
                    name="person" 
                    size={50} 
                    color={theme.colors.text.secondary} 
                  />
                </View>
              )}
            </View>
            <Text style={styles.displayName}>{user.displayName}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>

          <View style={styles.menuSection}>
            {menuItems.map(renderMenuItem)}
          </View>
        </View>
      </LinearGradient>
      <BottomNavigation navigation={navigation} activeScreen="Settings" />
    </ImageBackground>
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
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  defaultAvatar: {
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  menuSection: {
    marginTop: theme.spacing.xl,
  },
  menuItem: {
    marginBottom: theme.spacing.md,
  },
  menuItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: 12,
  },
  menuItemText: {
    flex: 1,
    marginLeft: theme.spacing.md,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.primary,
  },
});

export default SettingsScreen; 
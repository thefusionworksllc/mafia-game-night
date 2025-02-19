import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme';
import { useAuth } from '../context/AuthContext';

const BottomNavButton = React.memo(({ title, icon, onPress, disabled, isActive }) => (
  <TouchableOpacity 
    style={[styles.navButton, isActive && styles.activeButton]} 
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <Icon 
      name={icon} 
      size={28} 
      color={isActive ? theme.colors.primary : (disabled ? theme.colors.text.disabled : theme.colors.text.accent)} 
    />
    <Text style={[
      styles.navButtonText,
      disabled && styles.navButtonTextDisabled,
      isActive && styles.activeButtonText
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
));

const MoreModal = ({ visible, onClose, navigation }) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      console.log("Attempting to sign out...");
      await signOut();
      console.log("Sign out successful.");
      onClose();
      navigation.navigate('Login');
    } catch (error) {
      console.error("Sign out error:", error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.modalItem}
            onPress={() => {
              onClose();
              navigation.navigate('GameTutorial');
            }}
          >
            <Icon name="help-outline" size={24} color={theme.colors.text.accent} />
            <Text style={styles.modalItemText}>Tutorial</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.modalItem}
            onPress={() => {
              onClose();
              navigation.navigate('Settings');
            }}
          >
            <Icon name="settings" size={24} color={theme.colors.text.accent} />
            <Text style={styles.modalItemText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.modalItem}
            onPress={handleSignOut}
          >
            <Icon name="logout" size={24} color={theme.colors.text.accent} />
            <Text style={styles.modalItemText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const BottomNavigation = ({ navigation, activeScreen }) => {
  const [moreModalVisible, setMoreModalVisible] = useState(false);
  
  const handleNavigation = useCallback((screen, params) => {
    navigation.navigate(screen, params);
  }, [navigation]);

  return (
    <View style={styles.bottomNav}>
      <LinearGradient
        colors={[
          'rgba(42, 38, 87, 0.95)',
          'rgba(30, 30, 30, 0.9)',
        ]}
        style={styles.bottomNavGradient}
      >
        <View style={styles.bottomNavContent}>
          <BottomNavButton
            title="Home"
            icon="home"
            onPress={() => handleNavigation('Home')}
            disabled={activeScreen === 'Home'}
            isActive={activeScreen === 'Home'}
          />
          <BottomNavButton
            title="Host"
            icon="add-circle-outline"
            onPress={() => handleNavigation('HostGame')}
            disabled={activeScreen === 'HostGame'}
            isActive={activeScreen === 'HostGame'}
          />
          <BottomNavButton
            title="Join"
            icon="group-add"
            onPress={() => handleNavigation('JoinGame')}
            disabled={activeScreen === 'JoinGame'}
            isActive={activeScreen === 'JoinGame'}
          />
          <BottomNavButton
            title="History"
            icon="history"
            onPress={() => handleNavigation('GameHistory')}
            disabled={activeScreen === 'GameHistory'}
            isActive={activeScreen === 'GameHistory'}
          />
          <BottomNavButton
            title="More"
            icon="more-horiz"
            onPress={() => setMoreModalVisible(true)}
            disabled={activeScreen === 'Settings' || activeScreen === 'GameTutorial'}
            isActive={moreModalVisible}
          />
        </View>
      </LinearGradient>

      <MoreModal 
        visible={moreModalVisible}
        onClose={() => setMoreModalVisible(false)}
        navigation={navigation}
        activeScreen={activeScreen}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  bottomNavGradient: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    //borderTopLeftRadius: 15,
    //borderTopRightRadius: 15,
  },
  bottomNavContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xs,
    minWidth: 65,
  },
  activeButton: {
    transform: [{ scale: 1.1 }],
  },
  navButtonText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.sm,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: theme.colors.primary,
  },
  navButtonTextDisabled: {
    color: theme.colors.text.disabled,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: theme.spacing.lg,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: 10,
  },
  modalItemText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    marginLeft: theme.spacing.md,
  },
});

export default BottomNavigation; 
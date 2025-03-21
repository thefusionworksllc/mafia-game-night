import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BottomNavButton = React.memo(({ title, icon, onPress, disabled, isActive }) => (
  <TouchableOpacity 
    style={[styles.navButton, isActive && styles.activeButton]} 
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
      <Icon 
        name={icon} 
        size={32} 
        color={isActive ? theme.colors.primary : (disabled ? theme.colors.text.disabled : theme.colors.text.secondary)} 
      />
    </View>
    <Text style={[
      styles.navButtonText,
      disabled && styles.navButtonTextDisabled,
      isActive && styles.activeButtonText
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
));

const MoreModal = ({ visible, onClose, navigation, isLoggedIn }) => {
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  const handleSignOut = async () => {
    try {
      console.log("Attempting to sign out...");
      await signOut();
      console.log("Sign out successful.");
      onClose();
      navigation.navigate('Home');
    } catch (error) {
      console.error("Sign out error:", error);
      if (Platform.OS === 'web') {
        setConfirmationData({
          title: 'Error',
          message: 'Failed to sign out. Please try again.',
          onConfirm: () => setConfirmationVisible(false),
          confirmText: 'OK'
        });
        setConfirmationVisible(true);
      } else {
        Alert.alert('Error', 'Failed to sign out. Please try again.');
      }
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
        <View style={[
          styles.modalContent,
          { paddingBottom: Math.max(insets.bottom, 16) }
        ]}>
          <View style={styles.modalHandle} />
          
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
          
          {isLoggedIn ? (
            <>
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
            </>
          ) : (
            <TouchableOpacity 
              style={styles.modalItem}
              onPress={() => {
                onClose();
                navigation.navigate('Login');
              }}
            >
              <Icon name="login" size={24} color={theme.colors.text.accent} />
              <Text style={styles.modalItemText}>Login / Register</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      
      {/* Confirmation Modal for Web */}
      {confirmationVisible && confirmationData && (
        <View style={styles.confirmationOverlay}>
          <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationTitle}>{confirmationData.title}</Text>
            <Text style={styles.confirmationText}>{confirmationData.message}</Text>
            <View style={styles.confirmationButtons}>
              {confirmationData.onCancel && (
                <TouchableOpacity 
                  style={[styles.confirmationButton, styles.cancelButton]} 
                  onPress={confirmationData.onCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[
                  styles.confirmationButton, 
                  confirmationData.onCancel ? styles.confirmButton : styles.singleButton
                ]} 
                onPress={confirmationData.onConfirm}
              >
                <Text style={styles.confirmButtonText}>{confirmationData.confirmText || 'OK'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
};

const BottomNavigation = ({ navigation, activeScreen }) => {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const insets = useSafeAreaInsets();
  const [moreModalVisible, setMoreModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  
  const handleNavigation = useCallback((screen, params) => {
    navigation.navigate(screen, params);
  }, [navigation]);

  const handleSignOut = async () => {
    try {
      await user.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      if (Platform.OS === 'web') {
        setConfirmationData({
          title: 'Error',
          message: 'Failed to sign out. Please try again.',
          onCancel: null,
          onConfirm: () => setConfirmationVisible(false),
          confirmText: 'OK'
        });
        setConfirmationVisible(true);
      } else {
        Alert.alert('Error', 'Failed to sign out. Please try again.');
      }
    }
  };

  return (
    <View style={[
      styles.bottomNav,
      Platform.OS === 'ios' && { paddingBottom: insets.bottom },
    ]}>
      <LinearGradient
        colors={[
          'rgba(25, 25, 35, 0.98)',
          'rgba(18, 18, 30, 0.99)',
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
            icon="add-circle"
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
            title="Settings"
            icon="more-horiz"
            onPress={() => setMoreModalVisible(true)}
            isActive={activeScreen === 'Settings' || activeScreen === 'Login' || activeScreen === 'GameTutorial'}
          />
        </View>
      </LinearGradient>
      
      <MoreModal
        visible={moreModalVisible}
        onClose={() => setMoreModalVisible(false)}
        navigation={navigation}
        isLoggedIn={isLoggedIn}
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
    zIndex: 1000,
    elevation: 8,
    ...theme.shadows.large,
  },
  bottomNavGradient: {
    paddingTop: theme.spacing.md,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 0,
  },
  bottomNavContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 0 : 8,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xs,
    minWidth: SCREEN_WIDTH / 7,
    maxWidth: SCREEN_WIDTH / 5,
  },
  activeButton: {
    transform: [{ translateY: -8 }],
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  navButtonText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.sm,
    marginTop: 2,
    textAlign: 'center',
    fontWeight: theme.typography.weights.medium,
  },
  activeButtonText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold,
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
    backgroundColor: 'rgba(30, 30, 40, 0.97)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  modalHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalItemText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    marginLeft: theme.spacing.md,
    fontWeight: theme.typography.weights.medium,
  },
  confirmationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmationContainer: {
    backgroundColor: theme.colors?.background?.secondary || '#343544',
    borderRadius: theme.borderRadius?.lg || 16,
    padding: theme.spacing?.lg || 24,
    width: '80%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  confirmationTitle: {
    fontSize: theme.fontSizes?.lg || 16,
    fontWeight: 'bold',
    color: theme.colors?.text?.primary || '#FFFFFF',
    marginBottom: theme.spacing?.md || 16,
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: theme.fontSizes?.md || 14,
    color: theme.colors?.text?.secondary || '#CCCCCC',
    marginBottom: theme.spacing?.lg || 24,
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmationButton: {
    paddingVertical: theme.spacing?.sm || 8,
    paddingHorizontal: theme.spacing?.md || 16,
    borderRadius: theme.borderRadius?.md || 8,
    flex: 1,
    marginHorizontal: theme.spacing?.xs || 4,
    alignItems: 'center',
  },
  singleButton: {
    backgroundColor: theme.colors?.primary || '#BB86FC',
    marginHorizontal: 0,
  },
  cancelButton: {
    backgroundColor: theme.colors?.background?.tertiary || '#2A2A3A',
  },
  cancelButtonText: {
    color: theme.colors?.text?.primary || '#FFFFFF',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: theme.colors?.primary || '#BB86FC',
  },
  confirmButtonText: {
    color: theme.colors?.text?.primary || '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default BottomNavigation; 
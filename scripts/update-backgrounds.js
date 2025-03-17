/**
 * BACKGROUND MODERNIZATION GUIDE
 * 
 * This guide explains how to update all screens in the app to use the new ModernBackground component.
 * 
 * Steps to update a screen:
 * 
 * 1. Import the ModernBackground component:
 *    import ModernBackground from '../components/ModernBackground';
 *    (Adjust the path as needed based on the file location)
 * 
 * 2. Remove these imports if they're only used for the background:
 *    - import { ImageBackground } from 'react-native';
 *    - import { LinearGradient } from 'expo-linear-gradient';
 * 
 * 3. Replace the background implementation:
 * 
 *    FROM:
 *    ```
 *    <View style={theme.commonStyles.container}>
 *      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
 *      <ImageBackground
 *        source={require('../../assets/background.png')}
 *        style={theme.commonStyles.backgroundImage}
 *        resizeMode="cover"
 *      >
 *        <LinearGradient
 *          colors={theme.gradients.background}
 *          style={[
 *            theme.commonStyles.gradientContainer,
 *            { paddingTop: insets.top }
 *          ]}
 *        >
 *          {/* Content */}
 *        </LinearGradient>
 *      </ImageBackground>
 *    </View>
 *    ```
 * 
 *    TO:
 *    ```
 *    <View style={theme.commonStyles.container}>
 *      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
 *      <ModernBackground>
 *        {/* Content */}
 *      </ModernBackground>
 *    </View>
 *    ```
 * 
 * 4. If you had custom padding based on insets.top, you can remove it as ModernBackground
 *    already handles safe area insets.
 * 
 * 5. For screens that use ScrollView, update the contentContainerStyle to use theme.commonStyles.scrollContentContainer
 *    without additional paddingTop, as ModernBackground handles this.
 * 
 * 6. For screens with KeyboardAvoidingView, place it inside ModernBackground:
 *    ```
 *    <ModernBackground>
 *      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
 *        {/* Content */}
 *      </KeyboardAvoidingView>
 *    </ModernBackground>
 *    ```
 * 
 * 7. If you need to disable the subtle animation for performance reasons on certain screens,
 *    you can pass withAnimation={false} to ModernBackground.
 * 
 * Screens to update:
 * - ✅ HomeScreen
 * - ✅ JoinGameScreen
 * - ✅ LoginScreen
 * - ✅ RegisterScreen
 * - ✅ GameOverviewScreen
 * - ⬜ HostGameScreen
 * - ⬜ GameLobbyScreen
 * - ⬜ PlayerRoleScreen
 * - ⬜ GameTutorialScreen
 * - ⬜ RolesAndAbilitiesScreen
 * - ⬜ GameHistoryScreen
 * - ⬜ ProfileScreen
 * - ⬜ SettingsScreen
 * - ⬜ RoleAssignmentScreen
 * 
 * Benefits of using ModernBackground:
 * - Consistent look across all screens
 * - Subtle animation adds visual interest
 * - Proper handling of safe area insets
 * - Better performance through optimized rendering
 * - Easier maintenance - background styling in one place
 */ 
1)Install Node.js: Ensure you have Node.js installed on your machine.
 node -v
 v22.13.1

npm -v
 10.9.2

2) 
# Commands for mafia-game-night Project

# Create a new Expo project (using the new local CLI)
npx create-expo-app mafia-game-night

# Navigate to project directory
cd mafia-game-night

# Start the development server
npx expo start

3) Install dependencies
   npm install @react-navigation/native @react-navigation/native-stack react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view react-native-elements firebase

4) Install All the dependencies
   npm install
   
5)  Start the Expo Development Server
   npx expo start --clear

6) Install firebase
   npm install firebase


7)Remove the node_modules folder
Remove-Item -Recurse -Force node_modules

     rmdir /s /q node_modules

8)Remove the package-lock.json file 
Remove-Item -Force package-lock.json



## Steps to Deploy Using Expo EAS

### 1. Configure EAS

1. **Login to EAS**:
   Log in to your Expo account using the EAS CLI:

   ```bash
   eas login
   ```

2. **Initialize EAS**:
   In your project directory, run the following command to create an `eas.json` configuration file:

   ```bash
   eas build:configure
   ```

   This command will guide you through setting up your build configuration. You can choose the platforms you want to build for (iOS, Android, or both).

### 2. Build Your App

1. **Start the Build**:
   To build your app for Android or iOS, use the following command:

   ```bash
   eas build --platform android
   ```

   or

   ```bash
   eas build --platform ios
   ```

   You can also build for both platforms at once:

   ```bash
   eas build --platform all
   ```

2. **Select Build Profile**:
   During the build process, you may be prompted to select a build profile. You can choose between `development`, `preview`, or `production`. For a production build, select the `production` profile.

      eas build --platform android --profile preview


3. **Monitor Build Progress**:
   After starting the build, EAS will provide a URL where you can monitor the build progress. Once the build is complete, you will receive a link to download the APK (for Android) or the IPA (for iOS).

### 3. Distribute Your App

- **For Android**: You can distribute the APK directly or publish it to the Google Play Store.
- **For iOS**: You will need to upload the IPA to App Store Connect and follow the submission process to the App Store.

### 4. Deploying to Web

If you want to deploy your app to the web using EAS, you can do so by running:
bash
eas build --platform web

npx expo export -p web

This will create a production build of your web app. You can then deploy the generated files to a static hosting service like Vercel, Netlify, or GitHub Pages.

## Additional Considerations

- **Environment Variables**: Ensure that any environment variables (like Firebase configuration) are set correctly for production.
- **Testing**: Before deploying, thoroughly test your app on both mobile and web platforms to ensure everything works as expected.
- **App Store Guidelines**: Familiarize yourself with the guidelines for the App Store and Google Play Store to ensure your app meets all requirements for submission.

## Conclusion

Using **Expo EAS** simplifies the build and deployment process for your app. By following these steps, you should be able to successfully deploy your **Mafia Game Night** app to Android, iOS, and the web. If you have any questions or run into issues, feel free to ask!
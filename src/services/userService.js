import { auth, database } from '../config/firebase';
import { ref, update, get } from 'firebase/database';
import { 
  updateProfile, 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential 
} from 'firebase/auth';

export const userService = {
  updateProfile: async ({ displayName, photoURL }) => {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      // First update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: displayName || auth.currentUser.displayName,
        photoURL: photoURL || auth.currentUser.photoURL,
      });

      // Then update additional user data in Realtime Database
      const userRef = ref(database, `users/${auth.currentUser.uid}/profile`);
      const updates = {
        displayName: displayName || auth.currentUser.displayName,
        photoURL: photoURL || auth.currentUser.photoURL,
        updatedAt: new Date().toISOString(),
      };

      await update(userRef, updates);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.code === 'PERMISSION_DENIED') {
        throw new Error('You do not have permission to update this profile');
      }
      throw new Error('Failed to update profile. Please try again.');
    }
  },

  getUserStats: async () => {
    try {
      const userRef = ref(database, `users/${auth.currentUser.uid}/stats`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        // Return default stats if none exist
        return {
          gamesPlayed: 0,
          gamesWon: 0,
          gamesHosted: 0,
          roleStats: {
            civilian: 0,
            mafia: 0,
            detective: 0,
            doctor: 0
          }
        };
      }
      
      return snapshot.val();
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new Error('Failed to fetch user statistics');
    }
  },

  updatePassword: async (currentPassword, newPassword) => {
    try {
      const user = auth.currentUser;
      
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/wrong-password') {
        throw new Error('Current password is incorrect');
      }
      throw new Error('Failed to update password');
    }
  },

  updateGameStats: async (gameData, role, isWinner) => {
    try {
      // Make sure we have a valid user ID
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      const userRef = ref(database, `users/${auth.currentUser.uid}/stats`);
      const snapshot = await get(userRef);
      
      // Initialize stats if they don't exist
      const currentStats = snapshot.exists() ? snapshot.val() : {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesHosted: 0,
        roleStats: {
          civilian: 0,
          mafia: 0,
          detective: 0,
          doctor: 0
        }
      };

      // Normalize the role to lowercase
      const normalizedRole = role ? role.toLowerCase() : 'civilian';

      // Prepare updates
      const updates = {
        gamesPlayed: (currentStats.gamesPlayed || 0) + 1,
        gamesWon: (currentStats.gamesWon || 0) + (isWinner ? 1 : 0),
        roleStats: {
          ...currentStats.roleStats,
          [normalizedRole]: (currentStats.roleStats?.[normalizedRole] || 0) + 1
        }
      };

      // Update gamesHosted if user is the host
      if (gameData.hostId === auth.currentUser.uid) {
        updates.gamesHosted = (currentStats.gamesHosted || 0) + 1;
      }

      // Update the database
      await update(userRef, updates);
      return true;
    } catch (error) {
      console.error('Error updating game stats:', error);
      throw new Error('Failed to update game statistics');
    }
  },
}; 
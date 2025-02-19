import { auth } from '../config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { database } from '../config/firebase';

export const authService = {
  // ... existing methods ...

  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('No account found with this email address');
        case 'auth/invalid-email':
          throw new Error('Please enter a valid email address');
        default:
          throw new Error('Failed to send reset email. Please try again.');
      }
    }
  },

  initializeUserStats: async (uid) => {
    const userStatsRef = ref(database, `users/${uid}/stats`);
    await set(userStatsRef, {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesHosted: 0,
      roleStats: {
        civilian: 0,
        mafia: 0,
        detective: 0,
        doctor: 0
      }
    });
  },
}; 
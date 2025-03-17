import { getDatabase, ref, set, get, update, onValue, off, remove } from 'firebase/database';
import { auth, database } from '../config/firebase';
import { userService } from './userService';

const generateGameCode = () => {
  // Generate a random 6-digit number
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  const gameCode = Math.floor(Math.random() * (max - min + 1)) + min;
  return gameCode.toString();
};

// Add these constants at the top
const GAME_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

const getDbInstance = () => {
  if (!database) {
    throw new Error('Database not initialized. Please try again.');
  }
  return database;
};

export const gameService = {
  // Create a new game session
  createGame: async (totalPlayers, mafiaCount, detectiveCount, doctorCount) => {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to create a game');
    }

    const db = getDbInstance();

    try {
      let gameCode;
      let attempts = 0;
      const maxAttempts = 5;

      // Keep trying to generate a unique code
      while (attempts < maxAttempts) {
        gameCode = generateGameCode();
        const gameRef = ref(db, `games/${gameCode}`);
        const snapshot = await get(gameRef);

        // If code doesn't exist, use it
        if (!snapshot.exists()) {
          break;
        }
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Unable to generate unique game code. Please try again.');
      }

      // Create game data
      const newGame = {
        hostId: auth.currentUser.uid,
        hostName: auth.currentUser.displayName,
        status: 'waiting', // waiting, started, ended
        createdAt: new Date().toISOString(),
        settings: {
          totalPlayers,
          mafiaCount,
          detectiveCount,
          doctorCount
        },
        players: {
          [auth.currentUser.uid]: {
            id: auth.currentUser.uid,
            name: auth.currentUser.displayName,
            isHost: true,
            joinedAt: new Date().toISOString(),
          }
        }
      };

      console.log('Creating game with data:', newGame); // Add this for debugging

      // Get database reference and set data
      const gameRef = ref(db, `games/${gameCode}`);
      
      // Verify references
      if (!gameRef) {
        throw new Error('Failed to create database reference');
      }

      await set(gameRef, newGame);

      // Set up auto-end timer
      setTimeout(() => {
        endExpiredGame(gameCode);
      }, GAME_DURATION);

      console.log('Game created successfully with code:', gameCode); // Add this for debugging
      return gameCode;
    } catch (error) {
      console.error('Error in createGame:', error); // Add this for debugging
      throw new Error('Failed to create game: ' + error.message);
    }
  },

  // Add method to check and end expired games
  checkGameExpiry: async (gameCode) => {
    try {
      const gameRef = ref(database, `games/${gameCode}`);
      const snapshot = await get(gameRef);
      
      if (!snapshot.exists()) return false;
      
      const game = snapshot.val();
      const createdAt = new Date(game.createdAt).getTime();
      const now = new Date().getTime();
      
      return (now - createdAt) >= GAME_DURATION;
    } catch (error) {
      console.error('Error checking game expiry:', error);
      return false;
    }
  },

  // Add method to end expired game
  endExpiredGame: async (gameCode) => {
    try {
      const gameRef = ref(database, `games/${gameCode}`);
      const snapshot = await get(gameRef);
      
      if (!snapshot.exists()) return;
      
      const game = snapshot.val();
      if (game.status !== 'ended') {
        await update(gameRef, {
          status: 'ended',
          endedAt: new Date().toISOString(),
          endReason: 'timeout'
        });
      }
    } catch (error) {
      console.error('Error ending expired game:', error);
    }
  },

  // Join an existing game
  joinGame: async (gameCode) => {
    const db = getDbInstance();
    const gameRef = ref(db, `games/${gameCode}`);
    const snapshot = await get(gameRef);

    if (!snapshot.exists()) {
      throw new Error('Game not found');
    }

    const gameData = snapshot.val();
    
    // Validate game state
    if (gameData.status !== 'waiting') {
      throw new Error('Game has already started');
    }

    if (gameData.hostId === auth.currentUser.uid) {
      throw new Error('You cannot join your own game as a player');
    }

    const playersArray = Object.values(gameData.players || {});
    // Count only joining players (exclude the host)
    const joiningPlayersCount = playersArray.filter(player => !player.isHost).length;
    console.log('Joining players count:', joiningPlayersCount);
    console.log('Total players:', gameData.settings.totalPlayers);
    // Allowed joining players is totalPlayers - 1 (host is not counted)
    if (joiningPlayersCount >= gameData.settings.totalPlayers) {
      console.log('Game is full (excluding host).');
      throw new Error('Game is full');
    }

    if (gameData.players && gameData.players[auth.currentUser.uid]) {
      throw new Error('You are already in this game');
    }

    // Add player to the game
    const updates = {
      [`games/${gameCode}/players/${auth.currentUser.uid}`]: {
        id: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        isHost: false,
        joinedAt: new Date().toISOString(),
      }
    };

    await update(ref(db), updates);
    return gameData;
  },

  // Leave a game
  leaveGame: async (gameCode) => {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated');
    }

    const db = getDbInstance();
    
    try {
      // Get game data first
      const gameRef = ref(db, `games/${gameCode}`);
      const snapshot = await get(gameRef);
      
      if (!snapshot.exists()) {
        console.log('Game already removed');
        return;
      }

      const gameData = snapshot.val();
      const isHost = gameData.hostId === auth.currentUser.uid;

      if (isHost) {
        // If host is leaving, remove the entire game
        console.log('Host is leaving, removing game:', gameCode);
        await remove(gameRef);
      } else {
        // If player is leaving, just remove the player
        console.log('Player is leaving game:', gameCode);
        const playerRef = ref(db, `games/${gameCode}/players/${auth.currentUser.uid}`);
        await remove(playerRef);

        // Check if this was the last player
        const remainingPlayers = Object.keys(gameData.players || {}).filter(
          id => id !== auth.currentUser.uid
        );
        
        if (remainingPlayers.length === 0) {
          // If no players left, remove the game
          console.log('No players left, removing game:', gameCode);
          await remove(gameRef);
        }
      }
    } catch (error) {
      console.error('Error leaving game:', error);
      throw new Error('Failed to leave game: ' + error.message);
    }
  },

  // Listen to game updates
  subscribeToGame: (gameCode, callback) => {
    const db = getDbInstance();
    const gameRef = ref(db, `games/${gameCode}`);
    
    const unsubscribe = onValue(gameRef, async (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      const gameData = snapshot.val();
      
      // Check if game should be ended
      const isExpired = await gameService.checkGameExpiry(gameCode);
      if (isExpired && gameData.status !== 'ended') {
        await gameService.endExpiredGame(gameCode);
        gameData.status = 'ended';
        gameData.endReason = 'timeout';
      }

      callback(gameData);
    });

    return unsubscribe;
  },

  // Start the game
  startGame: async (gameCode) => {
    const db = getDbInstance();
    const gameRef = ref(db, `games/${gameCode}`);
    const snapshot = await get(gameRef);
    const gameData = snapshot.val();

    console.log('Attempting to start game with code:', gameCode);
    
    if (gameData.hostId !== auth.currentUser.uid) {
      throw new Error('Only the host can start the game');
    }

    // Filter out the host from players before assigning roles
    const playersArray = Object.values(gameData.players || {}).filter(player => !player.isHost);
    const playerCount = playersArray.length;
    
    console.log('Number of players (excluding host):', playerCount);
    console.log('Required players:', gameData.settings.totalPlayers - 1); // -1 for host

    // Check if we have enough players (excluding host)
    if (playerCount < gameData.settings.totalPlayers - 1) {
      throw new Error('Not enough players to start the game');
    }

    // Assign roles only to non-host players
    const roles = assignRoles(playerCount, gameData.settings);
    const playerUpdates = {};

    playersArray.forEach((player, index) => {
      playerUpdates[`games/${gameCode}/players/${player.id}/role`] = roles[index];
    });

    await update(ref(db), {
      ...playerUpdates,
      [`games/${gameCode}/status`]: 'started',
      [`games/${gameCode}/startedAt`]: new Date().toISOString(),
    });

    console.log('Game started successfully:', gameCode);
  },

  // Add this new method to get game data
  getGameData: async (gameCode) => {
    const db = getDbInstance();
    const gameRef = ref(db, `games/${gameCode}`);
    const snapshot = await get(gameRef);
    
    if (!snapshot.exists()) {
      throw new Error('Game not found');
    }
    
    return snapshot.val();
  },

  // Save game history
  saveGameHistory: async (gameCode, players, outcome) => {
    const db = getDbInstance();
    const gameRef = ref(db, `games/${gameCode}/history`);
    
    const historyEntry = {
      players,
      outcome,
      timestamp: new Date().toISOString(),
    };

    await update(gameRef, historyEntry);
  },

  // Get game history
  getGameHistory: async (gameCode) => {
    const db = getDbInstance();
    const gameRef = ref(db, `games/${gameCode}/history`);
    const snapshot = await get(gameRef);
    
    if (!snapshot.exists()) {
      throw new Error('No game history found');
    }
    
    return snapshot.val();
  },

  // Get all game history for current user
  getAllGameHistory: async () => {
    const db = getDbInstance();
    const gamesRef = ref(db, 'games');
    const snapshot = await get(gamesRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const allGames = snapshot.val();
    const userGames = Object.entries(allGames)
      .filter(([_, game]) => {
        // Check if user was a player or host in the game
        return game.hostId === auth.currentUser.uid || 
               (game.players && game.players[auth.currentUser.uid]);
      })
      .map(([gameCode, game]) => ({
        gameCode,
        hostName: game.hostName,
        players: game.players || {},
        status: game.status,
        startedAt: game.startedAt,
        createdAt: game.createdAt
      }))
      .sort((a, b) => {
        // Sort by createdAt in descending order (latest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    return userGames;
  },

  // Update the endGame function
  endGame: async (gameCode) => {
    try {
      const db = getDbInstance();
      const gameRef = ref(db, `games/${gameCode}`);
      
      // Get current game data
      const snapshot = await get(gameRef);
      if (!snapshot.exists()) {
        throw new Error('Game not found');
      }

      const gameData = snapshot.val();
      
      // Verify that the current user is the host
      if (gameData.hostId !== auth.currentUser.uid) {
        throw new Error('Only the host can end the game');
      }

      // Update game status to ended
      await update(gameRef, {
        status: 'ended',
        endedAt: new Date().toISOString(),
        endReason: 'host_ended'
      });

      // Update stats for all players
      const players = gameData.players || {};
      const updatePromises = Object.values(players).map(player => 
        userService.updateGameStats(gameData, player.role || 'civilian', true)
      );

      await Promise.all(updatePromises);
      return true;
    } catch (error) {
      console.error('Error ending game:', error);
      throw new Error('Failed to end game');
    }
  },

  updateGameStatus: async (gameCode, newStatus) => {
    const gameRef = ref(database, `games/${gameCode}`);
    await update(gameRef, { status: newStatus });
  },
  
  // Method to get game roles for the RoleAssignmentScreen
  getGameRoles: async (gameCode) => {
    try {
      const gameData = await gameService.getGameData(gameCode);
      if (!gameData || !gameData.players) {
        return [];
      }
      
      return Object.values(gameData.players)
        .filter(player => player.role) // Only include players with assigned roles
        .map(player => ({
          playerName: player.name,
          role: player.role,
          id: player.id
        }));
    } catch (error) {
      console.error('Error fetching game roles:', error);
      throw new Error('Failed to fetch role assignments');
    }
  },
};

// Helper function to assign roles
function assignRoles(playerCount, settings) {
  const roles = [];
  const { mafiaCount, detectiveCount, doctorCount } = settings;

  // Add mafia roles
  for (let i = 0; i < mafiaCount; i++) {
    roles.push('Mafia');
  }

  // Add detective roles
  for (let i = 0; i < detectiveCount; i++) {
    roles.push('Detective');
  }

  // Add doctor roles
  for (let i = 0; i < doctorCount; i++) {
    roles.push('Doctor');
  }

  // Fill remaining with civilians
  while (roles.length < playerCount) {
    roles.push('Civilian');
  }

  // Shuffle roles
  return roles.sort(() => Math.random() - 0.5);
}

// Add better error handling
try {
  // Your code
} catch (error) {
  // More specific error messages
  if (error.code === 'game/not-found') {
    throw new Error('Game not found. Please check the game code.');
  }
  // Log to analytics service
  logError(error);
}
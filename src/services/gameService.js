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

  // Check if a game exists
  checkGameExists: async (gameCode) => {
    const db = getDbInstance();
    const gameRef = ref(db, `games/${gameCode}`);
    const snapshot = await get(gameRef);
    return snapshot.exists();
  },

  // Get a player's role in the game
  getPlayerRole: async (gameCode, userId) => {
    if (!userId) userId = auth.currentUser.uid;
    
    const db = getDbInstance();
    const playerRef = ref(db, `games/${gameCode}/players/${userId}`);
    const snapshot = await get(playerRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    const playerData = snapshot.val();
    return playerData.role;
  },

  // Check if a user is the host of a game
  isGameHost: async (gameCode) => {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to check host status');
    }

    const db = getDbInstance();
    const userId = auth.currentUser.uid;
    const gameRef = ref(db, `games/${gameCode}`);
    
    try {
      const snapshot = await get(gameRef);
      if (!snapshot.exists()) {
        throw new Error('Game not found');
      }
      
      const gameData = snapshot.val();
      const player = gameData.players[userId];
      
      return player && player.isHost;
    } catch (error) {
      console.error('Error checking host status:', error);
      throw new Error('Failed to check host status');
    }
  },

  // Remove a player from a game (host only)
  removePlayerFromGame: async (gameCode, playerId) => {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to remove a player');
    }

    const db = getDbInstance();
    const hostId = auth.currentUser.uid;
    const gameRef = ref(db, `games/${gameCode}`);
    
    try {
      // Check if current user is the host
      const snapshot = await get(gameRef);
      if (!snapshot.exists()) {
        throw new Error('Game not found');
      }
      
      const gameData = snapshot.val();
      const hostPlayer = gameData.players[hostId];
      
      if (!hostPlayer || !hostPlayer.isHost) {
        throw new Error('Only the host can remove players');
      }

      // Check if the player to remove exists
      if (!gameData.players[playerId]) {
        throw new Error('Player not found in the game');
      }

      // Check if the game has already started
      if (gameData.status === 'started') {
        throw new Error('Cannot remove players after the game has started');
      }

      // Remove the player
      const playerRef = ref(db, `games/${gameCode}/players/${playerId}`);
      await remove(playerRef);
      
      // Update player count in game settings if needed
      return true;
    } catch (error) {
      console.error('Error removing player:', error);
      throw error;
    }
  },

  // Add these methods to support Game Control and Game Play screens
  
  // Update game phase
  updateGamePhase: async (gameCode, phase) => {
    try {
      const db = getDbInstance();
      
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }
      
      // Verify user is host
      const gameRef = ref(db, `games/${gameCode}`);
      const snapshot = await get(gameRef);
      
      if (!snapshot.exists()) {
        throw new Error('Game not found');
      }
      
      const gameData = snapshot.val();
      
      if (gameData.hostId !== auth.currentUser.uid) {
        throw new Error('Only the host can update game phase');
      }
      
      // Update game phase
      await update(gameRef, {
        currentPhase: phase,
        [`phaseHistory/${phase}`]: {
          startedAt: new Date().toISOString(),
          phase
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error updating game phase:', error);
      throw new Error('Failed to update game phase');
    }
  },
  
  // For Mafia to submit votes
  submitMafiaVote: async (gameCode, targetPlayerId) => {
    try {
      const db = getDbInstance();
      
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }
      
      // Verify user is in the game and is Mafia
      const playerRef = ref(db, `games/${gameCode}/players/${auth.currentUser.uid}`);
      const playerSnapshot = await get(playerRef);
      
      if (!playerSnapshot.exists()) {
        throw new Error('You are not in this game');
      }
      
      const playerData = playerSnapshot.val();
      
      if (playerData.role !== 'Mafia') {
        throw new Error('Only Mafia members can submit Mafia votes');
      }
      
      // Submit vote
      await update(ref(db), {
        [`games/${gameCode}/votes/mafia/${auth.currentUser.uid}`]: {
          targetId: targetPlayerId,
          votedAt: new Date().toISOString()
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error submitting Mafia vote:', error);
      throw new Error('Failed to submit vote');
    }
  },
  
  // For civilian to submit votes
  submitCivilianVote: async (gameCode, targetPlayerId) => {
    try {
      const db = getDbInstance();
      
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }
      
      // Verify user is in the game
      const playerRef = ref(db, `games/${gameCode}/players/${auth.currentUser.uid}`);
      const playerSnapshot = await get(playerRef);
      
      if (!playerSnapshot.exists()) {
        throw new Error('You are not in this game');
      }
      
      // Submit vote
      await update(ref(db), {
        [`games/${gameCode}/votes/civilian/${auth.currentUser.uid}`]: {
          targetId: targetPlayerId,
          votedAt: new Date().toISOString()
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error submitting civilian vote:', error);
      throw new Error('Failed to submit vote');
    }
  },
  
  // For detective to investigate a player
  investigatePlayer: async (gameCode, targetPlayerId) => {
    try {
      const db = getDbInstance();
      
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }
      
      // Verify user is in the game and is Detective
      const playerRef = ref(db, `games/${gameCode}/players/${auth.currentUser.uid}`);
      const playerSnapshot = await get(playerRef);
      
      if (!playerSnapshot.exists()) {
        throw new Error('You are not in this game');
      }
      
      const playerData = playerSnapshot.val();
      
      if (playerData.role !== 'Detective') {
        throw new Error('Only Detectives can investigate players');
      }
      
      // Get target player role
      const targetPlayerRef = ref(db, `games/${gameCode}/players/${targetPlayerId}`);
      const targetPlayerSnapshot = await get(targetPlayerRef);
      
      if (!targetPlayerSnapshot.exists()) {
        throw new Error('Target player not found');
      }
      
      const targetPlayerData = targetPlayerSnapshot.val();
      const isMafia = targetPlayerData.role === 'Mafia';
      
      // Record investigation
      await update(ref(db), {
        [`games/${gameCode}/investigations/${auth.currentUser.uid}/${targetPlayerId}`]: {
          isMafia,
          investigatedAt: new Date().toISOString()
        }
      });
      
      return isMafia;
    } catch (error) {
      console.error('Error investigating player:', error);
      throw new Error('Failed to investigate player');
    }
  },
  
  // For doctor to protect a player
  protectPlayer: async (gameCode, targetPlayerId) => {
    try {
      const db = getDbInstance();
      
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }
      
      // Verify user is in the game and is Doctor
      const playerRef = ref(db, `games/${gameCode}/players/${auth.currentUser.uid}`);
      const playerSnapshot = await get(playerRef);
      
      if (!playerSnapshot.exists()) {
        throw new Error('You are not in this game');
      }
      
      const playerData = playerSnapshot.val();
      
      if (playerData.role !== 'Doctor') {
        throw new Error('Only Doctors can protect players');
      }
      
      // Record protection
      await update(ref(db), {
        [`games/${gameCode}/protections/${auth.currentUser.uid}`]: {
          targetId: targetPlayerId,
          protectedAt: new Date().toISOString()
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error protecting player:', error);
      throw new Error('Failed to protect player');
    }
  },
  
  // For host to process night phase results
  processNightResults: async (gameCode) => {
    try {
      const db = getDbInstance();
      
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }
      
      // Verify user is host
      const gameRef = ref(db, `games/${gameCode}`);
      const snapshot = await get(gameRef);
      
      if (!snapshot.exists()) {
        throw new Error('Game not found');
      }
      
      const gameData = snapshot.val();
      
      if (gameData.hostId !== auth.currentUser.uid) {
        throw new Error('Only the host can process night results');
      }
      
      // Get mafia votes
      const mafiaVotes = gameData.votes?.mafia || {};
      const mafiaVotesArray = Object.values(mafiaVotes);
      
      // Count votes for each target
      const voteCounts = {};
      mafiaVotesArray.forEach(vote => {
        voteCounts[vote.targetId] = (voteCounts[vote.targetId] || 0) + 1;
      });
      
      // Find the target with the most votes
      let mostVotes = 0;
      let targetId = null;
      
      Object.keys(voteCounts).forEach(id => {
        if (voteCounts[id] > mostVotes) {
          mostVotes = voteCounts[id];
          targetId = id;
        }
      });
      
      // Check if target is protected by any doctor
      const protections = gameData.protections || {};
      const protectedPlayers = Object.values(protections).map(p => p.targetId);
      
      if (targetId && !protectedPlayers.includes(targetId)) {
        // Eliminate the player
        await update(ref(db), {
          [`games/${gameCode}/players/${targetId}/eliminated`]: true,
          [`games/${gameCode}/eliminatedPlayers/${targetId}`]: {
            eliminatedAt: new Date().toISOString(),
            reason: 'mafia'
          }
        });
        
        return { eliminated: true, targetId };
      }
      
      return { eliminated: false, targetId: null };
    } catch (error) {
      console.error('Error processing night results:', error);
      throw new Error('Failed to process night results');
    }
  },
  
  // For host to process day voting results
  processDayVotingResults: async (gameCode) => {
    try {
      const db = getDbInstance();
      
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }
      
      // Verify user is host
      const gameRef = ref(db, `games/${gameCode}`);
      const snapshot = await get(gameRef);
      
      if (!snapshot.exists()) {
        throw new Error('Game not found');
      }
      
      const gameData = snapshot.val();
      
      if (gameData.hostId !== auth.currentUser.uid) {
        throw new Error('Only the host can process voting results');
      }
      
      // Get civilian votes
      const civilianVotes = gameData.votes?.civilian || {};
      const civilianVotesArray = Object.values(civilianVotes);
      
      // Count votes for each target
      const voteCounts = {};
      civilianVotesArray.forEach(vote => {
        voteCounts[vote.targetId] = (voteCounts[vote.targetId] || 0) + 1;
      });
      
      // Find the target with the most votes
      let mostVotes = 0;
      let targetId = null;
      
      Object.keys(voteCounts).forEach(id => {
        if (voteCounts[id] > mostVotes) {
          mostVotes = voteCounts[id];
          targetId = id;
        }
      });
      
      if (targetId) {
        // Eliminate the player
        await update(ref(db), {
          [`games/${gameCode}/players/${targetId}/eliminated`]: true,
          [`games/${gameCode}/eliminatedPlayers/${targetId}`]: {
            eliminatedAt: new Date().toISOString(),
            reason: 'voting'
          }
        });
        
        return { eliminated: true, targetId };
      }
      
      return { eliminated: false, targetId: null };
    } catch (error) {
      console.error('Error processing voting results:', error);
      throw new Error('Failed to process voting results');
    }
  },
  
  // Check if game is over (Mafia wins or Civilians win)
  checkGameOutcome: async (gameCode) => {
    try {
      const db = getDbInstance();
      const gameRef = ref(db, `games/${gameCode}`);
      const snapshot = await get(gameRef);
      
      if (!snapshot.exists()) {
        throw new Error('Game not found');
      }
      
      const gameData = snapshot.val();
      const players = Object.values(gameData.players || {}).filter(player => !player.isHost);
      
      // Count alive players by role
      let aliveMafia = 0;
      let aliveCivilians = 0;
      
      players.forEach(player => {
        if (!player.eliminated) {
          if (player.role === 'Mafia') {
            aliveMafia++;
          } else {
            aliveCivilians++;
          }
        }
      });
      
      // Check win conditions
      if (aliveMafia === 0) {
        // Civilians win
        await update(gameRef, {
          outcome: {
            winner: 'civilians',
            endedAt: new Date().toISOString()
          }
        });
        return { isGameOver: true, winner: 'civilians' };
      } else if (aliveMafia >= aliveCivilians) {
        // Mafia wins
        await update(gameRef, {
          outcome: {
            winner: 'mafia',
            endedAt: new Date().toISOString()
          }
        });
        return { isGameOver: true, winner: 'mafia' };
      }
      
      // Game continues
      return { isGameOver: false };
    } catch (error) {
      console.error('Error checking game outcome:', error);
      throw new Error('Failed to check game outcome');
    }
  },

  // Get user's active game
  getUserActiveGame: async (userId) => {
    if (!userId) return null;
    
    try {
      const db = getDbInstance();
      // Get all games
      const gamesRef = ref(db, 'games');
      const snapshot = await get(gamesRef);
      
      if (!snapshot.exists()) {
        return null;
      }
      
      const games = snapshot.val();
      let activeGame = null;
      let latestTimestamp = 0;
      
      // Check each game to see if user is a player or host
      Object.entries(games).forEach(([gameCode, game]) => {
        // Skip ended games
        if (game.status === 'ended') return;
        
        // Check if user is in this game (either as host or player)
        const isInGame = game.players && game.players[userId];
        
        if (isInGame) {
          const gameTimestamp = new Date(game.createdAt).getTime();
          // Keep the most recent game
          if (gameTimestamp > latestTimestamp) {
            latestTimestamp = gameTimestamp;
            activeGame = {
              gameCode,
              status: game.status,
              isHost: game.hostId === userId,
              createdAt: game.createdAt
            };
          }
        }
      });
      
      return activeGame;
    } catch (error) {
      console.error('Error getting user active game:', error);
      return null;
    }
  },

  /**
   * Updates the list of inactive players in a game
   * @param {string} gameCode - The game code
   * @param {Array<string>} inactivePlayers - Array of player IDs who are inactive
   * @returns {Promise<void>}
   */
  updateInactivePlayers: async (gameCode, inactivePlayers) => {
    try {
      const db = getDbInstance();
      const gameRef = ref(db, `games/${gameCode}`);
      await update(gameRef, {
        inactivePlayers: inactivePlayers || []
      });
      return true;
    } catch (error) {
      console.error('Error updating inactive players:', error);
      throw error;
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
# Requirement Gathering Document for mafia-game-night Project

## Project Overview
mafia-game-night is a mobile application designed for playing a social deduction game, similar to Mafia or Werewolf. The application allows users to create and join game sessions, assign roles, and manage gameplay through a user-friendly interface. The app is built using React Native and Expo, leveraging Firebase for backend services such as authentication and real-time database management.

## Key Features

### User Authentication
- **Login and Registration**: Users can create an account or log in using their email and password.
- **Firebase Authentication**: Utilizes Firebase for secure user authentication, including persistence across sessions.

### Game Management
- **Create Game**: Users can create a new game session, which generates a unique game code.
- **Join Game**: Users can join an existing game by entering the game code.
- **Game Lobby**: Displays the current game state, including the list of players and game settings.

### Role Assignment
- **Random Role Assignment**: Once the game starts, roles (e.g., Mafia, Detective, Doctor, Civilian) are assigned randomly to players.
- **Display Assigned Roles**: After roles are assigned, players can view their assigned roles.

### Real-time Updates
- **Real-time Database**: Uses Firebase Realtime Database to manage game state and player actions.
- **Game State Management**: Updates the game state in real-time, allowing players to see changes immediately.

### User Interface
- **Responsive Design**: The app is designed to be responsive and user-friendly, with a focus on mobile usability.
- **Theming**: Customizable themes to enhance user experience.

## Technical Stack
- **Frontend**: 
  - React Native for building the mobile application. Javscripting(.js)
  - Expo for development and deployment.
  - React Navigation for managing navigation between screens.
  - React Native Elements for UI components.

- **Backend**:
  - Firebase for authentication and real-time database services.
  - Firebase Realtime Database for storing game data and player information.
  
  
- **Web Support**:  
  - Expo for Web: Allows the application to run in a web environment.
  - Webpack: Used for bundling the application for web deployment.

## Screens and Components
1. **LoginScreen**: 
   - Allows users to log in to their accounts.
   - Provides navigation to the registration screen.

2. **RegisterScreen**: 
   - Allows new users to create an account.

3. **HomeScreen**: 
   - Displays options to create or join a game.

4. **HostGameScreen**: 
   - Allows the host to configure game settings before starting the game.


5. **JoinGameScreen**: 
   - Allows users to enter a game code to join an existing game.
   - Input validation for game codes
   - Error handling for invalid/non-existent games
   - Automatic lobby redirection upon successful join

6. **GameLobbyScreen**: 
   - Displays the current game state, including player list and game settings.
   - Provides options for the host to start the game or for players to leave the lobby.

7. **RoleAssignmentScreen**: 
   - Displays the assigned roles to each player after the game starts.
   
8. **PlayerRoleScreen**:   
   - Displays the player's role and instructions.

9. **GameHistoryScreen**:   
   - Shows the history of past games and player performance.
	
    Game details storage:
	Players and roles
	Game duration
	Game outcome
	Host information
	Status updates
	Rejoin functionality for ongoing games
   
10. **SettingsScreen**:  
   - Allows users to adjust app settings.
   
11. **EditProfileScreen**:
   - Allows users to edit their profile information.
   
## Game Creation & Lobby System:
- Host game functionality with customizable settings:
  * Total players (6-15)
  * Mafia count (1-5)
  * Detective count (1-2)
  * Doctor role (optional)
- Generate unique 6-digit game codes
- Real-time lobby updates using subscription model
- Player join/leave functionality
- Host controls for starting/ending games

##  UI/UX Requirements:
- Consistent theme system with:
  * Color schemes (primary, secondary, accent colors)
  * Typography hierarchy
  * Spacing system
  * Card-based layout
- Gradient backgrounds
- Custom button components with:
  * Solid and outline variants
  * Loading states
  * Gradient backgrounds
- Bottom navigation with active states
- Modal dialogs for confirmations

## Security Requirements
	User Authentication
	Game Access Control
	Role-based Permissions
	Data Validation
	Secure Communication

## User Stories
1. As a user, I want to create a new game session so that I can play with my friends.
2. As a user, I want to join an existing game using a game code created from other hosts, so that I can participate in the game.
3. As a host, I want to start the game once all players have joined so that we can begin playing.
4. As a player, I want to see my assigned role after the game starts so that I know my objective.
5. As a user, I want to leave the game lobby if I change my mind about playing.

## Non-Functional Requirements
- **Performance**: The application should load quickly and respond to user actions without noticeable delays.
- **Scalability**: The backend should handle multiple concurrent users and game sessions without performance degradation.
- **Security**: User data must be protected, and authentication should be secure to prevent unauthorized access.

## Future Enhancements
- **Chat Feature**: Implement a chat system for players to communicate during the game.
- **Role Customization**: Allow users to create custom roles with specific abilities.
- **Statistics Tracking**: Track player performance and game statistics for future reference.

## Conclusion
mafia-game-nigh aims to provide an engaging and interactive experience for users who enjoy social deduction games. By leveraging modern technologies and a user-friendly design, the application seeks to create a fun environment for friends and family to connect and play together.

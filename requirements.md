# Requirements Document for Mafia Game Night

## Project Overview
Mafia Game Night is a feature-rich mobile application designed for playing the classic social deduction game, Mafia (or Werewolf). The application enables users to host or join games, participate in gameplay with different roles, and enjoy a fully guided gaming experience through an intuitive interface. Built with React Native and Expo, the app leverages Firebase for authentication and real-time database management, making it a modern multiplayer game platform.

## Key Features

### User Authentication & Profile Management
- **Login & Registration**: Users can create accounts or log in using email/password authentication
- **Profile Management**: Players can customize their display names and profile information
- **Session Persistence**: Authentication state is preserved across app sessions
- **Account Security**: Secure Firebase authentication with password reset functionality

### Game Creation & Hosting
- **Host Game**: Users can create a new game as a host with customizable settings:
  - Adjustable total player count (4-15 players)
  - Customizable role distribution (Mafia, Detective, Doctor, Civilian counts)
  - Random role assignment functionality
- **Game Code System**: Each game generates a unique 6-digit code for other players to join
- **Lobby Management**: Hosts can view joined players, manage game settings, and start or end the game
- **Game Controls**: Hosts have access to a dedicated GameControl screen to manage game phases and player eliminations

### Player Experience
- **Join Game**: Players can join existing games using 6-digit game codes
- **Role Assignment**: Players receive their role (Mafia, Detective, Doctor, or Civilian) with clear descriptions of abilities
- **Role-Based Gameplay**: Different interfaces and actions based on assigned roles
- **Player Elimination**: System to handle player eliminations during gameplay
- **Rejoin Functionality**: Players can rejoin active games if disconnected

### Game Flow & Mechanics
- **Game Phases**: Support for Day and Night phases with appropriate role-based actions
- **Voting System**: Players can vote to eliminate suspected Mafia members during day phases
- **Role Actions**: Special abilities for each role during appropriate phases
- **Game Resolution**: Determination of winning team based on eliminations
- **Game History**: Completed games are stored in history for future reference

### User Interface
- **Modern Design**: Clean, intuitive interface with animations and visual feedback
- **Responsive Layout**: Adapts to different screen sizes and orientations
- **Navigation System**: Custom bottom navigation with key game actions
- **Themed Components**: Consistent visual language through styled components
- **Visual Feedback**: Animations and transitions to enhance user experience

### Real-time Features
- **Live Updates**: Game state changes are reflected immediately for all players
- **Player Synchronization**: All players see consistent game state
- **Active Game Tracking**: Players can see and rejoin their active games from the home screen
- **Role Visibility**: Host can view all assigned roles, while players see only their own

## Technical Requirements

### Frontend
- **React Native**: Core framework for cross-platform mobile development
- **Expo**: Development and deployment platform
- **Navigation**: React Navigation for screen management
- **UI Components**: Custom components and React Native Elements
- **Styling**: Custom theming system with consistent visual language
- **Animation**: React Native Animated API for smooth transitions

### Backend
- **Firebase Authentication**: User management and security
- **Firebase Realtime Database**: Game state management and player data
- **Cloud Functions**: (Optional) Server-side logic for advanced features

### Cross-Platform Support
- **iOS & Android**: Full feature parity across mobile platforms
- **Web Support**: Responsive web version using Expo Web

## Game Features Detail

### Game Lobby
- Player list with host highlighted
- Game code display with copy functionality
- Live-updating player count
- Role distribution display
- Start game button (for host)
- Return to lobby option during games

### Role Assignment
- Clear role explanation with graphics
- Role-specific abilities and objectives
- Visual differentiation between roles (colors, icons)
- Host view of all player roles

### Game Control (Host)
- Phase management (Day/Night)
- Timer for each phase
- Player elimination tracking
- Game status management
- End game functionality

### Game Play (Players)
- Role-appropriate action interface
- Voting mechanism during day phase
- Special ability actions during night phase
- Player status indicators
- Game phase and status updates

### Game History
- List of past games
- Game details (date, players, outcome)
- Option to view past game details
- Rejoin functionality for active games

## Non-Functional Requirements
- **Performance**: Fast loading times and smooth transitions
- **Reliability**: Stable connection handling and error recovery
- **Scalability**: Support for concurrent games and users
- **Accessibility**: Clear text and intuitive controls
- **Security**: Protected user data and game integrity

## Future Enhancements
- **Custom Roles**: Allow hosts to create custom roles with unique abilities
- **In-Game Chat**: Text communication between players
- **Voice Integration**: Optional voice chat for remote gameplay
- **Advanced Statistics**: Detailed player performance tracking and analytics
- **Game Variations**: Support for different Mafia game rule variations
- **Friends System**: Add and invite friends to games directly
- **Tournaments**: Organized competition with multiple consecutive games

## User Stories
1. As a user, I want to create a new game session so that I can play with my friends.
2. As a user, I want to join an existing game using a game code created from other hosts, so that I can participate in the game.
3. As a host, I want to start the game once all players have joined so that we can begin playing.
4. As a player, I want to see my assigned role after the game starts so that I know my objective.
5. As a user, I want to leave the game lobby if I change my mind about playing.

## Conclusion
Mafia Game Night aims to provide an engaging and interactive experience for users who enjoy social deduction games. By leveraging modern technologies and a user-friendly design, the application seeks to create a fun environment for friends and family to connect and play together.

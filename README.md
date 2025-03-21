# Mafia Game Night

![Mafia Game Night Logo](assets/mafia-logo.png)

A modern cross-platform application for playing the classic social deduction game Mafia with friends. Built with React Native + Expo and Firebase, this app provides a seamless experience for hosting and participating in Mafia games.

## Features

### Core Functionality
- **Host Games**: Create custom game rooms with adjustable role distributions
- **Join Games**: Enter 6-digit game codes to join existing games
- **Role Assignment**: Automatic role distribution with special abilities
- **Game Flow Management**: Day/Night phase transitions with role-specific actions
- **Game History**: Track past games and results
- **Active Game Tracking**: Easily rejoin active games from home screen

### User Experience
- **Modern UI**: Clean, intuitive interface with visual feedback
- **Real-time Updates**: Synchronized game state across all players
- **Cross-platform**: Available on iOS, Android and Web
- **Offline Support**: Basic functionality available without internet
- **Authentication**: User accounts with profile customization

### Game Roles
- **Mafia**: Work together to eliminate civilians
- **Detective**: Investigate players to find the Mafia
- **Doctor**: Protect players from elimination
- **Civilian**: Vote to identify and eliminate Mafia members

## Screenshots

<div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
  <img src="screenshots/home-screen.png" width="200" alt="Home Screen">
  <img src="screenshots/lobby-screen.png" width="200" alt="Game Lobby">
  <img src="screenshots/role-screen.png" width="200" alt="Role Assignment">
  <img src="screenshots/gameplay-screen.png" width="200" alt="Gameplay">
</div>

## Navigation Structure

- **Home**: Main landing page with options to host or join games
- **Create Game**: Configure and host a new game
- **Join Game**: Enter a code to join an existing game
- **Game Lobby**: Wait for players and view game settings
- **Role Assignment**: View assigned roles with descriptions
- **Game Play**: Participate in day/night phases with role actions
- **Game Control**: (Host only) Manage game phases and player eliminations
- **Game History**: View past games and outcomes
- **Settings**: Configure app preferences and account settings

## Installation

### Prerequisites
- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Setup
1. Clone the repository:
```bash
git clone https://github.com/yourusername/mafia-game-night.git
cd mafia-game-night
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```
API_KEY=your_api_key
AUTH_DOMAIN=your_project.firebaseapp.com
DATABASE_URL=https://your_project.firebaseio.com
PROJECT_ID=your_project_id
STORAGE_BUCKET=your_project.appspot.com
MESSAGING_SENDER_ID=your_messaging_sender_id
APP_ID=your_app_id
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Follow the instructions in the terminal to open the app on your device or emulator.

## Usage Guide

### Hosting a Game
1. From the Home screen, tap "Host Game"
2. Configure game settings:
   - Set total player count (4-15)
   - Adjust role distribution (Mafia, Detective, Doctor)
   - At least one Civilian role is required
3. Tap "Create Game" to generate a unique game code
4. Share the code with players who want to join
5. When all players have joined, tap "Start Game"

### Joining a Game
1. From the Home screen, tap "Join Game"
2. Enter the 6-digit game code provided by the host
3. Tap "Join Game" to enter the game lobby
4. Wait for the host to start the game

### Playing the Game
1. When the game starts, you'll be assigned a role
2. Follow the on-screen instructions for your role
3. The game alternates between Day and Night phases:
   - **Day Phase**: All players discuss and vote to eliminate a suspected Mafia member
   - **Night Phase**: Special roles perform their actions (Mafia eliminates, Detective investigates, Doctor protects)
4. The game continues until either all Mafia members are eliminated (Civilians win) or Mafia members equal or outnumber Civilians (Mafia wins)

## Technology Stack

- **Frontend**: React Native, Expo, React Navigation
- **State Management**: React Context API
- **Backend**: Firebase (Authentication, Realtime Database)
- **UI Components**: Custom components with React Native Elements
- **Deployment**: Expo EAS, Firebase Hosting (web)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspiration from the classic Mafia/Werewolf party game
- All contributors who have helped shape this project
- The React Native and Expo community for their excellent documentation and support

---

Built with ❤️ by [TheFusionWorksLLC and Team]

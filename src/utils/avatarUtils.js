// Avatar utilities for handling avatar-related functionality

/**
 * Returns a random avatar image from the predefined set
 * @returns {Object} - A random avatar image that can be used in Image source
 */
export const getRandomAvatar = () => {
  const avatarOptions = [
    require('../../assets/avatars/avatar1.png'),
    require('../../assets/avatars/avatar2.png'),
    require('../../assets/avatars/avatar3.png'),
    require('../../assets/avatars/avatar4.png'),
    require('../../assets/avatars/avatar5.png'),
    require('../../assets/avatars/avatar6.png'),
    require('../../assets/avatars/avatar7.png'),
    require('../../assets/avatars/avatar8.png'),
    require('../../assets/avatars/avatar9.png'),
  ];
  
  // Get a random index to select an avatar
  const randomIndex = Math.floor(Math.random() * avatarOptions.length);
  return avatarOptions[randomIndex];
};

/**
 * Returns an avatar based on a user ID or other identifier
 * This ensures the same user always gets the same avatar
 * @param {string} identifier - User ID or other unique identifier
 * @returns {Object} - A deterministic avatar image
 */
export const getConsistentAvatar = (identifier) => {
  const avatarOptions = [
    require('../../assets/avatars/avatar1.png'),
    require('../../assets/avatars/avatar2.png'),
    require('../../assets/avatars/avatar3.png'),
    require('../../assets/avatars/avatar4.png'),
    require('../../assets/avatars/avatar5.png'),
    require('../../assets/avatars/avatar6.png'),
    require('../../assets/avatars/avatar7.png'),
    require('../../assets/avatars/avatar8.png'),
    require('../../assets/avatars/avatar9.png'),
  ];
  
  // Use the string to generate a consistent index
  if (!identifier) return avatarOptions[0];
  
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = ((hash << 5) - hash) + identifier.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Get absolute value and mod by length for a consistent index
  const index = Math.abs(hash) % avatarOptions.length;
  return avatarOptions[index];
}; 
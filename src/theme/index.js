import { colors, gradients } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const theme = {
  colors,
  gradients,
  typography,
  spacing,
  
  // Common styles that can be reused across screens
  commonStyles: {
    container: {
      flex: 1,
      borderRadius: 30,
      marginVertical: spacing.xl,
      
    },
    content: {
      flex: 1,
      padding: spacing.sm,
      justifyContent: 'center',
      
    },
    card: {
      backgroundColor: colors.card.background,
      borderRadius: 15,
      padding: spacing.md,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: spacing.xxxl,
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: spacing.lg,
    },
    buttonGradient: {
      borderRadius: 25,
      marginVertical: spacing.sm,
      elevation: 3,      
    },
    buttonContainer: {
      width: '100%',
    },
    buttonContent: {
      backgroundColor: 'transparent',
      paddingVertical: spacing.md,
    },
    buttonText: {
      color: colors.text.primary,
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.bold,
      letterSpacing: 1,
    },
    input: {
      color: colors.text.primary,
      fontSize: typography.sizes.md,
      paddingLeft: spacing.sm,
    },
    inputContainer: {
      marginBottom: spacing.md,
      paddingHorizontal: 0,
    },
  },
};

export default theme; 
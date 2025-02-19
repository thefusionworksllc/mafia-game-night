import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ImageBackground, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import LoadingSpinner from '../../components/LoadingSpinner';
import BottomNavigation from '../../components/BottomNavigation';

const StatCard = ({ title, value, icon }) => (
  <View style={styles.statCard}>
    <Icon name={icon} size={24} color={theme.colors.text.accent} />
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const GameStatsScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        console.log('User not authenticated');
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      console.log('Fetching stats for user ID:', user.uid); // Debug message

      try {
        const userStats = await userService.getUserStats();
        console.log('Fetched user stats:', userStats); // Debug message
        setStats(userStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <ImageBackground
        source={require('../../../assets/background.png')}
        style={theme.commonStyles.content}
        resizeMode="cover"
      >
        <LinearGradient
          colors={theme.gradients.background}
          style={theme.commonStyles.container}
        >
          <LoadingSpinner />
        </LinearGradient>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground
        source={require('../../../assets/background.png')}
        style={theme.commonStyles.content}
        resizeMode="cover"
      >
        <LinearGradient
          colors={theme.gradients.background}
          style={theme.commonStyles.container}
        >
          <Text style={styles.errorText}>{error}</Text>
        </LinearGradient>
      </ImageBackground>
    );
  }

  const winRate = stats?.gamesPlayed > 0
    ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1)
    : '0.0';

  return (
    <ImageBackground
      source={require('../../../assets/background.png')}
      style={theme.commonStyles.content}
      resizeMode="cover"
    >
      <LinearGradient
        colors={theme.gradients.background}
        style={theme.commonStyles.container}
      >
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Game Statistics</Text>
          
          <View style={styles.statsGrid}>
            <StatCard
              title="Games Played"
              value={stats?.gamesPlayed || 0}
              icon="games"
            />
          
            <StatCard
              title="Games as Civilian"
              value={stats?.roleStats?.civilian || 0}
              icon="person"
            />
            <StatCard
              title="Games as Mafia"
              value={stats?.roleStats?.mafia || 0}
              icon="person-outline"
            />
            <StatCard
              title="Games as Detective"
              value={stats?.roleStats?.detective || 0}
              icon="search"
            />
            <StatCard
              title="Games as Doctor"
              value={stats?.roleStats?.doctor || 0}
              icon="healing"
            />
            <StatCard
              title="Games Hosted"
              value={stats?.gamesHosted || 0}
              icon="grade"
            />
              <StatCard
              title="Games Won"
              value={stats?.gamesWon || 0}
              icon="emoji-events"
            />
            <StatCard
              title="Win Rate"
              value={`${winRate}%`}
              icon="trending-up"
            />
          </View>
        </ScrollView>
        
      </LinearGradient>
      <BottomNavigation navigation={navigation} activeScreen="Settings" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    paddingBottom: 80,
  },
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    textAlign: 'center',
    marginVertical: theme.spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  statCard: {
    width: '46%',
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    borderRadius: 15,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statTitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginVertical: theme.spacing.sm,
    textAlign: 'center',
  },
  statValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
  },
  errorText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});

export default GameStatsScreen; 
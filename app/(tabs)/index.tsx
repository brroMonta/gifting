// Home Screen / Dashboard
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LinearGradient } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { usePeople } from '../../src/hooks/usePeople';
import { useEvents } from '../../src/hooks/useEvents';
import { useGiftMaps } from '../../src/hooks/useGiftMaps';
import { useHistory } from '../../src/hooks/useHistory';
import { EventCard } from '../../src/components/events/EventCard';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/styles/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { people } = usePeople();
  const { upcomingEvents } = useEvents();
  const { giftMaps } = useGiftMaps();
  const { history } = useHistory();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <View style={styles.headerGradient}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.userName}>{user?.displayName || user?.email?.split('@')[0]}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{people.length}</Text>
            <Text style={styles.statLabel}>People</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{upcomingEvents.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{Object.keys(giftMaps).length}</Text>
            <Text style={styles.statLabel}>Gift Maps</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{history.length}</Text>
            <Text style={styles.statLabel}>History</Text>
          </View>
        </View>

        {/* Upcoming Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            {upcomingEvents.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/(tabs)/events' as any)}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            )}
          </View>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.slice(0, 3).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => router.push('/(tabs)/events' as any)}
              />
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyTitle}>No Upcoming Events</Text>
              <Text style={styles.emptyText}>
                Create events to track when you need gifts
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/people/add' as any)}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>➕</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Add Person</Text>
              <Text style={styles.actionDescription}>Add someone you buy gifts for</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/groups' as any)}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>👥</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Groups</Text>
              <Text style={styles.actionDescription}>Organize people into groups</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>🎉 All Core Features Complete!</Text>
          <Text style={styles.infoText}>
            ✅ People Management{'\n'}
            ✅ Gift Maps with Sharing{'\n'}
            ✅ Event Tracking{'\n'}
            ✅ Local Notifications{'\n'}
            ✅ Gift History{'\n'}
            ✅ Groups Organization{'\n\n'}
            Your gifting app is ready to use!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerGradient: {
    backgroundColor: theme.colors.primary[600],
    paddingBottom: theme.spacing['3xl'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.accent[500],
  },
  header: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: 64,
    paddingBottom: theme.spacing['2xl'],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    ...theme.typography.label,
    color: theme.colors.accent[400],
    marginBottom: theme.spacing.sm,
  },
  userName: {
    ...theme.typography.h1,
    color: theme.colors.text.inverse,
  },
  logoutButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.accent[500],
    borderRadius: theme.borderRadius.sm,
  },
  logoutText: {
    ...theme.typography.button,
    color: theme.colors.accent[400],
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing['2xl'],
    paddingTop: theme.spacing['3xl'],
    marginTop: -theme.spacing['2xl'],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing['3xl'],
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing['2xl'],
    alignItems: 'center',
    ...theme.shadows.md,
    borderTopWidth: 2,
    borderTopColor: theme.colors.accent[500],
  },
  statValue: {
    fontSize: 48,
    fontWeight: '300',
    color: theme.colors.primary[600],
    marginBottom: theme.spacing.xs,
    letterSpacing: 2,
  },
  statLabel: {
    ...theme.typography.label,
    color: theme.colors.text.secondary,
  },
  section: {
    marginBottom: theme.spacing['3xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.accent[500],
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
  },
  seeAllText: {
    ...theme.typography.button,
    color: theme.colors.accent[600],
  },
  emptyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing['3xl'],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  actionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent[500],
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.accent[200],
  },
  actionIconText: {
    fontSize: 32,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  actionDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
  },
  actionArrow: {
    fontSize: 24,
    color: theme.colors.accent[500],
    fontWeight: '300',
  },
  infoBox: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing['2xl'],
    borderWidth: 1,
    borderColor: theme.colors.accent[200],
  },
  infoTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  infoText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
});

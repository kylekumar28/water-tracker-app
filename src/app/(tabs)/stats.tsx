import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colours } from '@/constants/colours';
import { getDailySummary } from '@/services/dailySummary';
import { getDrinksForRange } from '@/services/drinks';
import { getDailyGoal } from '@/services/settings';
import { styles } from '@/styles/stats.styles';

type DayStat = {
  date: Date;
  totalMl: number;
  goalMl: number;
};

function getStartOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getThirtyDayRange() {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = getStartOfDay(end);
  start.setDate(start.getDate() - 29);

  return {
    start,
    end,
  };
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function StatsScreen() {
  const [days, setDays] = useState<DayStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);

      try {
        const { start, end } = getThirtyDayRange();

        const [drinks, currentGoal] = await Promise.all([
          getDrinksForRange(start, end),
          getDailyGoal(),
        ]);

        const stats: DayStat[] = [];

        for (let i = 0; i < 30; i++) {
          const date = new Date(start);
          date.setDate(start.getDate() + i);

          const dayStart = getStartOfDay(date);

          const dayEnd = new Date(dayStart);
          dayEnd.setDate(dayEnd.getDate() + 1);

          const totalMl = drinks
            .filter((drink) => {
              if (!drink.createdAt) {
                return false;
              }

              return drink.createdAt >= dayStart && drink.createdAt < dayEnd;
            })
            .reduce((sum, drink) => sum + drink.amount, 0);

          const summary = await getDailySummary(date);

          stats.push({
            date,
            totalMl,
            goalMl: summary?.goalMl ?? currentGoal,
          });
        }

        setDays(stats);
      } catch (error) {
        console.error('Could not load stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const trackedDays = useMemo(
    () => days.filter((day) => day.totalMl > 0),
    [days],
  );

  const totalMl = useMemo(
    () => trackedDays.reduce((sum, day) => sum + day.totalMl, 0),
    [trackedDays],
  );

  const averageMl =
    trackedDays.length > 0 ? Math.round(totalMl / trackedDays.length) : 0;

  const goalsReached = useMemo(
    () => trackedDays.filter((day) => day.totalMl >= day.goalMl).length,
    [trackedDays],
  );

  const hitRate =
    trackedDays.length > 0
      ? Math.round((goalsReached / trackedDays.length) * 100)
      : 0;

  const currentStreak = useMemo(() => {
    const today = new Date();

    let streak = 0;

    for (let i = days.length - 1; i >= 0; i--) {
      const day = days[i];

      const goalReached = day.totalMl > 0 && day.totalMl >= day.goalMl;

      if (goalReached) {
        streak += 1;
        continue;
      }

      if (isSameDay(day.date, today)) {
        continue;
      }

      break;
    }

    return streak;
  }, [days]);

  const bestStreak = useMemo(() => {
    let best = 0;
    let current = 0;

    for (const day of days) {
      const goalReached = day.totalMl > 0 && day.totalMl >= day.goalMl;

      if (goalReached) {
        current += 1;
        best = Math.max(best, current);
      } else if (day.totalMl > 0) {
        current = 0;
      } else {
        current = 0;
      }
    }

    return best;
  }, [days]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={[]}>
        <ActivityIndicator size='large' color={Colours.blue} />

        <Text style={styles.loadingText}>Loading statistics...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={[]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Stats</Text>

        <Text style={styles.subtitle}>Last 30 days</Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Average daily intake</Text>

          <Text style={styles.heroValue}>
            {(averageMl / 1000).toFixed(2)} L
          </Text>

          <Text style={styles.heroSubtext}>
            Based on {trackedDays.length} tracked days
          </Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Current streak</Text>

            <Text style={styles.statValue}>{currentStreak}</Text>

            <Text style={styles.statUnit}>days</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Best streak</Text>

            <Text style={styles.statValue}>{bestStreak}</Text>

            <Text style={styles.statUnit}>days</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Goal hit rate</Text>

            <Text style={styles.statValue}>{hitRate}%</Text>

            <Text style={styles.statUnit}>
              {goalsReached}/{trackedDays.length} days
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total intake</Text>

            <Text style={styles.statValue}>{(totalMl / 1000).toFixed(1)}</Text>

            <Text style={styles.statUnit}>litres</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

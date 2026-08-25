import { Text, View } from 'react-native';

import { styles } from '@/styles/weekly-overview.styles';

type DayStat = {
  date: Date;
  totalMl: number;
  goalMl: number;
};

type Props = {
  days: DayStat[];
  averageMl: number;
  goalsReached: number;
  streak: number;
};

export default function WeeklyOverview({
  days,
  averageMl,
  goalsReached,
  streak,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>This week</Text>

      <View style={styles.daysRow}>
        {days.map((day) => {
          const label = day.date
            .toLocaleDateString('en-GB', {
              weekday: 'short',
            })
            .toUpperCase();

          const goalReached = day.totalMl >= day.goalMl && day.totalMl > 0;

          return (
            <View key={day.date.toISOString()} style={styles.day}>
              <Text style={styles.dayLabel}>{label}</Text>

              <Text style={styles.dayAmount}>
                {day.totalMl > 0 ? `${(day.totalMl / 1000).toFixed(1)}` : '—'}
              </Text>

              <Text
                style={[
                  styles.dayStatus,
                  goalReached && styles.dayStatusReached,
                ]}
              >
                {goalReached ? '✓' : '·'}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.chart}>
        {days.map((day) => {
          const maxValue = Math.max(
            ...days.map((item) => Math.max(item.totalMl, item.goalMl), 1),
          );

          const barHeight = (day.totalMl / maxValue) * 100;
          const goalHeight = (day.goalMl / maxValue) * 100;

          return (
            <View key={day.date.toISOString()} style={styles.chartColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[styles.goalMarker, { bottom: `${goalHeight}%` }]}
                />
                <View style={[styles.barFill, { height: `${barHeight}%` }]} />
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Average</Text>

          <Text style={styles.statValue}>
            {(averageMl / 1000).toFixed(2)} L
          </Text>
        </View>

        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Goal hit</Text>

          <Text style={styles.statValue}>{goalsReached} days</Text>
        </View>

        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Streak</Text>

          <Text style={styles.statValue}>{streak} days</Text>
        </View>
      </View>
    </View>
  );
}

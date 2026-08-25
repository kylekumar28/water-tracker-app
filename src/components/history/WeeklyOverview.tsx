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
};

export default function WeeklyOverview({
  days,
  averageMl,
  goalsReached,
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

      <View style={styles.statsRow}>
        <View>
          <Text style={styles.statLabel}>Average</Text>

          <Text style={styles.statValue}>
            {(averageMl / 1000).toFixed(2)} L
          </Text>
        </View>

        <View style={styles.statRight}>
          <Text style={styles.statLabel}>Goal reached</Text>

          <Text style={styles.statValue}>{goalsReached} days</Text>
        </View>
      </View>
    </View>
  );
}

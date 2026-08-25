import { Text, View } from 'react-native';

import type { DayStat } from '@/app/(tabs)/stats';
import { styles } from '@/styles/consistency-grid.styles';

type Props = {
  days: DayStat[];
};

export default function ConsistencyGrid({ days }: Props) {
  const trackedDays = days.filter((day) => day.totalMl > 0);

  const goalsReached = trackedDays.filter(
    (day) => day.totalMl >= day.goalMl,
  ).length;

  const consistency =
    trackedDays.length > 0
      ? Math.round((goalsReached / trackedDays.length) * 100)
      : 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Goal consistency</Text>
          <Text style={styles.subtitle}>Last 30 days</Text>
        </View>

        <View style={styles.percentageContainer}>
          <Text style={styles.percentage}>{consistency}%</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {days.map((day) => {
          const tracked = day.totalMl > 0;
          const goalReached = tracked && day.totalMl >= day.goalMl;

          const progress =
            day.goalMl > 0 ? Math.min(day.totalMl / day.goalMl, 1) : 0;

          return (
            <View
              key={day.date.toISOString()}
              style={[
                styles.day,
                tracked && styles.dayTracked,
                progress >= 0.5 && styles.dayHalf,
                goalReached && styles.dayComplete,
              ]}
            />
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {goalsReached} of {trackedDays.length} tracked days completed
        </Text>

        <View style={styles.legend}>
          <Text style={styles.legendText}>Less</Text>

          <View style={[styles.legendSquare, styles.legendEmpty]} />
          <View style={[styles.legendSquare, styles.legendTracked]} />
          <View style={[styles.legendSquare, styles.legendHalf]} />
          <View style={[styles.legendSquare, styles.legendComplete]} />

          <Text style={styles.legendText}>Goal</Text>
        </View>
      </View>
    </View>
  );
}

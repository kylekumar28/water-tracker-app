import { Text, useWindowDimensions, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import type { DayStat } from '@/app/(tabs)/stats';
import { Colours } from '@/constants/colours';
import { styles } from '@/styles/hydration-trend-chart.styles';

type Props = {
  days: DayStat[];
};

interface PointerLabelItem {
  value?: number;
}

export default function HydrationTrendChart({ days }: Props) {
  const { width } = useWindowDimensions();

  const chartWidth = Math.max(width - 78, 260);

  const intakeData = days.map((day, index) => ({
    value: day.totalMl / 1000,

    label:
      index === 0
        ? '30d'
        : index === 7
          ? '21d'
          : index === 14
            ? '14d'
            : index === 21
              ? '7d'
              : index === days.length - 1
                ? 'Today'
                : '',

    dataPointText: '',
  }));

  const goalData = days.map((day) => ({
    value: day.goalMl / 1000,
  }));

  const highestValue = Math.max(
    ...days.map((day) => Math.max(day.totalMl, day.goalMl)),
    1000,
  );

  const maxValue = Math.ceil(highestValue / 1000) + 0.5;

  if (days.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>30-day trend</Text>

          <Text style={styles.subtitle}>Daily intake vs hydration goal</Text>
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={styles.intakeDot} />

            <Text style={styles.legendText}>Intake</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={styles.goalDot} />

            <Text style={styles.legendText}>Goal</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={intakeData}
          data2={goalData}
          width={chartWidth}
          height={220}
          maxValue={maxValue}
          noOfSections={4}
          color1={Colours.blue}
          color2={Colours.textSecondary}
          thickness1={3}
          thickness2={2}
          curved
          hideDataPoints={false}
          dataPointsColor1={Colours.blue}
          dataPointsRadius1={3}
          hideDataPoints2
          xAxisColor={Colours.border}
          yAxisColor='transparent'
          rulesColor={Colours.border}
          rulesType='solid'
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.xAxisText}
          yAxisLabelSuffix='L'
          yAxisLabelWidth={38}
          initialSpacing={4}
          endSpacing={8}
          spacing={chartWidth / Math.max(days.length - 1, 1)}
          pointerConfig={{
            pointerColor: Colours.blue,
            pointer2Color: Colours.textSecondary,
            radius: 5,

            pointerStripColor: Colours.textSecondary,
            pointerStripWidth: 1,

            pointerLabelWidth: 150,
            pointerLabelHeight: 92,

            activatePointersOnLongPress: true,

            pointerLabelComponent: (
              items: PointerLabelItem[],
              _secondaryItem: unknown,
              index: number,
            ) => {
              const day = days[index];

              if (!day) {
                return null;
              }

              const intake = items?.[0]?.value ?? 0;

              const goal = items?.[1]?.value ?? day.goalMl / 1000;

              const percentage =
                day.goalMl > 0
                  ? Math.round((day.totalMl / day.goalMl) * 100)
                  : 0;

              return (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipDate}>
                    {day.date.toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>

                  <Text style={styles.tooltipIntake}>
                    {Number(intake).toFixed(2)} L
                  </Text>

                  <Text style={styles.tooltipGoal}>
                    Goal {Number(goal).toFixed(2)} L
                  </Text>

                  <Text style={styles.tooltipPercentage}>
                    {percentage}% of goal
                  </Text>
                </View>
              );
            },
          }}
        />
      </View>
    </View>
  );
}

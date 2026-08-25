import { Pressable, Text, View } from 'react-native';

import { styles } from '@/styles/hydration-card.styles';

type Props = {
  consumed: number;
  dailyGoal: number;
  percentage: number;
  remaining: number;
  onEditGoal: () => void;
};

const HydrationCard = ({
  consumed,
  dailyGoal,
  percentage,
  remaining,
  onEditGoal,
}: Props) => {
  const formattedRemaining = remaining.toLocaleString('en-GB');

  return (
    <View style={styles.progressCard}>
      <Text style={styles.consumed}>{(consumed / 1000).toFixed(2)} L</Text>

      <Pressable
        onPress={onEditGoal}
        style={({ pressed }) => [
          styles.goalButton,
          pressed && styles.goalButtonPressed,
        ]}
      >
        <Text style={styles.goal}>of {(dailyGoal / 1000).toFixed(2)} L</Text>

        <Text style={styles.goalEdit}>Edit</Text>
      </Pressable>

      <Text style={styles.percentage}>{percentage}%</Text>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.remaining}>
        {remaining === 0
          ? 'Daily goal complete'
          : `${formattedRemaining} ml remaining`}
      </Text>
    </View>
  );
};

export default HydrationCard;

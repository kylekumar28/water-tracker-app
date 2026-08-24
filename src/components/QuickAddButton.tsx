import { styles } from '@/styles/index.styles';
import { Pressable, Text } from 'react-native';

type QuickAddButtonProps = {
  amount: number;
  onPress: () => void;
};

export function QuickAddButton({ amount, onPress }: QuickAddButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickAddButton,
        pressed && styles.quickAddButtonPressed,
      ]}
    >
      <Text style={styles.quickAddPlus}>+</Text>
      <Text style={styles.quickAddAmount}>{amount} ml</Text>
    </Pressable>
  );
}

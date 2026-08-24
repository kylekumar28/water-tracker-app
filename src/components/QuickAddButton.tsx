import { styles } from '@/styles/index.styles';
import { Pressable, Text } from 'react-native';

export function QuickAddButton({ amount }: { amount: number }) {
  return (
    <Pressable
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

import { Pressable, Text } from 'react-native';

import { styles } from '@/styles/index.styles';

type QuickAddButtonProps = {
  amount: number;
  onPress: () => void;
  disabled?: boolean;
};

export function QuickAddButton({
  amount,
  onPress,
  disabled = false,
}: QuickAddButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.quickAddButton,
        pressed && styles.quickAddButtonPressed,
        disabled && styles.quickAddButtonDisabled,
      ]}
    >
      <Text style={styles.quickAddPlus}>+</Text>
      <Text style={styles.quickAddAmount}>{amount} ml</Text>
    </Pressable>
  );
}

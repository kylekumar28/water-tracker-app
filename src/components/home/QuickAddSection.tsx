import { Pressable, Text, View } from 'react-native';

import type { Beverage } from '@/services/beverages';
import { styles } from '@/styles/quick-add.styles';
import { QuickAddButton } from '../QuickAddButton';

type Props = {
  waterBeverage?: Beverage;
  isAddingDrink: boolean;
  onAddDrink: (beverage: Beverage, amount: number) => void;
  onOpenAddDrink: () => void;
};

const QuickAddSection = ({
  waterBeverage,
  isAddingDrink,
  onAddDrink,
  onOpenAddDrink,
}: Props) => {
  return (
    <>
      <Text style={styles.sectionTitle}>Quick Add</Text>

      <View style={styles.quickAddRow}>
        <QuickAddButton
          amount={250}
          disabled={!waterBeverage || isAddingDrink}
          onPress={() => {
            if (waterBeverage) {
              onAddDrink(waterBeverage, 250);
            }
          }}
        />

        <QuickAddButton
          amount={500}
          disabled={!waterBeverage || isAddingDrink}
          onPress={() => {
            if (waterBeverage) {
              onAddDrink(waterBeverage, 500);
            }
          }}
        />
      </View>

      <Pressable
        onPress={onOpenAddDrink}
        style={({ pressed }) => [
          styles.addDrinkButton,
          pressed && styles.addDrinkButtonPressed,
        ]}
      >
        <Text style={styles.addDrinkButtonPlus}>+</Text>

        <Text style={styles.addDrinkButtonText}>Add drink</Text>
      </Pressable>
    </>
  );
};

export default QuickAddSection;

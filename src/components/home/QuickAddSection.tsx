import { Pressable, Text, View } from 'react-native';

import type { Beverage } from '@/services/beverages';
import { styles } from '@/styles/quick-add.styles';

type QuickAddFavourite = {
  beverage: Beverage;
  amount: number;
};

type Props = {
  favourites: QuickAddFavourite[];
  isAddingDrink: boolean;
  onAddDrink: (beverage: Beverage, amount: number) => void;
  onOpenAddDrink: () => void;
};

const QuickAddSection = ({
  favourites,
  isAddingDrink,
  onAddDrink,
  onOpenAddDrink,
}: Props) => {
  return (
    <>
      <Text style={styles.sectionTitle}>Quick Add</Text>

      <View style={styles.quickAddGrid}>
        {favourites.map(({ beverage, amount }) => (
          <Pressable
            key={`${beverage.id}-${amount}`}
            disabled={isAddingDrink}
            onPress={() => onAddDrink(beverage, amount)}
            style={({ pressed }) => [
              styles.quickAddFavourite,
              pressed && styles.quickAddFavouritePressed,
              isAddingDrink && styles.quickAddFavouriteDisabled,
            ]}
          >
            <Text style={styles.quickAddBeverage}>{beverage.name}</Text>

            <Text style={styles.quickAddAmount}>
              {amount >= 1000 ? `${amount / 1000} L` : `${amount} ml`}
            </Text>

            <Text style={styles.quickAddPlus}>+</Text>
          </Pressable>
        ))}
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

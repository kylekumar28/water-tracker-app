import { Pressable, Text, View } from 'react-native';

import { styles } from '@/styles/drink-history.styles';
import type { Drink } from '@/types/drinks';

type Props = {
  drinks: Drink[];
  onSelectDrink: (drink: Drink) => void;
};

const DrinkHistory = ({ drinks, onSelectDrink }: Props) => {
  if (drinks.length === 0)
    return (
      <View style={styles.emptyHistoryCard}>
        <Text style={styles.emptyHistoryTitle}>No drinks yet</Text>

        <Text style={styles.emptyHistoryText}>
          Add your first drink of the day.
        </Text>
      </View>
    );

  return (
    <View style={styles.historyCard}>
      {drinks.map((drink, index) => {
        const isLast = index === drinks.length - 1;

        return (
          <Pressable
            key={drink.id}
            onPress={() => onSelectDrink(drink)}
            style={({ pressed }) => [
              styles.historyRow,
              !isLast && styles.historyRowBorder,
              pressed && styles.historyRowPressed,
            ]}
          >
            <Text style={styles.historyTime}>{drink.time}</Text>

            <View style={styles.historyDrink}>
              <Text style={styles.historyName}>{drink.name}</Text>
            </View>

            <Text style={styles.historyAmount}>{drink.amount} ml</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default DrinkHistory;

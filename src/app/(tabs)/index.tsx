import { QuickAddButton } from '@/components/QuickAddButton';
import { styles } from '@/styles/index.styles';
import { ScrollView, Text, View } from 'react-native';

const DAILY_GOAL = 2700;
const consumed = 1750;

const percentage = Math.min(Math.round((consumed / DAILY_GOAL) * 100), 100);
const remaining = Math.max(DAILY_GOAL - consumed, 0);

const drinks = [
  {
    id: '1',
    time: '18:31',
    name: 'Water',
    amount: 500,
  },
  {
    id: '2',
    time: '15:42',
    name: 'Water',
    amount: 250,
  },
  {
    id: '3',
    time: '12:15',
    name: 'Water',
    amount: 500,
  },
  {
    id: '4',
    time: '09:20',
    name: 'Water',
    amount: 500,
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>Good evening</Text>

        <Text style={styles.sectionLabel}>Today's hydration</Text>

        <View style={styles.progressCard}>
          <Text style={styles.consumed}>{(consumed / 1000).toFixed(2)} L</Text>

          <Text style={styles.goal}>{(DAILY_GOAL / 1000).toFixed(2)} L</Text>

          <Text style={styles.percentage}>%</Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percentage}%` }]} />
          </View>

          <Text style={styles.remaining}>
            {remaining === 0
              ? 'Daily goal complete'
              : `${remaining} ml remaining`}
          </Text>
        </View>

        {/* Quick add */}
        <Text style={styles.sectionTitle}>Quick Add</Text>

        <View style={styles.quickAddRow}>
          <QuickAddButton amount={250} />
          <QuickAddButton amount={500} />
        </View>

        {/* Today's drinks */}
        <Text style={styles.sectionTitle}>Today's drinks</Text>

        <View style={styles.historyCard}>
          {drinks.map((drink, index) => {
            const isLast = index === drinks.length - 1;

            return (
              <View
                key={drink.id}
                style={[styles.historyRow, !isLast && styles.historyRowBorder]}
              >
                <Text style={styles.historyTime}>{drink.time}</Text>

                <View style={styles.historyDrink}>
                  <Text style={styles.historyName}>{drink.name}</Text>
                </View>

                <Text style={styles.historyAmount}>{drink.amount} ml</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

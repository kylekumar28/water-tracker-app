import { QuickAddButton } from '@/components/QuickAddButton';
import {
  addDrink as addDrinkToFirebase,
  getDrinks,
  removeDrink,
} from '@/services/drinks';
import { styles } from '@/styles/index.styles';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Drink = {
  id: string;
  time: string;
  name: string;
  amount: number;
};

const DAILY_GOAL = 2700;

export default function HomeScreen() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);

  const consumed = drinks.reduce((total, drink) => total + drink.amount, 0);

  const percentage = Math.min(Math.round((consumed / DAILY_GOAL) * 100), 100);

  const remaining = Math.max(DAILY_GOAL - consumed, 0);

  const today = new Date();

  const formattedDate = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const loadDrinks = async () => {
    try {
      const firebaseDrinks = await getDrinks();

      const formattedDrinks = firebaseDrinks.map((drink) => ({
        id: drink.id,
        name: drink.name,
        amount: drink.amount,
        time: drink.createdAt
          ? drink.createdAt.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '--:--',
      }));

      setDrinks(formattedDrinks);
    } catch (error) {
      console.error('Could not load drinks:', error);
    }
  };

  const handleAddDrink = async (amount: number) => {
    try {
      const id = await addDrinkToFirebase(amount);

      const now = new Date();

      const newDrink: Drink = {
        id,
        name: 'Water',
        amount,
        time: now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setDrinks((current) => [newDrink, ...current]);

      console.log('Drink created', id);
    } catch (error) {
      console.error('Could not add drink:', error);
    }
  };

  const deleteDrink = async (id: string) => {
    try {
      await removeDrink(id);

      setDrinks((current) => current.filter((drink) => drink.id !== id));

      setSelectedDrink(null);

      console.log('Drink successfully deleted:', id);
    } catch (error) {
      console.error('Could not delete drink:', error);
    }
  };

  useEffect(() => {
    loadDrinks();
  }, []);

  return (
    <SafeAreaView style={styles.screen} edges={[]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>{greeting}</Text>

        <Text style={styles.sectionLabel}>{formattedDate}</Text>

        <View style={styles.progressCard}>
          <Text style={styles.consumed}>{(consumed / 1000).toFixed(2)} L</Text>

          <Text style={styles.goal}>of {(DAILY_GOAL / 1000).toFixed(2)} L</Text>

          <Text style={styles.percentage}>{percentage}%</Text>

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
          <QuickAddButton amount={250} onPress={() => handleAddDrink(250)} />
          <QuickAddButton amount={500} onPress={() => handleAddDrink(500)} />
        </View>

        {/* Today's drinks */}
        <Text style={styles.sectionTitle}>Today's drinks</Text>

        {drinks.length === 0 ? (
          <View style={styles.emptyHistoryCard}>
            <Text style={styles.emptyHistoryTitle}>No drinks yet</Text>

            <Text style={styles.emptyHistoryText}>
              Add your first drink of the day.
            </Text>
          </View>
        ) : (
          <View style={styles.historyCard}>
            {drinks.map((drink, index) => {
              const isLast = index === drinks.length - 1;

              return (
                <Pressable
                  key={drink.id}
                  onPress={() => setSelectedDrink(drink)}
                  style={[
                    styles.historyRow,
                    !isLast && styles.historyRowBorder,
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
        )}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={selectedDrink !== null}
        transparent
        animationType='fade'
        onRequestClose={() => setSelectedDrink(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSelectedDrink(null)}
        >
          <Pressable style={styles.modalCard} onPress={() => {}}>
            {selectedDrink && (
              <>
                <Text style={styles.modalTitle}>{selectedDrink.name}</Text>
                <Text style={styles.modalAmount}>
                  {selectedDrink.amount} ml
                </Text>
                <Text style={styles.modalTime}>{selectedDrink.time}</Text>

                <Pressable
                  style={({ pressed }) => [
                    styles.modalDeleteButton,
                    pressed && styles.modalButtonPressed,
                  ]}
                  onPress={() => deleteDrink(selectedDrink.id)}
                >
                  <Text style={styles.modalDeleteText}>Delete drink</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.modalCancelButton,
                    pressed && styles.modalButtonPressed,
                  ]}
                  onPress={() => setSelectedDrink(null)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

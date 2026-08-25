/** biome-ignore-all lint/correctness/noUnusedImports: <yes bug> */
/** biome-ignore-all assist/source/organizeImports: <bug> */
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuickAddButton } from '@/components/QuickAddButton';
import { Colours } from '@/constants/colours';
import {
  addDrink as addDrinkToFirebase,
  getDrinks,
  removeDrink,
} from '@/services/drinks';
import { getDailyGoal, saveDailyGoal } from '@/services/settings';
import { styles } from '@/styles/index.styles';

type Drink = {
  id: string;
  time: string;
  name: string;
  amount: number;
};

export default function HomeScreen() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [dailyGoal, setDailyGoal] = useState(2700);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goalInput, setGoalInput] = useState(dailyGoal.toString());
  const [isAddingDrink, setIsAddingDrink] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const consumed = drinks.reduce((total, drink) => total + drink.amount, 0);

  const percentage = Math.min(Math.round((consumed / dailyGoal) * 100), 100);

  const remaining = Math.max(dailyGoal - consumed, 0);

  const formattedRemaining = remaining.toLocaleString('en-GB');

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

  const loadDailyGoal = async () => {
    try {
      const goal = await getDailyGoal();

      setDailyGoal(goal);

      console.log('Daily goal got:', goal);
    } catch (error) {
      console.error('Could not load daily goal:', error);
    }
  };

  const handleAddDrink = async (amount: number) => {
    if (isAddingDrink) return;

    setIsAddingDrink(true);

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

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      console.log('Drink created', id);
    } catch (error) {
      console.error('Could not add drink:', error);
    } finally {
      setIsAddingDrink(false);
    }
  };

  const deleteDrink = async (id: string) => {
    try {
      await removeDrink(id);

      setDrinks((current) => current.filter((drink) => drink.id !== id));

      setSelectedDrink(null);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      console.log('Drink successfully deleted:', id);
    } catch (error) {
      console.error('Could not delete drink:', error);
    }
  };

  const handleChangeGoal = async () => {
    const parsedGoal = Number(goalInput);

    if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) return;

    const roundedGoal = Math.round(parsedGoal);

    try {
      await saveDailyGoal(roundedGoal);

      setDailyGoal(roundedGoal);
      Keyboard.dismiss();
      setGoalModalVisible(false);

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      console.log('Daily goal updated:', roundedGoal);
    } catch (error) {
      console.error('Colud not update goal:', error);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <bug>
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([loadDrinks(), loadDailyGoal()]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <bug>
  useEffect(() => {
    loadDrinks();
    loadDailyGoal();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView>
        <ActivityIndicator size='large' color={Colours.blue} />

        <Text style={styles.loadingText}>Loading today's hydration...</Text>
      </SafeAreaView>
    );
  }

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

          <Pressable
            onPress={() => {
              setGoalInput(dailyGoal.toString());
              setGoalModalVisible(true);
            }}
            style={({ pressed }) => [
              styles.goalButton,
              pressed && styles.goalButtonPressed,
            ]}
          >
            <Text style={styles.goal}>
              of {(dailyGoal / 1000).toFixed(2)} L
            </Text>

            <Text style={styles.goalEdit}>Edit</Text>
          </Pressable>

          <Text style={styles.percentage}>{percentage}%</Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percentage}%` }]} />
          </View>

          <Text style={styles.remaining}>
            {remaining === 0
              ? 'Daily goal complete'
              : `${formattedRemaining} ml remaining`}
          </Text>
        </View>

        {/* Quick add */}
        <Text style={styles.sectionTitle}>Quick Add</Text>

        <View style={styles.quickAddRow}>
          <QuickAddButton
            amount={250}
            disabled={isAddingDrink}
            onPress={() => handleAddDrink(250)}
          />
          <QuickAddButton
            amount={500}
            disabled={isAddingDrink}
            onPress={() => handleAddDrink(500)}
          />
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
        )}
      </ScrollView>

      {/* Drink Modal */}
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

      {/* Goal modal */}
      <Modal
        visible={goalModalVisible}
        transparent
        animationType='fade'
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setGoalModalVisible(false)}
          >
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <Text style={styles.modalTitle}>Daily goal</Text>

              <Text style={styles.goalModalDescription}>
                How much water do you want to drink each day?
              </Text>

              <View style={styles.goalInputContainer}>
                <TextInput
                  value={goalInput}
                  onChangeText={setGoalInput}
                  keyboardType='number-pad'
                  placeholder='2700'
                  placeholderTextColor={Colours.textSecondary}
                  style={styles.goalInput}
                  selectTextOnFocus
                />

                <Text style={styles.goalInputUnit}>ml</Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.goalSaveButton,
                  pressed && styles.modalButtonPressed,
                ]}
                onPress={() => handleChangeGoal()}
              >
                <Text style={styles.goalSaveText}>Save goal</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.modalCancelButton,
                  pressed && styles.modalButtonPressed,
                ]}
                onPress={() => setGoalModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

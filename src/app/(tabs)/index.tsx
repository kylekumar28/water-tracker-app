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
  type Beverage,
  getBeverages,
  seedDefaultBeverages,
} from '@/services/beverages';
import {
  addDrink as addDrinkToFirebase,
  getDrinks,
  removeDrink,
} from '@/services/drinks';
import { getDailyGoal, saveDailyGoal } from '@/services/settings';
import { styles } from '@/styles/index.styles';

type Drink = {
  id: string;
  beverageId?: string;
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
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [addDrinkModalVisible, setAddDrinkModalVisible] = useState(false);
  const [selectedBeverage, setSelectedBeverage] = useState<Beverage | null>(
    null,
  );
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmountInput, setCustomAmountInput] = useState('');

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

  const waterBeverage = beverages.find((beverage) => beverage.id === 'water');

  const loadBeverages = async () => {
    try {
      await seedDefaultBeverages();

      const loadedBeverages = await getBeverages();

      setBeverages(loadedBeverages);
    } catch (error) {
      console.error('Could not load beverages:', error);
    }
  };

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

  const handleAddDrink = async (beverage: Beverage, amount: number) => {
    if (isAddingDrink) return;

    setIsAddingDrink(true);

    try {
      const id = await addDrinkToFirebase(beverage.id, beverage.name, amount);

      const now = new Date();

      const newDrink: Drink = {
        id,
        beverageId: beverage.id,
        name: beverage.name,
        amount,
        time: now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setDrinks((current) => [newDrink, ...current]);

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  const openAddDrinkModal = () => {
    const water =
      beverages.find((beverage) => beverage.id === 'water') ?? beverages[0];

    if (!water) return;

    setSelectedBeverage(water);
    setSelectedAmount(water.defaultAmountMl);
    setCustomAmountInput('');
    setAddDrinkModalVisible(true);
  };

  const handleSelectBeverage = (beverage: Beverage) => {
    setSelectedBeverage(beverage);
    setSelectedAmount(beverage.defaultAmountMl);
    setCustomAmountInput('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmountInput(value);

    const parsed = Number(value);

    if (Number.isFinite(parsed) && parsed > 0) {
      setSelectedAmount(Math.round(parsed));
    } else {
      setSelectedAmount(null);
    }
  };

  const handleConfirmAddDrink = async () => {
    if (!selectedBeverage || !selectedAmount) {
      return;
    }

    await handleAddDrink(selectedBeverage, selectedAmount);

    Keyboard.dismiss();
    setAddDrinkModalVisible(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <bug>
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([loadDrinks(), loadDailyGoal(), loadBeverages()]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (beverages.length > 0 && !selectedBeverage) {
      const water =
        beverages.find((beverage) => beverage.id === 'water') ?? beverages[0];

      setSelectedBeverage(water);
      setSelectedAmount(water.defaultAmountMl);
    }
  }, [beverages, selectedBeverage]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={[]}>
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
            onPress={() => {
              if (waterBeverage) handleAddDrink(waterBeverage, 250);
            }}
          />
          <QuickAddButton
            amount={500}
            disabled={isAddingDrink}
            onPress={() => {
              if (waterBeverage) handleAddDrink(waterBeverage, 500);
            }}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.addDrinkButton,
            pressed && styles.addDrinkButtonPressed,
          ]}
          onPress={openAddDrinkModal}
        >
          <Text style={styles.addDrinkButtonPlus}>+</Text>

          <Text style={styles.addDrinkButtonText}>Add drink</Text>
        </Pressable>

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

      {/* Add drink modal */}
      <Modal
        visible={addDrinkModalVisible}
        transparent
        animationType='fade'
        onRequestClose={() => setAddDrinkModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => {
              Keyboard.dismiss();
              setAddDrinkModalVisible(false);
            }}
          >
            <Pressable style={styles.addDrinkModalCard} onPress={() => {}}>
              <Text style={styles.modalTitle}>Add drink</Text>

              <Text style={styles.addDrinkSectionLabel}>Beverage</Text>

              <View style={styles.beverageOptions}>
                {beverages.map((beverage) => {
                  const selected = selectedBeverage?.id === beverage.id;

                  return (
                    <Pressable
                      key={beverage.id}
                      onPress={() => handleSelectBeverage(beverage)}
                      style={({ pressed }) => [
                        styles.beverageOption,
                        selected && styles.beverageOptionSelected,
                        pressed && styles.modalButtonPressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.beverageOptionText,
                          selected && styles.beverageOptionTextSelected,
                        ]}
                      >
                        {beverage.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {selectedBeverage && (
                <>
                  <Text style={styles.addDrinkSectionLabel}>Amount</Text>

                  <View style={styles.amountOptions}>
                    {selectedBeverage.presetAmountsMl.map((amount) => {
                      const selected =
                        selectedAmount === amount && customAmountInput === '';

                      return (
                        <Pressable
                          key={amount}
                          onPress={() => {
                            setSelectedAmount(amount);
                            setCustomAmountInput('');
                          }}
                          style={({ pressed }) => [
                            styles.amountOption,
                            selected && styles.amountOptionSelected,
                            pressed && styles.modalButtonPressed,
                          ]}
                        >
                          <Text
                            style={[
                              styles.amountOptionText,
                              selected && styles.amountOptionTextSelected,
                            ]}
                          >
                            {amount >= 1000
                              ? `${amount / 1000} L`
                              : `${amount} ml`}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Text style={styles.customAmountLabel}>Custom amount</Text>

                  <View style={styles.goalInputContainer}>
                    <TextInput
                      value={customAmountInput}
                      onChangeText={handleCustomAmountChange}
                      keyboardType='number-pad'
                      placeholder='Enter amount'
                      placeholderTextColor={Colours.textSecondary}
                      style={styles.goalInput}
                    />

                    <Text style={styles.goalInputUnit}>ml</Text>
                  </View>
                </>
              )}

              <Pressable
                disabled={!selectedBeverage || !selectedAmount || isAddingDrink}
                style={({ pressed }) => [
                  styles.goalSaveButton,
                  (!selectedBeverage || !selectedAmount || isAddingDrink) &&
                    styles.quickAddButtonDisabled,
                  pressed && styles.modalButtonPressed,
                ]}
                onPress={handleConfirmAddDrink}
              >
                <Text style={styles.goalSaveText}>Add drink</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.modalCancelButton,
                  pressed && styles.modalButtonPressed,
                ]}
                onPress={() => {
                  Keyboard.dismiss();
                  setAddDrinkModalVisible(false);
                }}
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

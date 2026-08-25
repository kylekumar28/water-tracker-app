/** biome-ignore-all lint/correctness/noUnusedImports: <yes bug> */
/** biome-ignore-all assist/source/organizeImports: <bug> */
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Keyboard, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DrinkHistory from '@/components/home/DrinkHistory';
import HomeHeader from '@/components/home/HomeHeader';
import HydrationCard from '@/components/home/HydrationCard';
import QuickAddSection from '@/components/home/QuickAddSection';
import AddDrinkModal from '@/components/modals/AddDrinkModal';
import DailyGoalModal from '@/components/modals/DailyGoalModal';
import DrinkDetailsModal from '@/components/modals/DrinkDetailsModal';
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
import { styles } from '@/styles/home.styles';

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
        <HomeHeader greeting={greeting} formattedDate={formattedDate} />

        {/* Hydration card */}
        <HydrationCard
          consumed={consumed}
          dailyGoal={dailyGoal}
          percentage={percentage}
          remaining={remaining}
          onEditGoal={() => {
            setGoalInput(dailyGoal.toString());
            setGoalModalVisible(true);
          }}
        />

        {/* Quick add section */}
        <QuickAddSection
          waterBeverage={waterBeverage}
          isAddingDrink={isAddingDrink}
          onAddDrink={handleAddDrink}
          onOpenAddDrink={openAddDrinkModal}
        />

        {/* Drink history */}
        <Text style={styles.sectionTitle}>Today's drinks</Text>

        <DrinkHistory drinks={drinks} onSelectDrink={setSelectedDrink} />
      </ScrollView>

      {/* Drink details modal */}
      <DrinkDetailsModal
        drink={selectedDrink}
        onClose={() => setSelectedDrink(null)}
        onDelete={deleteDrink}
      />

      {/* Daily goal modal */}
      <DailyGoalModal
        visible={goalModalVisible}
        goalInput={goalInput}
        onGoalInputChange={setGoalInput}
        onSave={handleChangeGoal}
        onClose={() => setGoalModalVisible(false)}
      />

      {/* Add drink modal */}
      <AddDrinkModal
        visible={addDrinkModalVisible}
        beverages={beverages}
        selectedBeverage={selectedBeverage}
        selectedAmount={selectedAmount}
        customAmount={customAmountInput}
        isAdding={isAddingDrink}
        onSelectBeverage={handleSelectBeverage}
        onSelectAmount={(amount) => {
          setSelectedAmount(amount);
          setCustomAmountInput('');
        }}
        onCustomAmountChange={handleCustomAmountChange}
        onConfirm={handleConfirmAddDrink}
        onClose={() => setAddDrinkModalVisible(false)}
      />
    </SafeAreaView>
  );
}

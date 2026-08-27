/** biome-ignore-all assist/source/organizeImports: <biome being annoying> */
import DrinkHistory from '@/components/home/DrinkHistory';
import HomeHeader from '@/components/home/HomeHeader';
import HydrationCard from '@/components/home/HydrationCard';
import QuickAddSection from '@/components/home/QuickAddSection';
import AddDrinkModal from '@/components/modals/AddDrinkModal';
import DailyGoalModal from '@/components/modals/DailyGoalModal';
import DrinkDetailsModal from '@/components/modals/DrinkDetailsModal';
import ManageBeveragesModal from '@/components/modals/ManageBeveragesModal';
import ManageQuickAddModal from '@/components/modals/ManageQuickAddModal';
import { Colours } from '@/constants/colours';
import { useHydrationData } from '@/hooks/useHydrationData';
import type { Beverage } from '@/services/beverages';
import type { QuickAddItem } from '@/services/quickAdd';
import { styles } from '@/styles/home.styles';
import type { Drink } from '@/types/drinks';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const {
    drinks,
    dailyGoal,
    beverages,
    enabledBeverages,
    quickAddItems,

    consumed,
    caffeineMg,
    percentage,
    remaining,
    quickAddFavourites,

    isLoading,
    isAddingDrink,

    addDrink,
    deleteDrink,
    updateDailyGoal,
    updateQuickAddItems,

    updateBeverage,
    addBeverage,

    refreshCurrentDay,
  } = useHydrationData();

  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goalInput, setGoalInput] = useState(dailyGoal.toString());
  const [addDrinkModalVisible, setAddDrinkModalVisible] = useState(false);
  const [selectedBeverage, setSelectedBeverage] = useState<Beverage | null>(
    null,
  );
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmountInput, setCustomAmountInput] = useState('');
  const [quickAddModalVisible, setQuickAddModalVisible] = useState(false);
  const [manageBeverageVisible, setManageBeverageVisible] = useState(false);

  const today = new Date();
  const hour = today.getHours();

  const formattedDate = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const handleChangeGoal = async () => {
    const parsedGoal = Number(goalInput);

    if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) {
      return;
    }

    const roundedGoal = Math.round(parsedGoal);

    try {
      await updateDailyGoal(roundedGoal);

      Keyboard.dismiss();
      setGoalModalVisible(false);
    } catch {}
  };

  const openAddDrinkModal = () => {
    const water =
      enabledBeverages.find((beverage) => beverage.id === 'water') ??
      enabledBeverages[0];

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

    await addDrink(selectedBeverage, selectedAmount);

    Keyboard.dismiss();
    setAddDrinkModalVisible(false);
  };

  const handleSaveQuickAdd = async (items: QuickAddItem[]) => {
    try {
      await updateQuickAddItems(items);
      setQuickAddModalVisible(false);
    } catch {}
  };

  const handleDeleteDrink = async (id: string) => {
    try {
      await deleteDrink(id);

      setSelectedDrink(null);
    } catch {}
  };

  useEffect(() => {
    if (enabledBeverages.length === 0) {
      setSelectedBeverage(null);
      setSelectedAmount(null);
      return;
    }

    const selectedStillEnahbled =
      selectedBeverage &&
      enabledBeverages.some((beverage) => beverage.id === selectedBeverage.id);

    if (!selectedStillEnahbled) {
      const water =
        enabledBeverages.find((beverage) => beverage.id === 'water') ??
        enabledBeverages[0];

      setSelectedBeverage(water);
      setSelectedAmount(water.defaultAmountMl);
    }
  }, [enabledBeverages, selectedBeverage]);

  useFocusEffect(
    useCallback(() => {
      refreshCurrentDay();
    }, [refreshCurrentDay]),
  );

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

        <View style={styles.caffeineCard}>
          <Text style={styles.caffeineLabel}>☕ Caffeine today</Text>

          <Text style={styles.caffeineValue}>{Math.round(caffeineMg)} mg</Text>
        </View>

        {/* Quick add section */}
        <QuickAddSection
          favourites={quickAddFavourites}
          isAddingDrink={isAddingDrink}
          onAddDrink={addDrink}
          onOpenAddDrink={openAddDrinkModal}
          onEditQuickAdd={() => setQuickAddModalVisible(true)}
        />

        {/* Drink history */}
        <Text style={styles.sectionTitle}>Today's drinks</Text>

        <DrinkHistory drinks={drinks} onSelectDrink={setSelectedDrink} />
      </ScrollView>

      {/* Drink details modal */}
      <DrinkDetailsModal
        drink={selectedDrink}
        onClose={() => setSelectedDrink(null)}
        onDelete={handleDeleteDrink}
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
        beverages={enabledBeverages}
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
        onManageBeverages={() => {
          setAddDrinkModalVisible(false);
          setManageBeverageVisible(true);
        }}
      />

      <ManageQuickAddModal
        visible={quickAddModalVisible}
        items={quickAddItems}
        beverages={beverages}
        onSave={handleSaveQuickAdd}
        onClose={() => setQuickAddModalVisible(false)}
      />

      <ManageBeveragesModal
        visible={manageBeverageVisible}
        beverages={beverages}
        onSave={updateBeverage}
        onAdd={addBeverage}
        onClose={() => setManageBeverageVisible(false)}
      />
    </SafeAreaView>
  );
}

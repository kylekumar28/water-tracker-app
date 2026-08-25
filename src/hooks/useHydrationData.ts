import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  type Beverage,
  createBeverage,
  getBeverages,
  saveBeverage,
  seedDefaultBeverages,
} from '@/services/beverages';
import {
  ensureDailySummary,
  updateDailySummaryGoal,
} from '@/services/dailySummary';
import {
  addDrink as addDrinkToFirebase,
  getDrinks,
  removeDrink,
} from '@/services/drinks';
import {
  getQuickAddItems,
  type QuickAddItem,
  saveQuickAddItems,
  seedDefaultQuickAdd,
} from '@/services/quickAdd';
import { getDailyGoal, saveDailyGoal } from '@/services/settings';
import type { Drink } from '@/types/drinks';

export type QuickAddFavourite = {
  beverage: Beverage;
  amount: number;
};

export function useHydrationData() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [dailyGoal, setDailyGoal] = useState(2700);
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [quickAddItems, setQuickAddItems] = useState<QuickAddItem[]>([]);

  const [isAddingDrink, setIsAddingDrink] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadDrinks = useCallback(async () => {
    try {
      const firebaseDrinks = await getDrinks();

      const formattedDrinks: Drink[] = firebaseDrinks.map((drink) => ({
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
  }, []);

  const loadDailyGoal = useCallback(async () => {
    try {
      const goal = await getDailyGoal();

      setDailyGoal(goal);

      await ensureDailySummary(new Date(), goal);
    } catch (error) {
      console.error('Could not load daily goal:', error);
    }
  }, []);

  const loadBeverages = useCallback(async () => {
    try {
      await seedDefaultBeverages();

      const loadedBeverages = await getBeverages();

      setBeverages(loadedBeverages);
    } catch (error) {
      console.error('Could not load beverages:', error);
    }
  }, []);

  const loadQuickAddItems = useCallback(async () => {
    try {
      await seedDefaultQuickAdd();

      const loadedItems = await getQuickAddItems();

      setQuickAddItems(loadedItems);
    } catch (error) {
      console.error('Could not load Quick Add items:', error);
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          loadDrinks(),
          loadDailyGoal(),
          loadBeverages(),
          loadQuickAddItems(),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [loadDrinks, loadDailyGoal, loadBeverages, loadQuickAddItems]);

  const addDrink = useCallback(
    async (beverage: Beverage, amount: number) => {
      if (isAddingDrink) {
        return;
      }

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
    },
    [isAddingDrink],
  );

  const deleteDrink = useCallback(async (id: string) => {
    try {
      await removeDrink(id);

      setDrinks((current) => current.filter((drink) => drink.id !== id));

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Could not delete drink:', error);

      throw error;
    }
  }, []);

  const updateDailyGoal = useCallback(async (goal: number) => {
    try {
      await saveDailyGoal(goal);

      await updateDailySummaryGoal(new Date(), goal);

      setDailyGoal(goal);

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Could not update goal:', error);

      throw error;
    }
  }, []);

  const updateQuickAddItems = useCallback(async (items: QuickAddItem[]) => {
    try {
      await saveQuickAddItems(items);

      setQuickAddItems(items);

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Could not save Quick Add items:', error);

      throw error;
    }
  }, []);

  const updateBeverage = useCallback(async (beverage: Beverage) => {
    try {
      await saveBeverage(beverage);

      setBeverages((current) =>
        current.map((item) => (item.id === beverage.id ? beverage : item)),
      );

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Could not update beverage:', error);

      throw error;
    }
  }, []);

  const addBeverage = useCallback(async (beverage: Beverage) => {
    try {
      await createBeverage(beverage);

      setBeverages((current) => [...current, beverage]);

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Could not create beverage:', error);

      throw error;
    }
  }, []);

  const consumed = useMemo(
    () => drinks.reduce((total, drink) => total + drink.amount, 0),
    [drinks],
  );

  const percentage =
    dailyGoal > 0 ? Math.min(Math.round((consumed / dailyGoal) * 100), 100) : 0;

  const remaining = Math.max(dailyGoal - consumed, 0);

  const quickAddFavourites = useMemo(
    () =>
      quickAddItems
        .map((item) => {
          const beverage = beverages.find(
            (beverage) => beverage.id === item.beverageId,
          );

          if (!beverage) {
            return null;
          }

          return {
            beverage,
            amount: item.amountMl,
          };
        })
        .filter((item): item is QuickAddFavourite => item !== null),
    [quickAddItems, beverages],
  );

  return {
    drinks,
    dailyGoal,
    beverages,
    quickAddItems,

    consumed,
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
  };
}

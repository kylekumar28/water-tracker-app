import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';

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
  saveHealthKitSampleIds,
} from '@/services/drinks';
import {
  deleteDrinkFromHealthKit,
  saveDrinkToHealthKit,
} from '@/services/healthKit';
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

function getDateKey(date = new Date()) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function useHydrationData() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [dailyGoal, setDailyGoal] = useState(2700);
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [quickAddItems, setQuickAddItems] = useState<QuickAddItem[]>([]);

  const [isAddingDrink, setIsAddingDrink] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentDateKeyRef = useRef(getDateKey());

  const loadDrinks = useCallback(async () => {
    try {
      const firebaseDrinks = await getDrinks();

      const formattedDrinks: Drink[] = firebaseDrinks.map((drink) => ({
        id: drink.id,
        beverageId: drink.beverageId,
        name: drink.name,
        amount: drink.amount,
        healthKitWaterSampleId: drink.healthKitWaterSampleId,
        healthKitCaffeineSampleId: drink.healthKitCaffeineSampleId,
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

      throw error;
    }
  }, []);

  const loadDailyGoal = useCallback(async () => {
    try {
      const goal = await getDailyGoal();

      setDailyGoal(goal);

      await ensureDailySummary(new Date(), goal);
    } catch (error) {
      console.error('Could not load daily goal:', error);

      throw error;
    }
  }, []);

  const refreshCurrentDay = useCallback(async () => {
    await Promise.all([loadDrinks(), loadDailyGoal()]);

    currentDateKeyRef.current = getDateKey();
  }, [loadDrinks, loadDailyGoal]);

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

  useEffect(() => {
    let midnightTimer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const scheduleMidnightRefresh = () => {
      if (cancelled) return;

      const now = new Date();
      const nextMidnight = new Date(now);

      nextMidnight.setHours(24, 0, 1, 0);

      const delay = nextMidnight.getTime() - now.getTime();

      midnightTimer = setTimeout(async () => {
        await refreshCurrentDay();

        if (!cancelled) scheduleMidnightRefresh();
      }, delay);
    };

    scheduleMidnightRefresh();

    return () => {
      cancelled = true;
      clearTimeout(midnightTimer);
    };
  }, [refreshCurrentDay]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState) => {
        if (nextAppState !== 'active') {
          return;
        }

        const newDateKey = getDateKey();

        if (newDateKey !== currentDateKeyRef.current) {
          await refreshCurrentDay();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [refreshCurrentDay]);

  const addDrink = useCallback(
    async (beverage: Beverage, amount: number) => {
      if (isAddingDrink) {
        return;
      }

      setIsAddingDrink(true);

      try {
        const id = await addDrinkToFirebase(beverage.id, beverage.name, amount);

        let healthKitWaterSampleId: string | undefined;

        let healthKitCaffeineSampleId: string | undefined;

        try {
          const caffeineMg = beverage.caffeineMgPer100Ml
            ? (amount / 100) * beverage.caffeineMgPer100Ml
            : 0;

          const healthKitSamples = await saveDrinkToHealthKit(
            amount,
            caffeineMg,
          );

          healthKitWaterSampleId = healthKitSamples.waterSampleId;

          healthKitCaffeineSampleId = healthKitSamples.caffeineSampleId;

          await saveHealthKitSampleIds(
            id,
            healthKitWaterSampleId,
            healthKitCaffeineSampleId,
          );
        } catch (healthKitError) {
          console.error(
            'Could not sync drink to apple health:',
            healthKitError,
          );
        }

        const now = new Date();

        const newDrink: Drink = {
          id,
          beverageId: beverage.id,
          name: beverage.name,
          amount,
          healthKitWaterSampleId,
          healthKitCaffeineSampleId,
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

  const deleteDrink = useCallback(
    async (id: string) => {
      try {
        const drink = drinks.find((item) => item.id === id);

        if (drink) {
          await deleteDrinkFromHealthKit(
            drink.healthKitWaterSampleId,
            drink.healthKitCaffeineSampleId,
          );
        }

        await removeDrink(id);

        setDrinks((current) => current.filter((drink) => drink.id !== id));

        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
      } catch (error) {
        console.error('Could not delete drink:', error);

        throw error;
      }
    },
    [drinks],
  );

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

  const caffeineMg = useMemo(() => {
    return drinks.reduce((total, drink) => {
      if (!drink.beverageId) {
        return total;
      }

      const beverage = beverages.find((item) => item.id === drink.beverageId);

      if (!beverage?.caffeineMgPer100Ml) {
        return total;
      }

      return total + (drink.amount / 100) * beverage.caffeineMgPer100Ml;
    }, 0);
  }, [drinks, beverages]);

  const percentage =
    dailyGoal > 0 ? Math.min(Math.round((consumed / dailyGoal) * 100), 100) : 0;

  const remaining = Math.max(dailyGoal - consumed, 0);

  const enabledBeverages = useMemo(
    () => beverages.filter((beverage) => beverage.enabled),
    [beverages],
  );

  const quickAddFavourites = useMemo(
    () =>
      quickAddItems
        .map((item) => {
          const beverage = enabledBeverages.find(
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
    [quickAddItems, enabledBeverages],
  );

  return {
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
  };
}

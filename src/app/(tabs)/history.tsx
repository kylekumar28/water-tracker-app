import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colours } from '@/constants/colours';
import { ensureDailySummary, getDailySummary } from '@/services/dailySummary';
import { getDrinksForDate } from '@/services/drinks';
import { getDailyGoal } from '@/services/settings';
import { styles } from '@/styles/history.styles';

type HistoryDrink = {
  id: string;
  name: string;
  amount: number;
  time: string;
};

export default function HistoryScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [drinks, setDrinks] = useState<HistoryDrink[]>([]);
  const [dailyGoal, setDailyGoal] = useState(2700);
  const [isLoading, setIsLoading] = useState(true);

  const total = useMemo(
    () => drinks.reduce((sum, drink) => sum + drink.amount, 0),
    [drinks],
  );

  const percentage =
    dailyGoal > 0 ? Math.min(Math.round((total / dailyGoal) * 100), 100) : 0;

  const remaining = Math.max(dailyGoal - total, 0);

  const overGoal = Math.max(total - dailyGoal, 0);

  const formattedDate = selectedDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const isToday = () => {
    const today = new Date();

    return (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate()
    );
  };

  const changeDate = (offset: number) => {
    const newDate = new Date(selectedDate);

    newDate.setDate(newDate.getDate() + offset);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (newDate > today) {
      return;
    }

    setSelectedDate(newDate);
  };

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);

      try {
        const currentGoal = await getDailyGoal();

        let summary = await getDailySummary(selectedDate);

        if (!summary) {
          summary = await ensureDailySummary(selectedDate, currentGoal);
        }

        const firebaseDrinks = await getDrinksForDate(selectedDate);

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
        setDailyGoal(summary.goalMl);
      } catch (error) {
        console.error('Could not load history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.screen} edges={[]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>History</Text>

        <View style={styles.dateNavigation}>
          <Pressable
            onPress={() => changeDate(-1)}
            style={({ pressed }) => [
              styles.dateButton,
              pressed && styles.dateButtonPressed,
            ]}
          >
            <Text style={styles.dateButtonText}>‹</Text>
          </Pressable>

          <Text style={styles.dateText}>{formattedDate}</Text>

          <Pressable
            disabled={isToday()}
            onPress={() => changeDate(1)}
            style={({ pressed }) => [
              styles.dateButton,
              isToday() && styles.dateButtonDisabled,
              pressed && !isToday() && styles.dateButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.dateButtonText,
                isToday() && styles.dateButtonTextDisabled,
              ]}
            >
              ›
            </Text>
          </Pressable>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color={Colours.blue} />

            <Text style={styles.loadingText}>Loading hydration...</Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total consumed</Text>

              <Text style={styles.summaryTotal}>
                {(total / 1000).toFixed(2)} L
              </Text>

              <Text style={styles.summaryGoal}>
                of {(dailyGoal / 1000).toFixed(2)} L
              </Text>

              <Text style={styles.summaryPercentage}>{percentage}%</Text>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${percentage}%`,
                    },
                  ]}
                />
              </View>

              <Text style={styles.summaryStatus}>
                {total >= dailyGoal
                  ? overGoal > 0
                    ? `${overGoal.toLocaleString('en-GB')} ml over goal`
                    : 'Daily goal complete'
                  : `${remaining.toLocaleString('en-GB')} ml remaining`}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Drinks</Text>

            {drinks.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No drinks recorded</Text>

                <Text style={styles.emptyText}>
                  Nothing was logged on this day.
                </Text>
              </View>
            ) : (
              <View style={styles.historyCard}>
                {drinks.map((drink, index) => {
                  const isLast = index === drinks.length - 1;

                  return (
                    <View
                      key={drink.id}
                      style={[
                        styles.historyRow,
                        !isLast && styles.historyRowBorder,
                      ]}
                    >
                      <Text style={styles.historyTime}>{drink.time}</Text>

                      <Text style={styles.historyName}>{drink.name}</Text>

                      <Text style={styles.historyAmount}>
                        {drink.amount} ml
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

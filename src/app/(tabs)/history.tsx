import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import WeeklyOverview from '@/components/history/WeeklyOverview';
import { Colours } from '@/constants/colours';
import { ensureDailySummary, getDailySummary } from '@/services/dailySummary';
import { getDrinksForDate, getDrinksForRange } from '@/services/drinks';
import { getDailyGoal } from '@/services/settings';
import { styles } from '@/styles/history.styles';

type DayStat = {
  date: Date;
  totalMl: number;
  goalMl: number;
};

type HistoryDrink = {
  id: string;
  name: string;
  amount: number;
  time: string;
};

const getWeekRange = (date: Date) => {
  const start = new Date(date);

  const day = start.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  start.setDate(start.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return {
    start,
    end,
  };
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function HistoryScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [drinks, setDrinks] = useState<HistoryDrink[]>([]);
  const [dailyGoal, setDailyGoal] = useState(2700);
  const [isLoading, setIsLoading] = useState(true);
  const [weekStats, setWeekStats] = useState<DayStat[]>([]);

  const total = useMemo(
    () => drinks.reduce((sum, drink) => sum + drink.amount, 0),
    [drinks],
  );

  const percentage =
    dailyGoal > 0 ? Math.min(Math.round((total / dailyGoal) * 100), 100) : 0;

  const progressPercentage = Math.min(percentage, 100);

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

  const daysWithData = weekStats.filter((day) => day.totalMl > 0);

  const weeklyTotal = weekStats.reduce((sum, day) => sum + day.totalMl, 0);

  const weeklyAverage =
    daysWithData.length > 0 ? Math.round(weeklyTotal / daysWithData.length) : 0;

  const goalsReached = weekStats.filter(
    (day) => day.totalMl >= day.goalMl && day.totalMl > 0,
  ).length;

  const currentWeekStreak = useMemo(() => {
    if (weekStats.length === 0) return 0;

    const today = new Date();

    const relevantDays = weekStats.filter((day) => {
      const dayDate = new Date(day.date);

      dayDate.setHours(0, 0, 0, 0);

      const todayDate = new Date(today);

      todayDate.setHours(0, 0, 0, 0);

      return dayDate <= todayDate;
    });

    let streak = 0;

    for (let i = relevantDays.length - 1; i >= 0; i--) {
      const day = relevantDays[i];

      const goalReached = day.totalMl > 0 && day.totalMl >= day.goalMl;

      if (goalReached) {
        streak += 1;
        continue;
      }

      if (isSameDay(day.date, today)) {
        continue;
      }

      break;
    }

    return streak;
  }, [weekStats]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <i cant fix this>
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);

      try {
        const [currentGoal, firebaseDrinks] = await Promise.all([
          getDailyGoal(),
          getDrinksForDate(selectedDate),
        ]);

        let summary = await getDailySummary(selectedDate);

        if (!summary && isToday()) {
          summary = await ensureDailySummary(selectedDate, currentGoal);
        }

        const goalForDay = summary?.goalMl ?? currentGoal;

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
        setDailyGoal(goalForDay);
      } catch (error) {
        console.error('Could not load history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadWeekStats = async () => {
      try {
        const { start, end } = getWeekRange(selectedDate);

        // const weeklyDrinks = await getDrinksForRange(start, end);

        const [weeklyDrinks, currentGoal] = await Promise.all([
          getDrinksForRange(start, end),
          getDailyGoal(),
        ]);

        const days: DayStat[] = [];

        for (let i = 0; i < 7; i++) {
          const date = new Date(start);

          date.setDate(start.getDate() + i);

          const dayStart = new Date(date);
          dayStart.setHours(0, 0, 0, 0);

          const dayEnd = new Date(dayStart);
          dayEnd.setDate(dayEnd.getDate() + 1);

          const totalMl = weeklyDrinks
            .filter((drink) => {
              if (!drink.createdAt) return false;

              return drink.createdAt >= dayStart && drink.createdAt < dayEnd;
            })
            .reduce((sum, drink) => sum + drink.amount, 0);

          const summary = await getDailySummary(date);

          days.push({
            date,
            totalMl,
            goalMl: summary?.goalMl ?? currentGoal,
          });
        }

        setWeekStats(days);
      } catch (error) {
        console.error('Could not load weekly stats:', error);
      }
    };

    loadHistory();
    loadWeekStats();
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

        <WeeklyOverview
          days={weekStats}
          averageMl={weeklyAverage}
          goalsReached={goalsReached}
          streak={currentWeekStreak}
        />

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
                      width: `${progressPercentage}%`,
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

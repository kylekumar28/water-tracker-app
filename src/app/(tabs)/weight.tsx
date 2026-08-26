/** biome-ignore-all assist/source/organizeImports: <biome being annoying about organising imports> */
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
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

import { Colours } from '@/constants/colours';
import { updateDailySummaryGoal } from '@/services/dailySummary';
import { getDailyGoal, saveDailyGoal } from '@/services/settings';
import {
  addWeightEntry,
  getWeightEntries,
  type WeightEntry,
} from '@/services/weight';
import { styles } from '@/styles/weight.styles';
import { calculateSuggestedGoalMl } from '@/utils/hydration';

export default function WeightScreen() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [dailyGoal, setDailyGoal] = useState(2700);

  const [isLoading, setIsLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [weightInput, setWeightInput] = useState('');

  const latestWeight = entries[0];

  const suggestedGoal = useMemo(() => {
    if (!latestWeight) {
      return null;
    }

    return calculateSuggestedGoalMl(latestWeight.weightKg);
  }, [latestWeight]);

  const loadWeightData = async () => {
    try {
      const [weightEntries, goal] = await Promise.all([
        getWeightEntries(),
        getDailyGoal(),
      ]);

      setEntries(weightEntries);
      setDailyGoal(goal);
    } catch (error) {
      console.error('Could not load weight data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <biome being annoying>
  useEffect(() => {
    loadWeightData();
  }, []);

  const handleSaveWeight = async () => {
    const parsedWeight = Number(weightInput);

    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
      return;
    }

    try {
      const id = await addWeightEntry(parsedWeight);

      const now = new Date();

      const newEntry: WeightEntry = {
        id,
        weightKg: parsedWeight,
        createdAt: now,
      };

      setEntries((current) => [newEntry, ...current]);

      Keyboard.dismiss();
      setWeightInput('');
      setModalVisible(false);

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Could not save weight:', error);
    }
  };

  const handleUseSuggestedGoal = async () => {
    if (!suggestedGoal) {
      return;
    }

    try {
      await saveDailyGoal(suggestedGoal);

      await updateDailySummaryGoal(new Date(), suggestedGoal);

      setDailyGoal(suggestedGoal);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Could not update hydration goal:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={[]}>
        <ActivityIndicator size='large' color={Colours.blue} />

        <Text style={styles.loadingText}>Loading weight...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={[]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Weight</Text>

        <Text style={styles.subtitle}>
          Track your weight and hydration target
        </Text>

        <View style={styles.weightCard}>
          <Text style={styles.cardLabel}>Current weight</Text>

          {latestWeight ? (
            <>
              <Text style={styles.weightValue}>
                {latestWeight.weightKg.toFixed(1)}
                <Text style={styles.weightUnit}> kg</Text>
              </Text>

              <Text style={styles.updatedText}>
                {latestWeight.createdAt
                  ? `Updated ${latestWeight.createdAt.toLocaleDateString(
                      'en-GB',
                      {
                        day: 'numeric',
                        month: 'long',
                      },
                    )}`
                  : 'Recently updated'}
              </Text>
            </>
          ) : (
            <Text style={styles.noWeightText}>No weight logged yet</Text>
          )}

          <Pressable
            onPress={() => {
              setWeightInput(
                latestWeight ? latestWeight.weightKg.toString() : '',
              );

              setModalVisible(true);
            }}
            style={({ pressed }) => [
              styles.logWeightButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.logWeightButtonText}>
              {latestWeight ? 'Log new weight' : 'Log weight'}
            </Text>
          </Pressable>
        </View>

        {latestWeight && suggestedGoal && (
          <View style={styles.hydrationCard}>
            <Text style={styles.sectionTitle}>Suggested hydration</Text>

            <Text style={styles.suggestedValue}>
              {(suggestedGoal / 1000).toFixed(2)} L
            </Text>

            <Text style={styles.suggestedExplanation}>
              Based on {latestWeight.weightKg.toFixed(1)} kg at approximately 30
              ml per kg
            </Text>

            <View style={styles.goalComparison}>
              <View>
                <Text style={styles.comparisonLabel}>Current goal</Text>

                <Text style={styles.comparisonValue}>
                  {(dailyGoal / 1000).toFixed(2)} L
                </Text>
              </View>

              <View style={styles.comparisonRight}>
                <Text style={styles.comparisonLabel}>Suggested</Text>

                <Text style={styles.comparisonSuggested}>
                  {(suggestedGoal / 1000).toFixed(2)} L
                </Text>
              </View>
            </View>

            {dailyGoal !== suggestedGoal && (
              <Pressable
                onPress={handleUseSuggestedGoal}
                style={({ pressed }) => [
                  styles.useGoalButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.useGoalButtonText}>Use suggested goal</Text>
              </Pressable>
            )}

            {dailyGoal === suggestedGoal && (
              <View style={styles.goalActiveBadge}>
                <Text style={styles.goalActiveText}>
                  Suggested goal active ✓
                </Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.sectionTitle}>Weight history</Text>

        {entries.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No weight history</Text>

            <Text style={styles.emptyText}>
              Log your first weight to get started.
            </Text>
          </View>
        ) : (
          <View style={styles.historyCard}>
            {entries.map((entry, index) => {
              const isLast = index === entries.length - 1;

              return (
                <View
                  key={entry.id}
                  style={[
                    styles.historyRow,
                    !isLast && styles.historyRowBorder,
                  ]}
                >
                  <Text style={styles.historyDate}>
                    {entry.createdAt
                      ? entry.createdAt.toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        })
                      : '—'}
                  </Text>

                  <Text style={styles.historyWeight}>
                    {entry.weightKg.toFixed(1)} kg
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType='fade'
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => {
              Keyboard.dismiss();
              setModalVisible(false);
            }}
          >
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <Text style={styles.modalTitle}>Log weight</Text>

              <Text style={styles.modalDescription}>
                Enter your current weight
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  value={weightInput}
                  onChangeText={setWeightInput}
                  keyboardType='decimal-pad'
                  placeholder='88.4'
                  placeholderTextColor={Colours.textSecondary}
                  style={styles.input}
                  selectTextOnFocus
                />

                <Text style={styles.inputUnit}>kg</Text>
              </View>

              <Pressable
                onPress={handleSaveWeight}
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.saveButtonText}>Save weight</Text>
              </Pressable>

              <Pressable
                onPress={() => setModalVisible(false)}
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

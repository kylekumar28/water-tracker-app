import { StyleSheet } from 'react-native';

import { Colours } from '@/constants/colours';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colours.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 90,
  },

  title: {
    color: Colours.text,
    fontSize: 34,
    fontWeight: '700',
  },

  subtitle: {
    color: Colours.textSecondary,
    fontSize: 17,
    marginTop: 8,
    marginBottom: 28,
  },

  weightCard: {
    backgroundColor: Colours.card,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },

  cardLabel: {
    color: Colours.textSecondary,
    fontSize: 15,
  },

  weightValue: {
    color: Colours.text,
    fontSize: 48,
    fontWeight: '800',
    marginTop: 8,
  },

  weightUnit: {
    color: Colours.textSecondary,
    fontSize: 22,
    fontWeight: '600',
  },

  updatedText: {
    color: Colours.textSecondary,
    fontSize: 14,
    marginTop: 6,
  },

  noWeightText: {
    color: Colours.textSecondary,
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },

  logWeightButton: {
    height: 54,
    width: '100%',
    backgroundColor: Colours.border,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  logWeightButtonText: {
    color: Colours.text,
    fontSize: 16,
    fontWeight: '700',
  },

  hydrationCard: {
    backgroundColor: Colours.card,
    borderRadius: 28,
    padding: 24,
    marginBottom: 30,
  },

  sectionTitle: {
    color: Colours.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },

  suggestedValue: {
    color: Colours.blue,
    fontSize: 44,
    fontWeight: '800',
  },

  suggestedExplanation: {
    color: Colours.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },

  goalComparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colours.border,
  },

  comparisonRight: {
    alignItems: 'flex-end',
  },

  comparisonLabel: {
    color: Colours.textSecondary,
    fontSize: 13,
  },

  comparisonValue: {
    color: Colours.text,
    fontSize: 21,
    fontWeight: '800',
    marginTop: 4,
  },

  comparisonSuggested: {
    color: Colours.blue,
    fontSize: 21,
    fontWeight: '800',
    marginTop: 4,
  },

  useGoalButton: {
    height: 56,
    backgroundColor: Colours.blue,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  useGoalButtonText: {
    color: Colours.text,
    fontSize: 16,
    fontWeight: '700',
  },

  goalActiveBadge: {
    backgroundColor: 'rgba(54, 112, 247, 0.15)',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 22,
  },

  goalActiveText: {
    color: Colours.blue,
    fontSize: 15,
    fontWeight: '700',
  },

  emptyCard: {
    backgroundColor: Colours.card,
    borderRadius: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },

  emptyTitle: {
    color: Colours.text,
    fontSize: 18,
    fontWeight: '700',
  },

  emptyText: {
    color: Colours.textSecondary,
    fontSize: 15,
    marginTop: 6,
  },

  historyCard: {
    backgroundColor: Colours.card,
    borderRadius: 24,
    overflow: 'hidden',
  },

  historyRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  historyRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colours.border,
  },

  historyDate: {
    flex: 1,
    color: Colours.textSecondary,
    fontSize: 15,
  },

  historyWeight: {
    color: Colours.text,
    fontSize: 17,
    fontWeight: '700',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },

  modalCard: {
    backgroundColor: Colours.card,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 42,
  },

  modalTitle: {
    color: Colours.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },

  modalDescription: {
    color: Colours.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },

  inputContainer: {
    height: 64,
    backgroundColor: Colours.border,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  input: {
    flex: 1,
    color: Colours.text,
    fontSize: 24,
    fontWeight: '700',
  },

  inputUnit: {
    color: Colours.textSecondary,
    fontSize: 18,
    fontWeight: '600',
  },

  saveButton: {
    height: 58,
    backgroundColor: Colours.blue,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },

  saveButtonText: {
    color: Colours.text,
    fontSize: 17,
    fontWeight: '700',
  },

  cancelButton: {
    height: 58,
    backgroundColor: Colours.border,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  cancelButtonText: {
    color: Colours.text,
    fontSize: 17,
    fontWeight: '700',
  },

  buttonPressed: {
    opacity: 0.75,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: Colours.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: Colours.textSecondary,
    fontSize: 15,
    marginTop: 14,
  },
});

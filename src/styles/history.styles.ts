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
    marginBottom: 24,
  },

  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  dateButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: Colours.card,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateButtonPressed: {
    backgroundColor: Colours.cardPressed,
  },

  dateButtonDisabled: {
    opacity: 0.35,
  },

  dateButtonText: {
    color: Colours.blue,
    fontSize: 30,
    fontWeight: '500',
    lineHeight: 32,
  },

  dateButtonTextDisabled: {
    color: Colours.textSecondary,
  },

  dateText: {
    flex: 1,
    color: Colours.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 12,
  },

  loadingContainer: {
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: Colours.textSecondary,
    fontSize: 15,
    marginTop: 14,
  },

  summaryCard: {
    backgroundColor: Colours.card,
    borderRadius: 28,
    paddingHorizontal: 26,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 30,
  },

  summaryLabel: {
    color: Colours.textSecondary,
    fontSize: 15,
  },

  summaryTotal: {
    color: Colours.text,
    fontSize: 44,
    fontWeight: '800',
    marginTop: 6,
  },

  summaryGoal: {
    color: Colours.textSecondary,
    fontSize: 17,
    marginTop: 2,
  },

  summaryPercentage: {
    color: Colours.blue,
    fontSize: 56,
    fontWeight: '800',
    marginTop: 18,
  },

  progressTrack: {
    height: 12,
    width: '100%',
    backgroundColor: Colours.border,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 20,
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colours.blue,
    borderRadius: 999,
  },

  summaryStatus: {
    color: Colours.textSecondary,
    fontSize: 16,
    marginTop: 18,
  },

  sectionTitle: {
    color: Colours.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
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
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  historyRowBorder: {
    borderBottomColor: Colours.border,
    borderBottomWidth: 1,
  },

  historyTime: {
    width: 62,
    color: Colours.textSecondary,
    fontSize: 14,
  },

  historyName: {
    flex: 1,
    color: Colours.text,
    fontSize: 17,
    fontWeight: '600',
  },

  historyAmount: {
    color: Colours.blue,
    fontSize: 17,
    fontWeight: '700',
  },
});

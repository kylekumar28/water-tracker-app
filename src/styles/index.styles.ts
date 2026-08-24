import { Colours } from '@/constants/colours';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colours.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 130,
  },

  greeting: {
    color: Colours.text,
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 8,
  },

  sectionLabel: {
    color: Colours.textSecondary,
    fontSize: 17,
    marginBottom: 28,
  },

  progressCard: {
    backgroundColor: Colours.card,
    borderRadius: 28,
    paddingHorizontal: 26,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 30,
  },

  consumed: {
    color: Colours.text,
    fontSize: 44,
    fontWeight: '800',
  },

  goal: {
    color: Colours.textSecondary,
    fontSize: 17,
    marginTop: 3,
  },

  percentage: {
    color: Colours.blue,
    fontSize: 62,
    fontWeight: '800',
    marginTop: 18,
  },

  progressTrack: {
    height: 12,
    width: '100%',
    backgroundColor: Colours.border,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 22,
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colours.blue,
    borderRadius: 999,
  },

  remaining: {
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

  quickAddRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 34,
  },

  quickAddButton: {
    flex: 1,
    height: 92,
    borderRadius: 22,
    backgroundColor: Colours.card,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickAddButtonPressed: {
    backgroundColor: Colours.cardPressed,
  },

  quickAddPlus: {
    color: Colours.blue,
    fontSize: 30,
    fontWeight: '500',
  },

  quickAddAmount: {
    color: Colours.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 0,
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

  historyDrink: {
    flex: 1,
  },

  historyName: {
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

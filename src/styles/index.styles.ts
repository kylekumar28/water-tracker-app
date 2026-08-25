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
    paddingBottom: 40,
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
    marginBottom: 40,
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

  historyRowPressed: {
    backgroundColor: Colours.cardPressed,
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
    alignItems: 'center',
  },

  modalTitle: {
    color: Colours.text,
    fontSize: 24,
    fontWeight: '700',
  },

  modalAmount: {
    color: Colours.blue,
    fontSize: 42,
    fontWeight: '800',
    marginTop: 12,
  },

  modalTime: {
    color: Colours.textSecondary,
    fontSize: 16,
    marginTop: 4,
    marginBottom: 28,
  },

  modalDeleteButton: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    backgroundColor: '#2A1C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalDeleteText: {
    color: '#FF5A5F',
    fontSize: 17,
    fontWeight: '700',
  },

  modalCancelButton: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    backgroundColor: Colours.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  modalCancelText: {
    color: Colours.text,
    fontSize: 17,
    fontWeight: '700',
  },

  modalButtonPressed: {
    opacity: 0.75,
  },

  emptyHistoryCard: {
    backgroundColor: Colours.card,
    borderRadius: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },

  emptyHistoryTitle: {
    color: Colours.text,
    fontSize: 18,
    fontWeight: '700',
  },

  emptyHistoryText: {
    color: Colours.textSecondary,
    fontSize: 15,
    marginTop: 6,
  },

  goalModalDescription: {
    color: Colours.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },

  goalInputContainer: {
    width: '100%',
    height: 64,
    borderRadius: 18,
    backgroundColor: Colours.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 18,
  },

  goalInput: {
    flex: 1,
    color: Colours.text,
    fontSize: 24,
    fontWeight: '700',
  },

  goalInputUnit: {
    color: Colours.textSecondary,
    fontSize: 18,
    fontWeight: '600',
  },

  goalSaveButton: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    backgroundColor: Colours.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },

  goalSaveText: {
    color: Colours.text,
    fontSize: 17,
    fontWeight: '700',
  },

  quickAddButtonDisabled: {
    opacity: 0.55,
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

  goalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  goalButtonPressed: {
    opacity: 0.6,
  },

  goalEdit: {
    color: Colours.blue,
    fontSize: 13,
    fontWeight: '600',
  },
});

import { StyleSheet } from 'react-native';

import { Colours } from '@/constants/colours';

export const styles = StyleSheet.create({
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
  coffeeAmount: {
    color: Colours.coffee,
  },
});

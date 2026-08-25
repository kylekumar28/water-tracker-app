import { StyleSheet } from 'react-native';

import { Colours } from '@/constants/colours';

export const styles = StyleSheet.create({
  sectionTitle: {
    color: Colours.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },

  quickAddRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  addDrinkButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: Colours.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },

  addDrinkButtonPressed: {
    opacity: 0.75,
  },

  addDrinkButtonPlus: {
    color: Colours.text,
    fontSize: 24,
    fontWeight: '500',
  },

  addDrinkButtonText: {
    color: Colours.text,
    fontSize: 17,
    fontWeight: '700',
  },
});

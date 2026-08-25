import { StyleSheet } from 'react-native';

import { Colours } from '@/constants/colours';

export const styles = StyleSheet.create({
  sectionTitle: {
    color: Colours.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },

  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },

  quickAddFavourite: {
    width: '48%',
    minHeight: 100,
    borderRadius: 22,
    backgroundColor: Colours.card,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    position: 'relative',
  },

  quickAddFavouritePressed: {
    backgroundColor: Colours.cardPressed,
  },

  quickAddFavouriteDisabled: {
    opacity: 0.55,
  },

  quickAddBeverage: {
    color: Colours.text,
    fontSize: 16,
    fontWeight: '700',
    paddingRight: 24,
  },

  quickAddAmount: {
    color: Colours.blue,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
  },

  quickAddPlus: {
    position: 'absolute',
    top: 12,
    right: 16,
    color: Colours.blue,
    fontSize: 24,
    fontWeight: '500',
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

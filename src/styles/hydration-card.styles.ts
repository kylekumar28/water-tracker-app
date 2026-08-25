import { StyleSheet } from 'react-native';

import { Colours } from '@/constants/colours';

export const styles = StyleSheet.create({
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

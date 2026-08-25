import { StyleSheet } from 'react-native';

import { Colours } from '@/constants/colours';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colours.card,
    borderRadius: 28,
    padding: 20,
    marginBottom: 30,
  },

  title: {
    color: Colours.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
  },

  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  day: {
    alignItems: 'center',
    flex: 1,
  },

  dayLabel: {
    color: Colours.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },

  dayAmount: {
    color: Colours.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },

  dayStatus: {
    color: Colours.textSecondary,
    fontSize: 18,
    marginTop: 4,
  },

  dayStatusReached: {
    color: Colours.blue,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: Colours.border,
  },

  statRight: {
    alignItems: 'flex-end',
  },

  statLabel: {
    color: Colours.textSecondary,
    fontSize: 13,
  },

  statValue: {
    color: Colours.text,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 4,
  },

  chart: {
    height: 130,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 22,
    marginBottom: 8,
  },

  chartColumn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  barTrack: {
    width: 18,
    height: '100%',
    backgroundColor: Colours.border,
    borderRadius: 999,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    position: 'relative',
  },

  barFill: {
    width: '100%',
    backgroundColor: Colours.blue,
    borderRadius: 999,
  },

  goalMarker: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colours.textSecondary,
    zIndex: 2,
  },
});

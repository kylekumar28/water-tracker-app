import { StyleSheet } from 'react-native';

import { Colours } from '@/constants/colours';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colours.card,
    borderRadius: 28,
    paddingTop: 22,
    paddingBottom: 18,
    marginTop: 20,
    overflow: 'hidden',
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 18,
  },

  title: {
    color: Colours.text,
    fontSize: 20,
    fontWeight: '700',
  },

  subtitle: {
    color: Colours.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },

  legend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  intakeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: Colours.blue,
  },

  goalDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: Colours.textSecondary,
  },

  legendText: {
    color: Colours.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },

  chartContainer: {
    paddingRight: 10,
  },

  axisText: {
    color: Colours.textSecondary,
    fontSize: 10,
  },

  xAxisText: {
    color: Colours.textSecondary,
    fontSize: 10,
  },

  tooltip: {
    width: 145,
    backgroundColor: Colours.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  tooltipDate: {
    color: Colours.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },

  tooltipIntake: {
    color: Colours.blue,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 3,
  },

  tooltipGoal: {
    color: Colours.text,
    fontSize: 12,
    marginTop: 3,
  },

  tooltipPercentage: {
    color: Colours.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});

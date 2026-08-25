import { Colours } from '@/constants/colours';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colours.card,
    borderRadius: 28,
    padding: 22,
    marginTop: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
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

  percentageContainer: {
    backgroundColor: 'rgba(54, 112, 247, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },

  percentage: {
    color: Colours.blue,
    fontSize: 16,
    fontWeight: '800',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  day: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: '#1A1D24',
  },

  dayTracked: {
    backgroundColor: '#26365C',
  },

  dayHalf: {
    backgroundColor: '#2D55A8',
  },

  dayComplete: {
    backgroundColor: Colours.blue,
  },

  footer: {
    marginTop: 20,
  },

  footerText: {
    color: Colours.textSecondary,
    fontSize: 14,
    marginBottom: 14,
  },

  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  legendText: {
    color: Colours.textSecondary,
    fontSize: 12,
  },

  legendSquare: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },

  legendEmpty: {
    backgroundColor: '#1A1D24',
  },

  legendTracked: {
    backgroundColor: '#26365C',
  },

  legendHalf: {
    backgroundColor: '#2D55A8',
  },

  legendComplete: {
    backgroundColor: Colours.blue,
  },
});

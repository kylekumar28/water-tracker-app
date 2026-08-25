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
  },

  subtitle: {
    color: Colours.textSecondary,
    fontSize: 17,
    marginTop: 8,
    marginBottom: 28,
  },

  heroCard: {
    backgroundColor: Colours.card,
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 18,
  },

  heroLabel: {
    color: Colours.textSecondary,
    fontSize: 15,
  },

  heroValue: {
    color: Colours.blue,
    fontSize: 48,
    fontWeight: '800',
    marginTop: 8,
  },

  heroSubtext: {
    color: Colours.textSecondary,
    fontSize: 14,
    marginTop: 6,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  statCard: {
    width: '48%',
    minHeight: 140,
    backgroundColor: Colours.card,
    borderRadius: 22,
    padding: 18,
    justifyContent: 'center',
  },

  statLabel: {
    color: Colours.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },

  statValue: {
    color: Colours.text,
    fontSize: 32,
    fontWeight: '800',
    marginTop: 8,
  },

  statUnit: {
    color: Colours.blue,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
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
});

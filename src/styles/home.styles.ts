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

  sectionTitle: {
    color: Colours.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
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

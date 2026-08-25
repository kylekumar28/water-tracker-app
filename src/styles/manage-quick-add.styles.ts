import { StyleSheet } from 'react-native';

import { Colours } from '@/constants/colours';

export const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },

  modalCard: {
    maxHeight: '90%',
    backgroundColor: Colours.card,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 42,
  },

  title: {
    color: Colours.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },

  scrollArea: {
    maxHeight: 520,
  },

  favouriteRow: {
    minHeight: 72,
    borderRadius: 18,
    backgroundColor: Colours.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  favouriteInfo: {
    flex: 1,
  },

  favouriteName: {
    color: Colours.text,
    fontSize: 16,
    fontWeight: '700',
  },

  favouriteAmount: {
    color: Colours.blue,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 3,
  },

  removeButton: {
    paddingVertical: 10,
    paddingLeft: 14,
  },

  removeText: {
    color: '#FF5A5F',
    fontSize: 14,
    fontWeight: '700',
  },

  addFavouriteButton: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colours.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 18,
  },

  addFavouriteText: {
    color: Colours.blue,
    fontSize: 16,
    fontWeight: '700',
  },

  addFavouriteSection: {
    marginTop: 8,
    marginBottom: 20,
  },

  sectionLabel: {
    color: Colours.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 10,
  },

  beverageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  beverageOption: {
    minHeight: 46,
    borderRadius: 15,
    backgroundColor: Colours.border,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  beverageOptionSelected: {
    borderWidth: 2,
    borderColor: Colours.blue,
  },

  beverageOptionText: {
    color: Colours.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },

  beverageOptionTextSelected: {
    color: Colours.blue,
  },

  amountOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  amountOption: {
    minWidth: 88,
    height: 48,
    borderRadius: 15,
    backgroundColor: Colours.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  amountOptionSelected: {
    borderWidth: 2,
    borderColor: Colours.blue,
  },

  amountOptionText: {
    color: Colours.text,
    fontSize: 15,
    fontWeight: '700',
  },

  amountOptionTextSelected: {
    color: Colours.blue,
  },

  customAmountLabel: {
    color: Colours.textSecondary,
    fontSize: 14,
    marginTop: 18,
    marginBottom: 8,
  },

  inputContainer: {
    height: 60,
    borderRadius: 17,
    backgroundColor: Colours.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  input: {
    flex: 1,
    color: Colours.text,
    fontSize: 21,
    fontWeight: '700',
  },

  inputUnit: {
    color: Colours.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },

  confirmFavouriteButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: Colours.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },

  confirmFavouriteText: {
    color: Colours.text,
    fontSize: 16,
    fontWeight: '700',
  },

  cancelAddingButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelAddingText: {
    color: Colours.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },

  saveButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: Colours.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  saveButtonText: {
    color: Colours.text,
    fontSize: 17,
    fontWeight: '700',
  },

  cancelButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: Colours.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  cancelButtonText: {
    color: Colours.text,
    fontSize: 17,
    fontWeight: '700',
  },

  disabled: {
    opacity: 0.5,
  },

  buttonPressed: {
    opacity: 0.7,
  },
});

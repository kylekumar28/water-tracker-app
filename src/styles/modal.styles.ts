import { StyleSheet } from 'react-native';

import { Colours } from '@/constants/colours';

export const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },

  modalCard: {
    backgroundColor: Colours.card,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 42,
    alignItems: 'center',
  },

  modalTitle: {
    color: Colours.text,
    fontSize: 24,
    fontWeight: '700',
  },

  modalAmount: {
    color: Colours.blue,
    fontSize: 42,
    fontWeight: '800',
    marginTop: 12,
  },

  modalTime: {
    color: Colours.textSecondary,
    fontSize: 16,
    marginTop: 4,
    marginBottom: 28,
  },

  modalDeleteButton: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    backgroundColor: '#2A1C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalDeleteText: {
    color: '#FF5A5F',
    fontSize: 17,
    fontWeight: '700',
  },

  modalCancelButton: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    backgroundColor: Colours.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  modalCancelText: {
    color: Colours.text,
    fontSize: 17,
    fontWeight: '700',
  },

  modalButtonPressed: {
    opacity: 0.75,
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  goalModalDescription: {
    color: Colours.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },

  goalInputContainer: {
    width: '100%',
    height: 64,
    borderRadius: 18,
    backgroundColor: Colours.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 18,
  },

  goalInput: {
    flex: 1,
    color: Colours.text,
    fontSize: 24,
    fontWeight: '700',
  },

  goalInputUnit: {
    color: Colours.textSecondary,
    fontSize: 18,
    fontWeight: '600',
  },

  goalSaveButton: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    backgroundColor: Colours.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },

  goalSaveText: {
    color: Colours.text,
    fontSize: 17,
    fontWeight: '700',
  },

  addDrinkModalCard: {
    backgroundColor: Colours.card,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 42,
  },

  addDrinkSectionLabel: {
    color: Colours.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 26,
    marginBottom: 12,
  },

  beverageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  beverageOption: {
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colours.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  beverageOptionSelected: {
    borderWidth: 2,
    borderColor: Colours.blue,
  },

  beverageOptionText: {
    color: Colours.textSecondary,
    fontSize: 15,
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
    minWidth: 90,
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colours.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  amountOptionSelected: {
    borderWidth: 2,
    borderColor: Colours.blue,
  },

  amountOptionText: {
    color: Colours.text,
    fontSize: 16,
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

  modalButtonDisabled: {
    opacity: 0.55,
  },

  manageBeveragesButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    marginTop: 4,
  },

  manageBeveragesText: {
    color: Colours.blue,
    fontSize: 14,
    fontWeight: '700',
  },
});

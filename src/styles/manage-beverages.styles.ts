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

  beverageRow: {
    minHeight: 88,
    borderRadius: 18,
    backgroundColor: Colours.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  rowInfo: {
    flex: 1,
  },

  beverageName: {
    color: Colours.text,
    fontSize: 17,
    fontWeight: '700',
  },

  beverageDetails: {
    color: Colours.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },

  beveragePresets: {
    color: Colours.blue,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },

  editText: {
    color: Colours.blue,
    fontSize: 15,
    fontWeight: '700',
  },

  addButton: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colours.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  addButtonText: {
    color: Colours.blue,
    fontSize: 16,
    fontWeight: '700',
  },

  doneButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: Colours.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },

  doneButtonText: {
    color: Colours.text,
    fontSize: 17,
    fontWeight: '700',
  },

  label: {
    color: Colours.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8,
  },

  textInput: {
    height: 60,
    borderRadius: 17,
    backgroundColor: Colours.border,
    paddingHorizontal: 18,
    color: Colours.text,
    fontSize: 18,
    fontWeight: '600',
  },

  amountInputContainer: {
    height: 60,
    borderRadius: 17,
    backgroundColor: Colours.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  amountInput: {
    flex: 1,
    color: Colours.text,
    fontSize: 20,
    fontWeight: '700',
  },

  inputUnit: {
    color: Colours.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },

  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  presetChip: {
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: Colours.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  presetText: {
    color: Colours.text,
    fontSize: 14,
    fontWeight: '700',
  },

  presetRemove: {
    color: '#FF5A5F',
    fontSize: 18,
    marginLeft: 8,
  },

  presetInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  presetInput: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colours.border,
    paddingHorizontal: 16,
    color: Colours.text,
    fontSize: 16,
    fontWeight: '600',
  },

  presetAddButton: {
    width: 82,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colours.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },

  presetAddText: {
    color: Colours.text,
    fontSize: 15,
    fontWeight: '700',
  },

  enabledRow: {
    minHeight: 74,
    borderRadius: 18,
    backgroundColor: Colours.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 22,
  },

  enabledTitle: {
    color: Colours.text,
    fontSize: 16,
    fontWeight: '700',
  },

  enabledDescription: {
    color: Colours.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },

  saveButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: Colours.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
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

  buttonPressed: {
    opacity: 0.7,
  },
});

import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colours } from '@/constants/colours';
import type { Beverage } from '@/services/beverages';
import { styles } from '@/styles/modal.styles';

type Props = {
  visible: boolean;
  beverages: Beverage[];
  selectedBeverage: Beverage | null;
  selectedAmount: number | null;
  customAmount: string;
  isAdding: boolean;

  onSelectBeverage: (beverage: Beverage) => void;
  onSelectAmount: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  onManageBeverages: () => void;
};

const AddDrinkModal = ({
  visible,
  beverages,
  selectedBeverage,
  selectedAmount,
  customAmount,
  isAdding,
  onSelectBeverage,
  onSelectAmount,
  onCustomAmountChange,
  onConfirm,
  onClose,
  onManageBeverages,
}: Props) => {
  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.modalBackdrop} onPress={handleClose}>
          <Pressable style={styles.addDrinkModalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Add drink</Text>

            <Text style={styles.addDrinkSectionLabel}>Beverage</Text>

            <View style={styles.beverageOptions}>
              {beverages.map((beverage) => {
                const selected = selectedBeverage?.id === beverage.id;

                return (
                  <Pressable
                    key={beverage.id}
                    onPress={() => onSelectBeverage(beverage)}
                    style={({ pressed }) => [
                      styles.beverageOption,
                      selected && styles.beverageOptionSelected,
                      pressed && styles.modalButtonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.beverageOptionText,
                        selected && styles.beverageOptionTextSelected,
                      ]}
                    >
                      {beverage.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={onManageBeverages}
              style={({ pressed }) => [
                styles.manageBeveragesButton,
                pressed && styles.modalButtonPressed,
              ]}
            >
              <Text style={styles.manageBeveragesText}>Manage beverages</Text>
            </Pressable>

            {selectedBeverage && (
              <>
                <Text style={styles.addDrinkSectionLabel}>Amount</Text>

                <View style={styles.amountOptions}>
                  {selectedBeverage.presetAmountsMl.map((amount) => {
                    const selected =
                      selectedAmount === amount && customAmount === '';

                    return (
                      <Pressable
                        key={amount}
                        onPress={() => onSelectAmount(amount)}
                        style={({ pressed }) => [
                          styles.amountOption,
                          selected && styles.amountOptionSelected,
                          pressed && styles.modalButtonPressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.amountOptionText,
                            selected && styles.amountOptionTextSelected,
                          ]}
                        >
                          {amount >= 1000
                            ? `${amount / 1000} L`
                            : `${amount} ml`}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={styles.customAmountLabel}>Custom amount</Text>

                <View style={styles.goalInputContainer}>
                  <TextInput
                    value={customAmount}
                    onChangeText={onCustomAmountChange}
                    keyboardType='number-pad'
                    placeholder='Enter amount'
                    placeholderTextColor={Colours.textSecondary}
                    style={styles.goalInput}
                  />

                  <Text style={styles.goalInputUnit}>ml</Text>
                </View>
              </>
            )}

            <Pressable
              disabled={!selectedBeverage || !selectedAmount || isAdding}
              style={({ pressed }) => [
                styles.goalSaveButton,
                (!selectedBeverage || !selectedAmount || isAdding) &&
                  styles.modalButtonDisabled,
                pressed && styles.modalButtonPressed,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.goalSaveText}>Add drink</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.modalCancelButton,
                pressed && styles.modalButtonPressed,
              ]}
              onPress={handleClose}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddDrinkModal;

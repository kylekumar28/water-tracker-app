import { useEffect, useState } from 'react';

import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colours } from '@/constants/colours';
import type { Beverage } from '@/services/beverages';
import type { QuickAddItem } from '@/services/quickAdd';
import { styles } from '@/styles/manage-quick-add.styles';

type Props = {
  visible: boolean;
  items: QuickAddItem[];
  beverages: Beverage[];
  onSave: (items: QuickAddItem[]) => void;
  onClose: () => void;
};

export default function ManageQuickAddModal({
  visible,
  items,
  beverages,
  onSave,
  onClose,
}: Props) {
  const [draftItems, setDraftItems] = useState<QuickAddItem[]>([]);

  const [addingFavourite, setAddingFavourite] = useState(false);

  const [selectedBeverage, setSelectedBeverage] = useState<Beverage | null>(
    null,
  );

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const [customAmount, setCustomAmount] = useState('');

  useEffect(() => {
    if (visible) {
      setDraftItems(items);
      setAddingFavourite(false);
      setSelectedBeverage(null);
      setSelectedAmount(null);
      setCustomAmount('');
    }
  }, [visible, items]);

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const removeItem = (index: number) => {
    setDraftItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const chooseBeverage = (beverage: Beverage) => {
    setSelectedBeverage(beverage);
    setSelectedAmount(beverage.defaultAmountMl);
    setCustomAmount('');
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);

    const parsed = Number(value);

    if (Number.isFinite(parsed) && parsed > 0) {
      setSelectedAmount(Math.round(parsed));
    } else {
      setSelectedAmount(null);
    }
  };

  const addFavourite = () => {
    if (!selectedBeverage || !selectedAmount) {
      return;
    }

    const newItem: QuickAddItem = {
      beverageId: selectedBeverage.id,
      amountMl: selectedAmount,
    };

    const alreadyExists = draftItems.some(
      (item) =>
        item.beverageId === newItem.beverageId &&
        item.amountMl === newItem.amountMl,
    );

    if (!alreadyExists) {
      setDraftItems((current) => [...current, newItem]);
    }

    setAddingFavourite(false);
    setSelectedBeverage(null);
    setSelectedAmount(null);
    setCustomAmount('');

    Keyboard.dismiss();
  };

  const getBeverageName = (beverageId: string) => {
    return (
      beverages.find((beverage) => beverage.id === beverageId)?.name ??
      'Unknown drink'
    );
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
        <Pressable style={styles.backdrop} onPress={handleClose}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.title}>Manage Quick Add</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollArea}
            >
              {draftItems.map((item, index) => (
                <View
                  key={`${item.beverageId}-${item.amountMl}`}
                  style={styles.favouriteRow}
                >
                  <View style={styles.favouriteInfo}>
                    <Text style={styles.favouriteName}>
                      {getBeverageName(item.beverageId)}
                    </Text>

                    <Text style={styles.favouriteAmount}>
                      {item.amountMl >= 1000
                        ? `${item.amountMl / 1000} L`
                        : `${item.amountMl} ml`}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => removeItem(index)}
                    style={({ pressed }) => [
                      styles.removeButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                </View>
              ))}

              {!addingFavourite ? (
                <Pressable
                  onPress={() => setAddingFavourite(true)}
                  style={({ pressed }) => [
                    styles.addFavouriteButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.addFavouriteText}>+ Add favourite</Text>
                </Pressable>
              ) : (
                <View style={styles.addFavouriteSection}>
                  <Text style={styles.sectionLabel}>Beverage</Text>

                  <View style={styles.beverageOptions}>
                    {beverages.map((beverage) => {
                      const selected = selectedBeverage?.id === beverage.id;

                      return (
                        <Pressable
                          key={beverage.id}
                          onPress={() => chooseBeverage(beverage)}
                          style={({ pressed }) => [
                            styles.beverageOption,
                            selected && styles.beverageOptionSelected,
                            pressed && styles.buttonPressed,
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

                  {selectedBeverage && (
                    <>
                      <Text style={styles.sectionLabel}>Amount</Text>

                      <View style={styles.amountOptions}>
                        {selectedBeverage.presetAmountsMl.map((amount) => {
                          const selected =
                            selectedAmount === amount && customAmount === '';

                          return (
                            <Pressable
                              key={amount}
                              onPress={() => {
                                setSelectedAmount(amount);
                                setCustomAmount('');
                              }}
                              style={({ pressed }) => [
                                styles.amountOption,
                                selected && styles.amountOptionSelected,
                                pressed && styles.buttonPressed,
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

                      <Text style={styles.customAmountLabel}>
                        Custom amount
                      </Text>

                      <View style={styles.inputContainer}>
                        <TextInput
                          value={customAmount}
                          onChangeText={handleCustomAmount}
                          keyboardType='number-pad'
                          placeholder='Enter amount'
                          placeholderTextColor={Colours.textSecondary}
                          style={styles.input}
                        />

                        <Text style={styles.inputUnit}>ml</Text>
                      </View>

                      <Pressable
                        disabled={!selectedAmount}
                        onPress={addFavourite}
                        style={({ pressed }) => [
                          styles.confirmFavouriteButton,
                          !selectedAmount && styles.disabled,
                          pressed && styles.buttonPressed,
                        ]}
                      >
                        <Text style={styles.confirmFavouriteText}>
                          Add favourite
                        </Text>
                      </Pressable>
                    </>
                  )}

                  <Pressable
                    onPress={() => setAddingFavourite(false)}
                    style={({ pressed }) => [
                      styles.cancelAddingButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.cancelAddingText}>Cancel</Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>

            <Pressable
              onPress={() => onSave(draftItems)}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.saveButtonText}>Save changes</Text>
            </Pressable>

            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

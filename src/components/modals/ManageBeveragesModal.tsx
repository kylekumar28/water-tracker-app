import { useEffect, useState } from 'react';

import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colours } from '@/constants/colours';
import type { Beverage } from '@/services/beverages';
import { styles } from '@/styles/manage-beverages.styles';

type Props = {
  visible: boolean;
  beverages: Beverage[];
  onSave: (beverage: Beverage) => Promise<void>;
  onAdd: (beverage: Beverage) => Promise<void>;
  onClose: () => void;
};

export default function ManageBeveragesModal({
  visible,
  beverages,
  onSave,
  onAdd,
  onClose,
}: Props) {
  const [editing, setEditing] = useState<Beverage | null>(null);

  const [name, setName] = useState('');
  const [defaultAmount, setDefaultAmount] = useState('');
  const [presetInput, setPresetInput] = useState('');
  const [presets, setPresets] = useState<number[]>([]);
  const [enabled, setEnabled] = useState(true);

  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (!visible) {
      setEditing(null);
      setIsNew(false);
    }
  }, [visible]);

  const beginEdit = (beverage: Beverage) => {
    setEditing(beverage);
    setName(beverage.name);
    setDefaultAmount(beverage.defaultAmountMl.toString());
    setPresets(beverage.presetAmountsMl);
    setEnabled(beverage.enabled);
    setPresetInput('');
    setIsNew(false);
  };

  const beginAdd = () => {
    setEditing(null);
    setName('');
    setDefaultAmount('');
    setPresets([]);
    setEnabled(true);
    setPresetInput('');
    setIsNew(true);
  };

  const addPreset = () => {
    const parsed = Number(presetInput);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }

    const amount = Math.round(parsed);

    setPresets((current) => {
      if (current.includes(amount)) {
        return current;
      }

      return [...current, amount].sort((a, b) => a - b);
    });

    setPresetInput('');
    Keyboard.dismiss();
  };

  const removePreset = (amount: number) => {
    setPresets((current) => current.filter((item) => item !== amount));
  };

  const makeId = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const saveCurrent = async () => {
    const parsedDefault = Number(defaultAmount);

    if (!name.trim() || !Number.isFinite(parsedDefault) || parsedDefault <= 0) {
      return;
    }

    const beverage: Beverage = {
      id: isNew
        ? makeId(name)
        : // biome-ignore lint/style/noNonNullAssertion: <allw it>
          editing!.id,

      name: name.trim(),
      defaultAmountMl: Math.round(parsedDefault),
      presetAmountsMl: presets,
      enabled,
    };

    if (isNew) {
      await onAdd(beverage);
    } else {
      await onSave(beverage);
    }

    setEditing(null);
    setIsNew(false);
    Keyboard.dismiss();
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const showingEditor = editing !== null || isNew;

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
            <Text style={styles.title}>Manage Beverages</Text>

            {!showingEditor ? (
              <>
                <ScrollView
                  style={styles.scrollArea}
                  showsVerticalScrollIndicator={false}
                >
                  {beverages.map((beverage) => (
                    <Pressable
                      key={beverage.id}
                      onPress={() => beginEdit(beverage)}
                      style={({ pressed }) => [
                        styles.beverageRow,
                        pressed && styles.buttonPressed,
                      ]}
                    >
                      <View style={styles.rowInfo}>
                        <Text style={styles.beverageName}>{beverage.name}</Text>

                        <Text style={styles.beverageDetails}>
                          Default: {beverage.defaultAmountMl} ml
                        </Text>

                        <Text style={styles.beveragePresets}>
                          {beverage.presetAmountsMl.join(' · ')} ml
                        </Text>
                      </View>

                      <Text style={styles.editText}>Edit</Text>
                    </Pressable>
                  ))}

                  <Pressable
                    onPress={beginAdd}
                    style={({ pressed }) => [
                      styles.addButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.addButtonText}>+ Add beverage</Text>
                  </Pressable>
                </ScrollView>

                <Pressable
                  onPress={handleClose}
                  style={({ pressed }) => [
                    styles.doneButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </Pressable>
              </>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Name</Text>

                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder='Beverage name'
                  placeholderTextColor={Colours.textSecondary}
                  style={styles.textInput}
                />

                <Text style={styles.label}>Default amount</Text>

                <View style={styles.amountInputContainer}>
                  <TextInput
                    value={defaultAmount}
                    onChangeText={setDefaultAmount}
                    keyboardType='number-pad'
                    placeholder='500'
                    placeholderTextColor={Colours.textSecondary}
                    style={styles.amountInput}
                  />

                  <Text style={styles.inputUnit}>ml</Text>
                </View>

                <Text style={styles.label}>Preset amounts</Text>

                <View style={styles.presetGrid}>
                  {presets.map((amount) => (
                    <Pressable
                      key={amount}
                      onPress={() => removePreset(amount)}
                      style={styles.presetChip}
                    >
                      <Text style={styles.presetText}>
                        {amount >= 1000 ? `${amount / 1000} L` : `${amount} ml`}
                      </Text>

                      <Text style={styles.presetRemove}>×</Text>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.presetInputRow}>
                  <TextInput
                    value={presetInput}
                    onChangeText={setPresetInput}
                    keyboardType='number-pad'
                    placeholder='New preset'
                    placeholderTextColor={Colours.textSecondary}
                    style={styles.presetInput}
                  />

                  <Pressable
                    onPress={addPreset}
                    style={({ pressed }) => [
                      styles.presetAddButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.presetAddText}>Add</Text>
                  </Pressable>
                </View>

                <View style={styles.enabledRow}>
                  <View>
                    <Text style={styles.enabledTitle}>Enabled</Text>

                    <Text style={styles.enabledDescription}>
                      Show this beverage in the app
                    </Text>
                  </View>

                  <Switch value={enabled} onValueChange={setEnabled} />
                </View>

                <Pressable
                  onPress={saveCurrent}
                  style={({ pressed }) => [
                    styles.saveButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.saveButtonText}>Save changes</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setEditing(null);
                    setIsNew(false);
                    Keyboard.dismiss();
                  }}
                  style={({ pressed }) => [
                    styles.cancelButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

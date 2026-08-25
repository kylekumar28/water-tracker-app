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
import { styles } from '@/styles/modal.styles';

type Props = {
  visible: boolean;
  goalInput: string;
  onGoalInputChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
};

const DailyGoalModal = ({
  visible,
  goalInput,
  onGoalInputChange,
  onSave,
  onClose,
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
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Daily goal</Text>

            <Text style={styles.goalModalDescription}>
              How much water do you want to drink each day?
            </Text>

            <View style={styles.goalInputContainer}>
              <TextInput
                value={goalInput}
                onChangeText={onGoalInputChange}
                keyboardType='number-pad'
                placeholder='2700'
                placeholderTextColor={Colours.textSecondary}
                style={styles.goalInput}
                selectTextOnFocus
              />

              <Text style={styles.goalInputUnit}>ml</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.goalSaveButton,
                pressed && styles.modalButtonPressed,
              ]}
              onPress={onSave}
            >
              <Text style={styles.goalSaveText}>Save goal</Text>
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

export default DailyGoalModal;

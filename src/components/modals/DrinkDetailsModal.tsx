import { Modal, Pressable, Text } from 'react-native';

import { styles } from '@/styles/modal.styles';
import type { Drink } from '@/types/drinks';

type Props = {
  drink: Drink | null;
  onClose: () => void;
  onDelete: (id: string) => void;
};

const DrinkDetailsModal = ({ drink, onClose, onDelete }: Props) => {
  return (
    <Modal
      visible={drink !== null}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={() => {}}>
          {drink && (
            <>
              <Text style={styles.modalTitle}>{drink.name}</Text>

              <Text style={styles.modalAmount}>{drink.amount} ml</Text>

              <Text style={styles.modalTime}>{drink.time}</Text>

              <Pressable
                style={({ pressed }) => [
                  styles.modalDeleteButton,
                  pressed && styles.modalButtonPressed,
                ]}
                onPress={() => onDelete(drink.id)}
              >
                <Text style={styles.modalDeleteText}>Delete drink</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.modalCancelButton,
                  pressed && styles.modalButtonPressed,
                ]}
                onPress={onClose}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default DrinkDetailsModal;

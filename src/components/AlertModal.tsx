import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertModalProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  onClose?: () => void;
}

export function AlertModal({
  visible,
  title,
  message,
  buttons = [{ text: '확인', style: 'default' }],
  onClose,
}: AlertModalProps) {
  const handleButtonPress = (button: AlertButton) => {
    button.onPress?.();
    onClose?.();
  };

  const handleBackdropPress = () => {
    const cancelButton = buttons.find(b => b.style === 'cancel');
    if (cancelButton) {
      handleButtonPress(cancelButton);
    } else if (buttons.length === 1) {
      handleButtonPress(buttons[0]);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleBackdropPress}
    >
      <Pressable style={styles.overlay} onPress={handleBackdropPress}>
        <Pressable style={styles.container} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
          
          <View style={[
            styles.buttonContainer,
            buttons.length > 1 && styles.buttonContainerRow
          ]}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  buttons.length > 1 && styles.buttonHalf,
                  button.style === 'cancel' && styles.buttonCancel,
                ]}
                onPress={() => handleButtonPress(button)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.buttonText,
                  button.style === 'cancel' && styles.buttonTextCancel,
                ]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    // Liquid glass border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    borderRightColor: 'rgba(0, 0, 0, 0.05)',
    // Outer shadow
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: 'rgba(60, 60, 67, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
  buttonContainerRow: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 99,
    alignItems: 'center',
    // Liquid glass border
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.95)',
    borderLeftColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    borderRightColor: 'rgba(255, 255, 255, 0.4)',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonHalf: {
    flex: 1,
    paddingHorizontal: 16,
  },
  buttonCancel: {
    backgroundColor: 'rgba(200, 200, 205, 0.4)',
    // Inset effect
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    borderLeftColor: 'rgba(0, 0, 0, 0.06)',
    borderBottomColor: 'rgba(255, 255, 255, 0.8)',
    borderRightColor: 'rgba(255, 255, 255, 0.6)',
    shadowOpacity: 0.05,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  buttonTextCancel: {
    color: '#444',
  },
});

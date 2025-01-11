import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isLoading}
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent dark overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black background for the loader
    borderRadius: 10,
  },
});

export default Loader;
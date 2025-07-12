import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';

interface DropdownItem {
  label: string;
  value: string | number;
}

interface CustomDropdownProps {
  data: (DropdownItem | string)[];
  selectedValue: string | number;
  onValueChange: (value: string | number) => void;
  label?: string;
  dropdownStyle?: object;
  placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  data,
  selectedValue,
  onValueChange,
  label,
  dropdownStyle,
  placeholder = 'Select an option',
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Memoized normalized data
  const normalizedData = useMemo(() => 
    data.map((item) =>
      typeof item === 'string' ? { label: item, value: item } : item
    ), [data]
  );

  // Memoized selected label
  const selectedLabel = useMemo(() =>
    normalizedData.find((item) => item.value === selectedValue)?.label || placeholder,
    [normalizedData, selectedValue, placeholder]
  );

  const handleSelectItem = useCallback((item: DropdownItem) => {
    onValueChange(item.value);
    setIsModalVisible(false);
  }, [onValueChange]);

  const handleOpenModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const renderItem = useCallback(({ item }: { item: DropdownItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelectItem(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.itemText}>{item.label}</Text>
    </TouchableOpacity>
  ), [handleSelectItem]);

  const keyExtractor = useCallback((item: DropdownItem) => 
    item.value.toString(), []
  );

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.dropdown, dropdownStyle]}
        onPress={handleOpenModal}
        activeOpacity={0.8}
      >
        <Text style={styles.selectedValue}>{selectedLabel}</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={normalizedData}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              removeClippedSubviews={true}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  dropdown: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    width: '100%',
  },
  selectedValue: {
    fontSize: 16,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 10,
    padding: 20,
  },
  item: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginVertical: 2,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#007bff',
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CustomDropdown; 
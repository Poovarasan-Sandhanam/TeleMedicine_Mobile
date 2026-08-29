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

export interface DropdownItem {
  title: string;
  id: string | number;
}

interface CustomDropdownProps {
  data: (DropdownItem | string)[];
  selectedid?: string | number;
  selectedValue?: string | number;
  onidChange?: (id: string | number) => void;
  onValueChange?: (value: any) => void;
  title?: string;
  dropdownStyle?: object;
  placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  data,
  selectedid,
  selectedValue,
  onidChange,
  onValueChange,
  title,
  dropdownStyle,
  placeholder = 'Select an option',
}) => {
  const activeSelectedId = selectedValue ?? selectedid ?? '';
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Memoized normalized data
  const normalizedData = useMemo(() =>
    (data || []).map((item) =>
      typeof item === 'string' ? { title: item, id: item } : item
    ), [data]
  );

  // Memoized selected title
  const selectedtitle = useMemo(() =>
    normalizedData.find((item) => item.id === activeSelectedId)?.title || placeholder,
    [normalizedData, activeSelectedId, placeholder]
  );

  const handleSelectItem = useCallback((item: DropdownItem) => {
    if (onValueChange) {
      onValueChange(item.id);
    }
    if (onidChange) {
      onidChange(item.id);
    }
    setIsModalVisible(false);
  }, [onValueChange, onidChange]);

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
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  ), [handleSelectItem]);

  const keyExtractor = useCallback((item: DropdownItem) =>
    item.id.toString(), []
  );

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <TouchableOpacity
        style={[styles.dropdown, dropdownStyle]}
        onPress={handleOpenModal}
        activeOpacity={0.8}
      >
        <Text style={styles.selectedid}>{selectedtitle}</Text>
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
  title: {
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
  selectedid: {
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

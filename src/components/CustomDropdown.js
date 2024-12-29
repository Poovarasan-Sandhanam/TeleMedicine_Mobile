import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, SafeAreaView } from 'react-native';

const CustomDropdown = ({ data, selectedValue, onValueChange, label }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
console.log(selectedValue,"selectedValue");
  // Normalize data to ensure it has `label` and `value` properties
  const normalizedData = data.map((item) =>
    typeof item === 'string' ? { label: item, value: item } : item
  );

  const handleSelectItem = (item) => {
    onValueChange(item.value); // Pass the selected value
    setIsModalVisible(false); // Close the modal
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.selectedValue}>
          {selectedValue || 'Select an option'}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={normalizedData}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelectItem(item)}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.value}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dropdown: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#000',
    backgroundColor: '#fff',
    width: '90%',
  },
  selectedValue: {
    fontSize: 16,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  item: {
    padding: 10,
    backgroundColor:"lightgrey",
    marginTop:10,
    borderRadius:5
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CustomDropdown;

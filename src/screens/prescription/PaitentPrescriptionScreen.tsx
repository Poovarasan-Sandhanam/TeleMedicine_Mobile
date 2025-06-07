import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Button,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getPrescriptions } from "../../redux/actions/getPrescriptionActions";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";

const PrescriptionList = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state); // Log the entire Redux state
  const { loading, data = [], error } = state.prescriptions || {}; // Safely access prescriptions

  useEffect(() => {
    dispatch(getPrescriptions());
  }, [dispatch]);

  
  console.log("Prescriptions State:", { loading, data, error }); // Debug log for prescriptions

 

  const handleGeneratePDF = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission Denied", "Storage permission is required to save the PDF.");
          return;
        }
      }

      const htmlContent = `
        <h1>Prescriptions</h1>
        <ul>
          ${data
            .map(
              (item) => `
                <li>
                  <strong>Patient:</strong> ${item.patientName || "N/A"} <br/>
                  <strong>Age:</strong> ${item.age || "N/A"} <br/>
                  <strong>Diagnosis:</strong> ${item.diagnosis || "N/A"} <br/>
                  <strong>Notes:</strong> ${item.notes || "N/A"} <br/>
                  <strong>Date:</strong> ${new Date(item.date).toLocaleDateString()} <br/>
                  <strong>Medications:</strong>
                  <ul>
                    ${
                      item.medications?.length
                        ? item.medications
                            .map(
                              (med) => `
                                <li>${med.name || "N/A"} - ${med.dosage || "N/A"} 
                                (${med.frequency || "N/A"}, ${med.duration || "N/A"})</li>
                              `
                            )
                            .join("")
                        : "<li>No Medications Prescribed</li>"
                    }
                  </ul>
                </li>
              `
            )
            .join("")}
        </ul>
      `;

      const file = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: "prescriptions",
        directory: "Documents",
      });

      Alert.alert("Success", `PDF generated at: ${file.filePath}`);

      await Share.open({
        title: "Share PDF",
        url: `file://${file.filePath}`,
        type: "application/pdf",
      });
    } catch (error) {
      Alert.alert("Error", "An error occurred while generating the PDF.");
      console.error(error);
    }
  };

  const renderPrescription = ({ item }) => (
    <View style={styles.prescriptionItem}>
      <Text style={styles.title}>Patient: {item.patientName || "N/A"}</Text>
      <Text>Age: {item.age || "N/A"}</Text>
      <Text>Diagnosis: {item.diagnosis || "N/A"}</Text>
      <Text>Notes: {item.notes || "N/A"}</Text>
      <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.subtitle}>Medications:</Text>
      {item.medications?.length ? (
        item.medications.map((med, index) => (
          <Text key={index}>{`${med.name || "N/A"} - ${med.dosage || "N/A"} (${med.frequency || "N/A"}, ${med.duration || "N/A"})`}</Text>
        ))
      ) : (
        <Text>No Medications Prescribed</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    Alert.alert("Error", error);
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id || item._id} // Use `id` or `_id` as the unique key
        renderItem={renderPrescription}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.buttonContainer}>
        <Button title="Generate and Share PDF" onPress={handleGeneratePDF} />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  listContent: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  prescriptionItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    color: "#555",
  },
  buttonContainer: {
    padding: 16,
  },
});

export default PrescriptionList;
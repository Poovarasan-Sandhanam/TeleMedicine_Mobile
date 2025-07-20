// @ts-ignore
import React, { useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getPrescriptions } from "../../redux/slices/prescriptionsSlice";
// @ts-ignore
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";
import { RootState } from "../../redux/store";

interface Medication {
  name?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
}

interface Prescription {
  id?: string;
  _id?: string;
  patientName?: string;
  age?: number;
  diagnosis?: string;
  notes?: string;
  date: string;
  medications?: Medication[];
}

const PatientPrescriptionScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, data = [], error } = useAppSelector((state: any) => state.prescriptions || {});

  useEffect(() => {
    dispatch(getPrescriptions() as any);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        {
          text: 'OK',
          onPress: () => {
            // Optionally retry fetching prescriptions
            dispatch(getPrescriptions() as any);
          },
        },
      ]);
    }
  }, [error, dispatch]);

  const handleGeneratePDF = useCallback(async () => {
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
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; text-align: center; }
              .prescription { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
              .medication { margin: 5px 0; padding-left: 20px; }
            </style>
          </head>
          <body>
            <h1>Prescriptions</h1>
            ${data
              .map(
                (item: Prescription) => `
                  <div class="prescription">
                    <h3>Patient: ${item.patientName || "N/A"}</h3>
                    <p><strong>Age:</strong> ${item.age || "N/A"}</p>
                    <p><strong>Diagnosis:</strong> ${item.diagnosis || "N/A"}</p>
                    <p><strong>Notes:</strong> ${item.notes || "N/A"}</p>
                    <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
                    <p><strong>Medications:</strong></p>
                    ${
                      item.medications?.length
                        ? item.medications
                            .map(
                              (med: Medication) => `
                                <div class="medication">
                                  • ${med.name || "N/A"} - ${med.dosage || "N/A"} 
                                  (${med.frequency || "N/A"}, ${med.duration || "N/A"})
                                </div>
                              `
                            )
                            .join("")
                        : "<p>No Medications Prescribed</p>"
                    }
                  </div>
                `
              )
              .join("")}
          </body>
        </html>
      `;

      const file = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: "prescriptions",
        directory: "Documents",
      });

      if (file.filePath) {
        Alert.alert("Success", `PDF generated successfully!`, [
          {
            text: 'Share',
            onPress: async () => {
              try {
                await Share.open({
                  title: "Share PDF",
                  url: `file://${file.filePath}`,
                  type: "application/pdf",
                });
              } catch (shareError) {
                Alert.alert("Error", "Failed to share PDF");
              }
            },
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while generating the PDF.");
      console.error(error);
    }
  }, [data]);

  const renderPrescription = useCallback(({ item }: { item: Prescription }) => (
    <View style={styles.prescriptionItem}>
      <Text style={styles.title}>Patient: {item.patientName || "N/A"}</Text>
      <Text style={styles.detail}>Age: {item.age || "N/A"}</Text>
      <Text style={styles.detail}>Diagnosis: {item.diagnosis || "N/A"}</Text>
      <Text style={styles.detail}>Notes: {item.notes || "N/A"}</Text>
      <Text style={styles.detail}>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.subtitle}>Medications:</Text>
      {item.medications?.length ? (
        item.medications.map((med: Medication, index: number) => (
          <Text key={index} style={styles.medication}>
            • {med.name || "N/A"} - {med.dosage || "N/A"} ({med.frequency || "N/A"}, {med.duration || "N/A"})
          </Text>
        ))
      ) : (
        <Text style={styles.noMedication}>No Medications Prescribed</Text>
      )}
    </View>
  ), []);

  const keyExtractor = useCallback((item: Prescription) => item.id || item._id || Math.random().toString(), []);

  const renderLoadingComponent = useMemo(() => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  ), []);

  if (loading) {
    return renderLoadingComponent;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderPrescription}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.generateButton} 
          onPress={handleGeneratePDF}
          activeOpacity={0.8}
        >
          <Text style={styles.generateButtonText}>Generate and Share PDF</Text>
        </TouchableOpacity>
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
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  detail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
    color: "#555",
  },
  medication: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    paddingLeft: 10,
  },
  noMedication: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  generateButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PatientPrescriptionScreen;
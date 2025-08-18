import { StyleSheet } from "react-native";
import COLORS from "../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  datePickerButton: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.text,
  },
  checkButton: {
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  checkButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
slotContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10, // For spacing between cards
  justifyContent: "flex-start",
  marginTop: 8,
},

slotCard: {
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 12,
  backgroundColor: "#f0f0f0",
  marginBottom: 10,
},

slotBookedCard: {
  backgroundColor: "#eee",
},

slotSelectedCard: {
  backgroundColor: COLORS.primary,
},

  reviewButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: "center",
  },
  reviewButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.primary,
  },
  modalText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: COLORS.danger,
    marginTop: 6,
    fontSize: 13,
    textAlign: "left",
  },
  aiButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  aiButtonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
});

export default styles;

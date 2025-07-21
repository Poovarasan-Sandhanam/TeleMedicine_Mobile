import { StyleSheet } from "react-native";
import COLORS  from '../constants/colors'; 


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
  dropdown: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  checkButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  checkButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
  slotsContainer: {
    marginBottom: 16,
  },
  slotsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  slotButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: COLORS.white,
  },
  slotButtonDisabled: {
    backgroundColor: COLORS.border,
    borderColor: COLORS.border,
  },
  slotButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  slotText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  selectedSlot: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.success,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    padding: 12,
    textAlignVertical: "top",
    fontSize: 15,
    color: COLORS.text,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: COLORS.error,
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  emptyImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
    tintColor: COLORS.border,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  aiButton: {
  backgroundColor: COLORS.primary,
  padding: 12,
  marginTop: 10,
  borderRadius: 8,
  alignItems: "center",
},
aiButtonText: {
  color: "#fff",
  fontWeight: "600",
},
  resultBox: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },

});

export default styles;

import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  datePickerButton: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  checkButton: {
    backgroundColor: '#06B6D4',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  slotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
    marginTop: 8,
  },

  slotCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  slotBookedCard: {
    backgroundColor: '#E2E8F0',
    opacity: 0.6,
  },

  slotSelectedCard: {
    backgroundColor: '#4F46E5',
    borderColor: '#4338CA',
  },
  slotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },

  reviewButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 16,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: 'rgba(79, 70, 229, 0.3)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  reviewButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '88%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
    color: '#0F172A',
  },
  modalText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#4F46E5',
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  errorText: {
    color: COLORS.danger,
    marginTop: 6,
    fontSize: 13,
    textAlign: 'left',
  },
  aiButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  aiButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default styles;

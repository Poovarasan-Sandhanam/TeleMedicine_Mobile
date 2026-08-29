import { StyleSheet, Platform } from 'react-native';
import Colors from '../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primaryBlue,
    marginBottom: 20,
    textAlign: 'center',
  },

  // Date selector container & styles
  datesContainer: {
    paddingBottom: 10,
  },
  dateCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: Colors.blackShadow,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  selectedDateCircle: {
    backgroundColor: Colors.primaryBlue,
    elevation: 6,
    shadowOpacity: 0.3,
  },
  todayDateCircle: {
    borderWidth: 2,
    borderColor: Colors.primaryBlue,
  },

  dateText: {
    fontSize: 20,
    fontWeight: '700',
  },
  dateTextDefault: {
    color: Colors.grayDark,
  },
  selectedDateText: {
    color: Colors.white,
  },

  dayText: {
    fontSize: 14,
    marginTop: 2,
  },
  dayTextDefault: {
    color: Colors.grayMedium,
  },

  selectedDateTextLabel: {
    fontWeight: 'bold',
  },
  selectedDateBannerText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primaryBlue,
    marginVertical: 24,
    textAlign: 'center',
  },

  loader: {
    marginTop: 40,
  },

  // Appointment list styles
  appointmentList: {
    paddingBottom: 50,
  },
  appointmentItem: {
    backgroundColor: Colors.white,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 0,
  },
  appointmentItemBorder: {
    borderBottomColor: Colors.lightBorder,
    borderBottomWidth: 1,
  },
  appointmentText: {
    fontSize: 17,
    color: Colors.grayDark,
    fontWeight: '600',
  },

  // No appointments card styles
  noAppointmentsCard: {
    backgroundColor: Colors.white,
    marginTop: 40,
    marginHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.blackShadow,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  noAppointmentsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primaryBlue,
    marginTop: 16,
  },
  noAppointmentsMessage: {
    fontSize: 16,
    color: Colors.grayMedium,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: Colors.modalShadow,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: Platform.OS === 'android' ? 10 : 0,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primaryBlue,
    marginBottom: 18,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 12,
    color: Colors.modalText,
    lineHeight: 22,
  },
  modalLabel: {
    fontWeight: '700',
    color: Colors.primaryBlue,
  },
  closeButton: {
    marginTop: 24,
    backgroundColor: Colors.primaryBlue,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});

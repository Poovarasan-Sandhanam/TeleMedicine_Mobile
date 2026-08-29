// styles/bookingScreenStyle.tsx

import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginVertical: 16,
    letterSpacing: -0.5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    paddingBottom: 24,
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: 'rgba(15, 23, 42, 0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'column',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  success: {
    backgroundColor: '#D1FAE5',
    color: '#059669',
  },
  pending: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
  },
  notesText: {
    marginLeft: 8,
    color: '#334155',
    fontSize: 13,
    fontWeight: '500',
  },
  payButton: {
    marginTop: 14,
    borderRadius: 12,
    overflow: 'hidden',
  },
  payButtonGradient: {
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
});

export default styles;

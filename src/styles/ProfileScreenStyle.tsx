import { StyleSheet, Platform } from 'react-native';
import COLORS  from '../constants/colors';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileTop: {
    alignItems: 'center',
    marginBottom: 28,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#4F46E5',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(79, 70, 229, 0.25)',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  change: {
    marginTop: 10,
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 14,
  },

  fieldRow: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 6,
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    fontWeight: '500',
  },

  value: {
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontWeight: '500',
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  btn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 24,
    marginBottom: 32,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(79, 70, 229, 0.3)',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

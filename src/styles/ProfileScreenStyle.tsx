import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants/colors';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileTop: {
    alignItems: 'center',
    marginBottom: 24,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  change: {
    marginTop: 10,
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  fieldRow: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 6,
    fontWeight: '500',
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: COLORS.white,
    color: COLORS.text,
  },

  value: {
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.card,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  btn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 32,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  btnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

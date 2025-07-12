import { StyleSheet, Platform } from 'react-native';
import COLORS  from '../constants/colors'; 

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    color: COLORS.primary,
    textAlign: 'center',
  },

  input: {
    height: 50,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.text,
    backgroundColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  inputError: {
    borderColor: COLORS.error,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginBottom: 10,
    marginTop: 2,
    paddingHorizontal: 4,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.text,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 17,
  },

  buttonDisabled: {
    backgroundColor: COLORS.textLight,
    opacity: 0.7,
  },

  contentText: {
    color: COLORS.primary,
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10,
    textDecorationLine: 'underline',
  },

  linkButton: {
    backgroundColor: 'transparent',
    marginTop: 10,
  },
});

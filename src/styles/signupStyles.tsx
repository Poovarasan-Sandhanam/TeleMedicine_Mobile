// screens/Signup/SignupStyles.js
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.light,
    color: COLORS.textDark,
    fontSize: 16,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.light,
  },
  inputTextDate: {
    color: COLORS.textDark,
    fontSize: 16,
  },
  placeholderText: {
    color: COLORS.textLight,
    fontSize: 16,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 10,
    fontSize: 13,
  },
  label: {
    color: COLORS.textDark,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 5,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.light,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
    color: COLORS.textDark,
    fontSize: 16,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  buttonText: {
    color: COLORS.light,
    fontWeight: '700',
    fontSize: 18,
  },
  contentText: {
    color: COLORS.textDark,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
  },
});

export default styles;

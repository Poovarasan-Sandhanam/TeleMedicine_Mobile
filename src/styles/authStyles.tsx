// src/styles/authStyles.ts
import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors'; // adjust path if needed

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    margin:20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: COLORS.text,
    textAlign: 'center',
  },
  inputText: {
    fontSize: 15,
    color: COLORS.text,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  // radio
  radioGroup: {
    flexDirection: 'row',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  radioOptionSelected: {
    borderRadius: 5,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: COLORS.text,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginLeft: 13,
    marginBottom: 10,
  },

  imagePic: {
    width: '100%',
    height: 275,
    alignSelf: 'center',
    marginVertical: 10,
  },

  toggleText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    padding: 4,
  },

  buttonContainer: {
    marginTop: 54,
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },

  linkText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
    color: COLORS.primary,
  },

  stickyButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 13,
  },

});

export default styles;

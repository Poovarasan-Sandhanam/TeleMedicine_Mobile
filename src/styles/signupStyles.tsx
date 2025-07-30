// screens/Signup/SignupStyles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  scroll: {
    padding: 24,
    paddingBottom: 100, // Room for sticky button
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#222',
    textAlign: 'center',
  },
  inputText: {
    fontSize: 15,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 30,
    margin:10
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#007bff',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#007bff',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    color: '#f00',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  stickyButton: {
   marginTop:50
  },
  linkText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
    color: '#007bff',
  },
  toggleText: {
  color: '#007bff',
  fontSize: 14,
  fontWeight: '500',
  padding: 4,
}

});

export default styles;


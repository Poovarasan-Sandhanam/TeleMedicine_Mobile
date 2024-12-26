// screens/Login/LoginStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffacd',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    margin: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
  },
  linkButton: {
    backgroundColor: 'transparent',
  },
});

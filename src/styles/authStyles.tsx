// src/styles/authStyles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  scroll: {
    padding: 24,
    justifyContent: 'center',
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
  buttonContainer: {
  marginTop: 24,
  borderRadius: 8,
  overflow: 'hidden',
},

button: {
  backgroundColor: '#0555abff', // Primary blue
  paddingVertical: 14,
  borderRadius: 8,
},

buttonTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#fff',
},

  
  linkText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
    color: '#1a69beff',
  },
  imagePic: {
  width: '100%',
  height: 320,
  marginTop: 20,
  marginBottom: 10,
  alignSelf: 'center',
},

});

export default styles;

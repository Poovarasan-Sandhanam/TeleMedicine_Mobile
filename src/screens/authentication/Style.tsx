// styles/styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fffacd',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  input: {
    height:50,
    borderWidth: 1.5,
    borderColor: '#000',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    backgroundColor: '#F3F3F3',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  passwordContainer: { 
    height:50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 8,
    backgroundColor:"#F3F3F3",
  },
  passwordInput: {
    flex: 1
  },
  contentText:{
    textAlign:"center",
    marginTop:20,
    color:"#007BFF",
    fontSize:15,
    fontWeight: 'bold',

  }
});

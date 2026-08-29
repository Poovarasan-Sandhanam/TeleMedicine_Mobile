import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  list: {
    paddingBottom: 40,
  },
  cardContainer: {
  flex:1,
  flexDirection:'row',
  backgroundColor: COLORS.card,
  borderRadius: 16,
  marginBottom: 20,
  padding: 18,
  shadowColor: COLORS.shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 4,
},

card: {
  flex:0.65,
  marginBottom: 16, // space between card and section
},

section: {
  flex:0.35,
alignSelf:'center',
},
cardImage: {
  width: '100%',
  height: 120,
  borderRadius: 10,
  marginBottom: 12,
},
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  value: {
    fontWeight: '400',
    color: COLORS.textLight,
  },
  button: {
    width:'90%',
    bottom:25,
    backgroundColor: COLORS.primary,
    paddingVertical:20,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf:'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 16,
    marginTop: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default styles;

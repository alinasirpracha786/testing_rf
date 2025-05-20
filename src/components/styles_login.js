import {
  StyleSheet
} from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    flexDirection: 'column',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBottom: 90
  },
  logo: {
    width: 128,
    height: 128
  },
  title: {
    color: '#212529',
    fontSize: 28,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9
  },
  subTitle: {
    color: '#212529',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 0,
    opacity: 0.9
  },
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    height: 200,
    padding: 20,
    marginTop: 0
    // backgroundColor: 'red'
  },
  input: {
    height: 40,
    backgroundColor: '#ffffff',
    color: '#495057',
    marginBottom: 20,
    paddingHorizontal: 10
  },
  buttonContainer: {
    backgroundColor: '#0062cc',
    paddingVertical: 15
  },
  buttonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18
  },
  spinnerTextStyle: {
    color: '#fff',
    fontSize: 30
  },


})

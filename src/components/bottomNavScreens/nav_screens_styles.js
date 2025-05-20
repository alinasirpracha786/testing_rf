import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    flexDirection: 'column',
  },
  pickerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  pickerLabel: {
    paddingTop: 15,
    paddingLeft: 10,
    // textAlign: 'left',
    flex: 1,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
  },
  pickerItself: {
    flex: 3,
    alignItems: 'flex-start',
    paddingLeft: 0,
    marginLeft: 0,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
  },
  logoContainer: {
    alignItems: 'center',
    // justifyContent: 'center',
    flex: 1,
  },
  title: {
    color: '#212529',
    fontSize: 28,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  subTitle: {
    color: '#212529',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 0,
    opacity: 0.9,
  },
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
    padding: 20,
    marginTop: 0,
    // backgroundColor: 'red'
  },
  buttonContainer: {
    backgroundColor: '#0062cc',
    paddingVertical: 15,
  },
  buttonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

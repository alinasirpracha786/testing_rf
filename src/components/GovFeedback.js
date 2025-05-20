import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import SearchableDropdown from 'react-native-searchable-dropdown';


import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import { Button } from 'react-native-elements';
import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from 'react-native-material-textfield';

import Icon from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import Modal, {
  ModalTitle,
  SlideAnimation,
  ModalContent,
} from 'react-native-modals';
import { FlatList } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import axios from 'axios';
import { color, log } from 'react-native-reanimated';
import { NavigationContext, NavigationContainer } from 'react-navigation';

class GovFeedback extends Component {

  sendFeedbackToServer = () => {
    if (this.state.selectedType === 'Select feedback type') {
      Alert.alert('Incomplete Form', 'Please select feedback type.');
      return;
    } else if (this.state.feedbackText.length === 0) {
      Alert.alert('Incomplete Form', 'Please provide your feedback');
      return;
    } else {
      this.setState({ showSpinner: true });
      console.log('here is the user_id: ', this.state.user.user_id);
      const url = this.state.apiHost;
      return fetch(url, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: "feedback_type=" + this.state.selectedType + "&comments=" + this.state.feedbackText + "&user_id=" + this.state.user.user_id
      })
        .then(response => response.text())
        .then((text) => {
          text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          return text;
        }).then(responseJs => {
          let res = JSON.parse(responseJs);

          setTimeout(() => {
            this.setState({ showSpinner: false });
          }, this.state.spinnerTimeOutValue);

          if (res['status'] == 'failed') {
            Alert.alert(
              'Operation Failed',
              res['response'],
              [
                {
                  text: 'OK',
                  onPress: () => {
                    this.props.navigation.goBack(null);
                  }
                }
              ],
              {
                cancelable: true,
                onDismiss: () => {

                  this.props.navigation.goBack(null);
                }
              }
            );
          } else {
            Alert.alert(
              'Feedback Submitted',
              'Thank you for your feedback.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    this.props.navigation.goBack(null);
                  }
                }
              ],
              {
                cancelable: true,
                onDismiss: () => {

                  this.props.navigation.goBack(null);
                }
              }
            );
          }

        })
        .catch(err => { });
    }
  };

  getTypeData = () => {
    let data = [
      {
        value: 'Whistle blowing',
      },
      {
        value: 'Suspected activity',
      },
      {
        value: 'Information disclosure',
      },
      {
        value: 'Grievance',
      },
      {
        value: 'Customer experience improvement',
      }
    ];
    this.setState({ typeData: data });
  };


  componentDidMount() {
    this.getTypeData();
  }

  constructor(props) {
    super(props);

    this.state = {
      user: this.props.navigation.getParam('user', null),
      selectedType: 'Select feedback type',
      feedbackText: '',
      showSpinner: false,
    };

  }

  render() {

    const {
      spinnerTextStyle
    } = styles;

    return (
      <SafeAreaView>
        <View
          style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>

          <Header companyName={"Governance Feedback Form"} />

          <Spinner
            visible={this.state.showSpinner}
            textContent={'Sending Feedback'}
            textStyle={spinnerTextStyle}
            color='#fff'
            overlayColor='rgba(0, 0, 0, 0.5)'
            size='large'
            animation='fade'
          />

          <View style={styles.pickerWrapper}>
            <Dropdown
              data={this.state.typeData}
              onChangeText={value => {
                this.setState({ selectedType: value }, () => {
                  //console.log(this.state.selectedType);
                });
              }}
              containerStyle={{ padding: 0 }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: '#eee',
                borderColor: '#8dc540',
                borderWidth: 1,
                overflow: 'scroll'
              }}
              itemTextStyle={{ color: '#000' }}
              itemsContainerStyle={{ maxHeight: 800, overflow: 'scroll' }}
              // defaultIndex={2}
              //resetValue={false}
              placeholder="Select feedback type"
              textInputProps={
                {
                  placeholder: this.state.selectedType,
                  underlineColorAndroid: "transparent",
                  style: {
                    padding: 2,
                    fontSize: 16
                  },
                }
              }
              listProps={
                {
                  nestedScrollEnabled: true,
                  overflow: 'scroll'
                }
              }
              value={this.state.selectedType}

            />
          </View>


          <View
            style={{ marginHorizontal: 20 }}>

            <OutlinedTextField
              label='Type comment here...'
              autoCorrect={false}
              multiline={true}
              onChangeText={text => this.setState({ feedbackText: text })}
              animationDuration={1000}
              autoCapitalize='none'

            />

          </View>

          <View
            style={{ marginHorizontal: 20, backgroundColor: '#FF1493', borderRadius: 10, marginTop: 10 }}>
            <Button
              title='Submit Feedback'
              color='#FF1493'
              onPress={() => this.sendFeedbackToServer()}
            />
          </View>

        </View>
      </SafeAreaView>
    );
  }
}


export const Header = ({ companyName }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{companyName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    // flex: 1,
    shadowColor: '#000',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  stripStyle: {
    backgroundColor: 'limegreen',
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 10,
    marginTop: 7,
    borderRadius: 2,
  },

  dataHeaderText: {
    color: '#FFF',
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginVertical: 5,
  },

  pickerWrapperSearch: {
    borderRadius: 8,
    marginTop: 60,
    marginHorizontal: 20,
    borderColor: 'grey',
    borderWidth: 1,
    justifyContent: 'center',
    padding: 8,
  },

  pickerWrapper: {
    borderRadius: 8,
    borderColor: 'grey',
    borderWidth: 1,
    height: 50,
    justifyContent: 'flex-end',
    marginTop: 30,
    marginHorizontal: 20,
    marginBottom: 15,
    paddingTop: 7,
    paddingRight: 12,
    paddingLeft: 12,
  },

  headerTitle: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 10,
    color: '#ed0281',
  },

  subTitleStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 14,
    color: '#ed0281',
  },

});

export default GovFeedback;

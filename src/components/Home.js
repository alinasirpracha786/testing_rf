import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Modal,
  TouchableHighlight,
  Alert,
  KeyboardAvoidingView
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import OptionsMenu from "react-native-options-menu";
import * as SecureStore from 'expo-secure-store';
// import Modal, { ModalFooter, ModalTitle, SlideAnimation, ModalContent } from 'react-native-modals';

import RemotePushController from '../services/RemotePushController'

import PushNotification from 'react-native-push-notification'
import { log } from 'react-native-reanimated';
import JailMonkey from 'jail-monkey';

export default class Home extends Component {

  getHQaccounts = () =>{
     
    // var obj = JSON.parse(this.state.userdvr);
     //console.log('here is the user_id: ', this.state.user.seller_id);
    //let jwt = await this._get("jwt");
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    //myHeaders.append('Authorization', jwt);CMISB00133
 
    return fetch('https://gcssbi.zong.com.pk/index.php/summary/HQAccountsperseller?seller_id='+this.state.user.seller_id, {
      method: 'GET',
      headers: myHeaders
    }).then(response => response.text())
      .then((text) => {
        
        text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
        return text;
      })
      .then(myData => {
        
        
       let res = JSON.parse(myData);
     
      if(res.companyname[0] == undefined)
      
    {
     
      Alert.alert(
        'No HQ Driven Account Tagged',
        'Please add visit as new account',
        [
          {
            text: 'OK',
            onPress: () => {
              this.props.navigation.goBack('DVR');
            //  this.props.navigation.navigate('DVR');
            //  this.props.navigation.navigate('Home', { go_back_key: this.state.key });
            }
          }
        ],
        {
          cancelable: true,
          onDismiss: () => {

           // this.props.navigation.goBack(Home);
          }
        }
      );
    
    }
       else{
         this.props.navigation.navigate('leadoptionshq',{
          //userids: this.props.navigation.getParam('user', null).user_id,
         
          lat_info: this.props.navigation.getParam('latitude', null),
          long_info: this.props.navigation.getParam('longitude', null),
          address_info: this.props.navigation.getParam('locationname', null),
          user: this.props.navigation.getParam('user', null)
        });
       
       }
      

      })
      .catch(err => {  
         //console.log('kkf',res.companyname[i]);
          this.setState({getaccounttypeval:'New Account'});
       
        console.log(err) });
  };
  getDVRData = () =>{
     
    //let jwt = await this._get("jwt");
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    //myHeaders.append('Authorization', jwt);
    // console.log(this.state.user.user_id);
    return fetch('https://gcssbi.zong.com.pk/index.php/summary/checklead?user_id='+this.state.user.user_id, {
      method: 'GET',
      headers: myHeaders
    }).then(response => response.text())
      .then((text) => {
        text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
        return text;
      })
      .then(myData => {
        
        let res = JSON.parse(myData);
        //console.log('undefine',res.userid[0]);
        if(res.userid[0] == null) {
          //handler either not an array or empty array
         // console.log('dkd');
         // console.log(myData.length);
          this.props.navigation.navigate('DVR');
      }
        else{
        //  console.log('leadopen');
          this.props.navigation.navigate('leadopen',{
            userids: this.props.navigation.getParam('user', null).user_id,
          });
          
        }
       
      })
      .catch(err => { console.log(err) });
  };

 
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const locinfo = params ? params.userids : null;
    if (JailMonkey.isJailBroken()) {
      // Alternative behaviour for jail-broken/rooted devices.
      BackHandler.exitApp();
    }

    this.state = {
      user:this.props.navigation.getParam('user', null),
      username: '',
      password: '',
      showSpinner: false,
      modal_changePasswordVisibility: false,
      updatePassword_current_password: '',
      updatePassword_new_password: '',
      updatePassword_confirm_new_password: '',
      isRoleRDorHQ: false,
      android_version_code: this.props.navigation.getParam('user', null).android_version_code,
      ios_build: this.props.navigation.getParam('user', null).ios_build,
      hqdrivenarray:[],
    };
   ////console.warn("in Home");
      this.props.navigation.getParam('user', null).role == "hq" ||
      this.props.navigation.getParam('user', null).role == "rd" ||
      this.props.navigation.getParam('user', null).role == "coordinator_for_rd"
      ? this.state.isRoleRDorHQ = true
      : this.state.isRoleRDorHQ = false

      ////console.warn(this.state.isRoleRDorHQ);
    //to send log when notification is received
    //when app is minimised
    PushNotification.popInitialNotification((notification) => {
      //console.log(notification);

      if (typeof notification !== 'undefined' && notification !== null) {

        ////console.warn("BACKGROUND");

        setTimeout(() => {
          this.sendLog({
            "username": this.props.navigation.getParam('user', null).username,
            "event": "open",
            "cause": "notification received",
            "jwt": this.props.navigation.getParam('user', null).jwt,
            "location": "background",
            "apiHost": this.props.navigation.getParam('user', null).apiHost,
            "android_version_code": this.props.navigation.getParam('user', null).android_version_code,
            "ios_build": this.props.navigation.getParam('user', null).ios_build,
          });
        }, 1000);
      }
    })
  }

  static navigationOptions = {
    header: null,
  };

  _dispatch = (tile, role) => {

    if (role == "TEAMLEAD") {
      role = "TL";
    }

    switch (role) {
      case 'TEAMLEAD':
        role = "TL";
        break;

      case 'SELLER':
        role = "Seller";
        break;
    }

 /*   switch (tile) {
      case 'MTD':
        tile = "MTD";
        break;
        case 'DVR':
          tile = "DVR";
          break;
          case 'DVR_daily':
            tile = "DVR_daily";
            break;
      
    }*/

    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=");


    //console.warn('\n 1. tile: ' + tile + '\n 2. role: ' + role);

    //console.warn('\n 1. Drawer' + role + '\n 2. Dashboard' + role + tile + '\n 3. ' + role + 'Performance');

    //console.warn("tile is 2: ", tile);

    this.props.navigation.dispatch(
      NavigationActions.navigate({
        routeName: 'Drawer' + role,
        params: {
          user: this.props.navigation.getParam('user', null),
          imageURL: this.props.navigation.getParam('imageURL', null),
          imageFlag: this.props.navigation.getParam('imageFlag', null),
        },
        action: NavigationActions.navigate({
          routeName: 'Dashboard' + role + tile,
          params: {
            user: this.props.navigation.getParam('user', null),
            imageURL: this.props.navigation.getParam('imageURL', null),
            imageFlag: this.props.navigation.getParam('imageFlag', null),
          },
          action: NavigationActions.navigate({            
            routeName: role + 'Performance',
            params: {
              user: this.props.navigation.getParam('user', null),
              imageURL: this.props.navigation.getParam('imageURL', null),
              imageFlag: this.props.navigation.getParam('imageFlag', null),
            },
          })
        }),
      }),
    );
  }

  
  onTilePress = (tile) => {
     console.warn(tile);
     
    user = this.props.navigation.getParam('user', null)

    if (typeof user.username !== 'undefined' && user.username !== null) {
     
      if (user.role == "coordinator_for_rd") {
        this._dispatch(tile.toUpperCase(), "RD".toUpperCase());
      }
      else {       
        this._dispatch(tile.toUpperCase(), user.role.toUpperCase());
      }

      setTimeout(() => {
        this.setState({ showSpinner: false });
      }, user.spinnerTimeOutValue);
    }
  }

  changePassword = () => {

    ////console.warn("change password called");
    this.setState({ modal_changePasswordVisibility: !this.state.modal_changePasswordVisibility });
  }

  callChangePasswordService = () => {

    ////console.warn("called");

    if (this.state.updatePassword_current_password == "") {
      Alert.alert('Validation Error', 'Current password field is empty', [
        {
          text: 'Close',
        },
      ]);

      return false;
    }

    if (this.state.updatePassword_new_password == "") {
      Alert.alert('Validation Error', 'New password field is empty', [
        {
          text: 'Close',
        },
      ]);

      return false;
    }

    if (this.state.updatePassword_new_password != this.state.updatePassword_confirm_new_password) {
      Alert.alert('Validation Error', 'New passwords do not match', [
        {
          text: 'Close',
        },
      ]);

      return false;
    }

    this.setState({ showSpinner: true });


    // const apiHost = 'https://gcssbi.zong.com.pk/index.php';
    const apiHost = this.props.navigation.getParam('user', null).apiHost;

    const url = apiHost + '/user/change_password';
    ////console.warn(url);

    return fetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.props.navigation.getParam('user', null).jwt
      }),
      body: "username=" + this.props.navigation.getParam('user', null).username + "&current_password=" + this.state.updatePassword_current_password + "&new_password=" + this.state.updatePassword_new_password // <-- Post parameters
    })
      .then(response => response.text())
      .then((text) => {
        text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
        return text;
      })
      .then(responseJs => {

        let responseJson = JSON.parse(responseJs);
        // reply = responseJson;
        ////console.warn('reply', responseJson);

        if (responseJson.status) {
          //console.log("successfully changed")
          this.setState({ showSpinner: false });
          this.setState({ modal_changePasswordVisibility: false });
          this.setState({ updatePassword_current_password: '' });
          this.setState({ updatePassword_new_password: '' });
          this.setState({ updatePassword_confirm_new_password: '' });
          Alert.alert('Request Complete', 'Password updated successfully', [
            {
              text: 'Close',
              onPress: () => this.logoutTheUser(),
            },
          ]);

        } else {
          this.setState({ showSpinner: false });
          Alert.alert('Request Incomplete', 'Password not updated', [
            {
              text: 'Try again',
            },
          ]);
        }
      })
      .catch((error) => {
        ////console.warn(error);
        this.setState({ showSpinner: false });
        Alert.alert('Login Error', 'Unexpected error occurred. Please report to GCSS BI Team.', [
          {
            text: 'Try again',
          },
        ]);
      });
  }

  logoutTheUser = () => {

    try {
      // //console.log("JWTTTTTTTTTTTTTTTTTTTTTTTTTTTT: ", responseJson.jwt);

      this._delete("jwt");
      //console.log("DELETE ITEM SUCCESSFUL");

    } catch (error) {
      //console.log("DELETE ITEM ERROR", error);

    }


    ////console.warn("logout user called");

    this.props.navigation.navigate('login', {
      redirectCode: 301,
      username: this.props.navigation.getParam('user', null).username,
      jwt: this.props.navigation.getParam('user', null).jwt,
      location: "Home"
    })
  }

  sendLog = (paramObj) => {
    const url = paramObj.apiHost + '/user/write_log';
   console.warn("LOG CALL URL: ", url, " and jwt is > > > > > > > > > > : ", paramObj.jwt);

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeaders.append('Authorization', paramObj.jwt);


    return fetch(url, {

      method: 'POST',
      headers: myHeaders,
      body: "username=" + paramObj.username + "&event=" + paramObj.event + "&cause=" + paramObj.cause + "&token=not sent due to security reasons" + "&description=" + paramObj.location + "&platform=" + Platform.OS + "&version=" + (Platform.OS === 'android' ? paramObj.android_version_code : paramObj.ios_build) // <-- Post parameters

    }).then(response => response.text())
      .then((text) => {
        text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
        console.log(text);
        return text;
      })
      .then(responseJs => {

        let responseJson = JSON.parse(responseJs);
        ////console.warn("NOTIFICATION RESPONSE JSON", responseJson);

        // ////console.warn("RESPONSE ::::::::::::::::::::::::", responseJson);


        if (responseJson.status == 200) {
          ////console.warn("NOTIFICATION log sent and written with response: ", responseJson.msg);
        } else {

          ////console.warn("NOTIFICATION log sent but NOT WRITTEN with response: ", responseJson.msg);
        }

      })
      .catch(error => {
        ////console.warn("error occured in sending NOTIFICATION log with details username= '" + paramObj.username + "' & event= '" + paramObj.event + "' & cause= '" + paramObj.cause + "'");

      })
  }

  doNothing = () => {
    ////console.warn("did nothing");

  }


  doFocus = () => {
    ////console.warn("do Focus");

    this.myTextInput.focus()
  }


  _delete = async (key, value) => {
    await SecureStore.deleteItemAsync(key);
  };


  render() {

    return (

      <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>

        <Spinner
          visible={this.state.showSpinner}
          textContent={'Requesting'}
          textStyle={{ color: '#fff', fontSize: 30 }}
          color='#fff'
          overlayColor='rgba(0, 0, 0, 0.5)'
          size='large'
          animation='fade'
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modal_changePasswordVisibility}
          onRequestClose={() => {
            this.setState({ modal_changePasswordVisibility: false })
          }}
        >

          <KeyboardAvoidingView behavior="padding" style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000070',
          }}>

            <View style={{
              height: 300,
              backgroundColor: '#fff',
              padding: 20,
              paddingBottom: 0,
              // borderWidth: 1,
              // borderColor: "#ed0281",
              // borderStyle: "solid",
              borderRadius: 5
            }}>
              <ScrollView keyboardShouldPersistTaps="handled">
                <TextInput
                  style={{ height: 35, backgroundColor: '#ffffff', color: '#495057', marginTop: 20, marginHorizontal: 10, marginBottom: 20, borderWidth: 1, borderColor: "#ddd", borderStyle: "solid", borderRadius: 4 }}
                  placeholder="Current Password"
                  placeholderTextColor="#495057"
                  returnKeyType="next"
                  secureTextEntry
                  autoCorrect={false}
                  autoFocus={false}
                  value={this.state.updatePassword_current_password}
                  onChangeText={text => this.setState({ updatePassword_current_password: text })}
                />

                <TextInput
                  style={{ height: 35, backgroundColor: '#ffffff', color: '#495057', marginHorizontal: 10, marginBottom: 20, borderWidth: 1, borderColor: "#ddd", borderStyle: "solid", borderRadius: 4 }}
                  placeholder="New Password"
                  placeholderTextColor="#495057"
                  returnKeyType="next"
                  secureTextEntry
                  autoCorrect={false}
                  autoFocus={false}

                  value={this.state.updatePassword_new_password}
                  onChangeText={text => this.setState({ updatePassword_new_password: text })}
                />

                <TextInput
                  style={{ height: 35, backgroundColor: '#ffffff', color: '#495057', marginHorizontal: 10, borderWidth: 1, borderColor: "#ddd", borderStyle: "solid", borderRadius: 4 }}
                  placeholder="Confirm New Password"
                  placeholderTextColor="#495057"
                  returnKeyType="go"
                  secureTextEntry
                  autoFocus={false}
                  autoCorrect={false}
                  value={this.state.updatePassword_confirm_new_password}
                  onChangeText={text => this.setState({ updatePassword_confirm_new_password: text })}
                />

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 20 }}>

                  <TouchableOpacity onPress={this.callChangePasswordService} style={{ height: 40, width: "40%", borderColor: "#0062cc", borderWidth: 1, borderRadius: 3, borderStyle: "solid", backgroundColor: "#0062cc" }} rejectResponderTermination>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text style={{ textAlign: 'center', alignSelf: 'center', color: "white" }}>Update</Text>
                    </View>
                  </TouchableOpacity>


                  <TouchableOpacity onPress={() => { this.setState({ modal_changePasswordVisibility: false }) }} style={{ height: 40, width: "40%", borderColor: "#dc3545", borderWidth: 1, borderRadius: 3, borderStyle: "solid", backgroundColor: "white" }} rejectResponderTermination>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text style={{ textAlign: 'center', alignSelf: 'center', color: "#dc3545" }}>Cancel</Text>
                    </View>
                  </TouchableOpacity>

                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <ScrollView forceInset={{ top: 'always', horizontal: 'never' }}>
          <TouchableOpacity style={{ position: 'absolute', right: 10, top: 30 }} >
            <View>
              <OptionsMenu
                customButton={<Icon name="chevron-circle-down" size={30} color="#ccc" />}
                destructiveIndex={1}
                options={["Change Password", "Logout", "Cancel"]}
                actions={[this.changePassword, this.logoutTheUser, this.doNothing]} />
            </View>
          </TouchableOpacity>
          <View style={{ height: 350, alignItems: 'center', justifyContent: 'center', marginTop: 40, marginBottom: 10 }}>
            <Text style={{ color: "#8dc540", fontWeight: '100', fontSize: 25, textAlign: 'center' }}>Welcome to</Text>
            <Text style={{ color: "#ed0281", fontWeight: '100', fontSize: 30, textAlign: 'center', marginBottom: 40 }}>GCSS BI App!</Text>

            {
              this.props.navigation.getParam('imageFlag', null)
                ? <Image source={{ uri: this.props.navigation.getParam('imageURL', null) }} style={{ height: 150, width: 150, alignSelf: 'center', borderRadius: 100, borderColor: '#ed0281', borderWidth: 1 }}></Image>
                : <Icon raised="true" reverse="true" reverseColor="white" name="user-tie" size={150} style={[{ color: "#8dc540" }]} solid />
            }

            <Text style={{ color: "#ed0281", fontWeight: 'bold', fontSize: 20 }}>{this.props.navigation.getParam('user', null).name}</Text>
            <Text style={{ color: "#aaa" }}>{this.props.navigation.getParam('user', null).username}</Text>
          </View>

          <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <View style={styles.container}>

              <TouchableOpacity onPress={() => this.onTilePress("mtd")}>
                <View style={styles.outerView}>
                  <Icon name={"calendar-day"} size={35} style={styles.icon} />
                  <View style={styles.innerView}>
                    <Text style={styles.tileText}>MTD Performance</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                //  console.warn("home Tab click on latitude",this.props.navigation.getParam('latitude', null));
                //  console.warn("home Tab click on leadoptions",this.props.navigation.getParam('longitude', null));
               //   console.warn("home Tab click on leadoptions",this.props.navigation.getParam('latitude', null));
                  ////console.warn("REDIRECT CODE :: govfeedback",this.props.navigation.getParam('user', null).user_id);
                  this.props.navigation.navigate('leadoptions',{
                    //userids: this.props.navigation.getParam('user', null).user_id,
                   
                    lat_info: this.props.navigation.getParam('latitude', null),
                    long_info: this.props.navigation.getParam('longitude', null),
                    address_info: this.props.navigation.getParam('locationname', null),
                    user: this.props.navigation.getParam('user', null)
                  });
             // this.getDVRData();
                 // //console.warn("REDIRECT CODE :: govfeedback");
                  // this.props.navigation.navigate('GovFeedback');
                }}>
                  <View style={styles.outerView}>
                    <Icon name={"comment"} size={35} style={styles.icon} />
                    <View style={styles.innerView}>
                      <Text style={styles.tileText}>Daily Visit Entry</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                
              
                <TouchableOpacity onPress={() => {
                //  console.warn("home Tab click on leadoptions",this.state.hqdrivenarray);
                  //console.warn("home Tab click on leadoptions",this.props.navigation.getParam('longitude', null));
                  //console.warn("home Tab click on leadoptions",this.props.navigation.getParam('locationname', null));
                  ////console.warn("REDIRECT CODE :: govfeedback",this.props.navigation.getParam('user', null).user_id);
                 
                    this.getHQaccounts();
                  
                 
             // this.getDVRData();
                 // //console.warn("REDIRECT CODE :: govfeedback");
                  // this.props.navigation.navigate('GovFeedback');
                }}>
                  <View style={styles.outerView}>
                    <Icon name={"comment"} size={35} style={styles.icon} />
                    <View style={styles.innerView}>
                      <Text style={styles.tileText}>HQ Driven Accounts</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => this.onTilePress("mom_performance")}>
                <View style={styles.outerView}>
                  <Icon name={"calendar-day"} size={35} style={styles.icon} />
                  <View style={styles.innerView}>
                    <Text style={styles.tileText}>Seller Performance</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.onTilePress("dormancy")}>
                <View style={styles.outerView}>
                  <Icon name={"exclamation-triangle"} size={35} style={styles.icon} />
                  <View style={styles.innerView}>
                    <Text style={styles.tileText}>Dormancy</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {
                (this.state.isRoleRDorHQ)
                  ?

                  <TouchableOpacity onPress={() => this.onTilePress("tva")}>
                    <View style={styles.outerView}>
                      <Icon name={"crosshairs"} size={35} style={styles.icon} />
                      <View style={styles.innerView}>
                        <Text style={styles.tileText}>Target vs Achievement</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  :
                  null
              }

              <TouchableOpacity onPress={() => this.onTilePress("charging")}>
                <View style={styles.outerView}>
                  <Icon name={"credit-card"} size={35} style={styles.icon} />
                  <View style={styles.innerView}>
                    <Text style={styles.tileText}>Last 03 Days Charging</Text>
                  </View>
                </View>
              </TouchableOpacity>
           


              {/*
              <TouchableOpacity onPress={() => this.onTilePress("gen_feedback")
            }>
                
                <View style={styles.outerView}>
                  <Icon name={"comment-dots"} size={35} style={styles.icon} />
                  <View style={styles.innerView}>
                    <Text style={styles.tileText}>General Feedback</Text>
                  </View>
                </View>
              </TouchableOpacity> {
                ["irfan", "shayan.safdar", "jibran.afzaal", "farooq.raza", "adi.gcss", "salman.yaseen", "shakeel.rehman",
                  "nabiha.iqbal", "farrukh.hassan", "harris.saeed", "hamza.muhammad", "farhan.zakir", "sameer.mughal",
                  "salman.ahmad", "wei.chenggang", "ahmer.hussain", "rizwan.khalil", "saad.anwar", "muzzamil.habib",
                  "osman.sheikh", "tahir.afridi", "jawad.khan.khattak"].map(data => (
                  data === this.props.navigation.getParam('user', null).username ?
                    <TouchableOpacity onPress={() => {
                      this.props.navigation.navigate('AccountWise', {
                        user: this.props.navigation.getParam('user', null)
                      })
                      // this.props.navigation.navigate('AccountWise');
                    }}>
                      <View style={styles.outerView}>
                        <Icon name={"table"} size={35} style={styles.icon} />
                        <View style={styles.innerView}>
                          <Text style={styles.tileText}>Account Wise Summary</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    : null
                ))

              } */}

              {
                this.props.navigation.getParam('user', null).is_account_wise ? <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate('AccountWise', {
                  //this.props.navigation.navigate('sellerloc', {
                    user: this.props.navigation.getParam('user', null)
                  })
                 // //console.warn("REDIRECT CODE :: dvr_form ");
                  // this.props.navigation.navigate('AccountWise');
                }}>
                  <View style={styles.outerView}>
                    <Icon name={"table"} size={35} style={styles.icon} />
                    <View style={styles.innerView}>
                      <Text style={styles.tileText}>Account Wise Summary</Text>
                    </View>
                  </View>
                </TouchableOpacity> : null
              }
  
              {/* {
                ["irfan", "shayan.safdar", "jibran.afzaal", "farooq.raza", "adi.gcss", "salman.yaseen", "shakeel.rehman", "nabiha.iqbal", "farrukh.hassan", "harris.saeed", "hamza.muhammad", "farhan.zakir", "sameer.mughal", "salman.ahmad", "wei.chenggang", "ahmer.hussain", "rizwan.khalil", "saad.anwar", "muzzamil.habib", "osman.sheikh", "tahir.afridi", "jawad.khan.khattak"].map(data => (
                  data === this.props.navigation.getParam('user', null).username ?
                    <TouchableOpacity onPress={() => {
                      this.props.navigation.navigate('BusinessSummary', {
                        user: this.props.navigation.getParam('user', null)
                      })
                      // this.props.navigation.navigate('AccountWise');
                    }}>
                      <View style={styles.outerView}>
                        <Icon name={"list"} size={35} style={styles.icon} />
                        <View style={styles.innerView}>
                          <Text style={styles.tileText}>Business Summary</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    : null
                ))

              } */}
              {
                this.props.navigation.getParam('user', null).is_hq_user ? <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate('BusinessSummary', {
                    user: this.props.navigation.getParam('user', null)
                  })
                   this.props.navigation.navigate('BusinessSummary');
                }}>
                  <View style={styles.outerView}>
                    <Icon name={"list"} size={35} style={styles.icon} />
                    <View style={styles.innerView}>
                      <Text style={styles.tileText}>Business Summary</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                  : null
              }

              {/* {
                ["irfan", "shayan.safdar", "jibran.afzaal", "farooq.raza", "adi.gcss", "salman.yaseen", "shakeel.rehman", "nabiha.iqbal", "farrukh.hassan", "harris.saeed", "hamza.muhammad", "farhan.zakir", "sameer.mughal", "salman.ahmad", "wei.chenggang", "ahmer.hussain", "rizwan.khalil", "saad.anwar", "muzzamil.habib", "osman.sheikh", "tahir.afridi", "jawad.khan.khattak"].map(data => (
                  data === this.props.navigation.getParam('user', null).username ?
                    <TouchableOpacity onPress={() => {
                      this.props.navigation.navigate('GovFeedback', {
                        user: this.props.navigation.getParam('user', null)
                      })
                      // this.props.navigation.navigate('AccountWise');
                    }}>
                      <View style={styles.outerView}>
                        <Icon name={"comment"} size={35} style={styles.icon} />
                        <View style={styles.innerView}>
                          <Text style={styles.tileText}>Gov. Feedback</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    : null
                ))

              } */}

<TouchableOpacity onPress={() => this.onTilePress("gen_feedback")}>
                <View style={styles.outerView}>
                  <Icon name={"calendar-day"} size={35} style={styles.icon} />
                  <View style={styles.innerView}>
                    <Text style={styles.tileText}>DVR Summary Daily</Text>
                  </View>
                </View>
              </TouchableOpacity>
     

          {/* <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>

            <TouchableOpacity onPress={() => this.onTilePress("mtd")} style={{ height: 100, width: 170, borderColor: "#ed0281", borderWidth: 1, borderRadius: 10, borderStyle: "solid" }}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center', alignSelf: 'center', color: "#8dc540", fontWeight: 'bold', fontSize: 20 }}>MTD{"\n"}Performance</Text>
              </View>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => this.onTilePress("mom")} style={{ height: 100, width: 170, borderColor: "#ed0281", borderWidth: 1, borderRadius: 10, borderStyle: "solid" }}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center', alignSelf: 'center', color: "#8dc540", fontWeight: 'bold', fontSize: 20 }}>MOM{"\n"}Performance</Text>
              </View>
            </TouchableOpacity>

          </View>


          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>

            <TouchableOpacity onPress={() => this.onTilePress("dormancy")} style={{ height: 100, width: 170, borderColor: "#ed0281", borderWidth: 1, borderRadius: 10, borderStyle: "solid" }}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center', alignSelf: 'center', color: "#8dc540", fontWeight: 'bold', fontSize: 20 }}>Dormancy</Text>
              </View>
            </TouchableOpacity>

            {
              (this.state.isRoleRDorHQ)
                ?
                <TouchableOpacity onPress={() => this.onTilePress("tva")} style={{ height: 100, width: 170, borderColor: "#ed0281", borderWidth: 1, borderRadius: 10, borderStyle: "solid" }}>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', alignSelf: 'center', color: "#8dc540", fontWeight: 'bold', fontSize: 20 }}>Target{"\n"}vs{"\n"}Achievement</Text>
                  </View>
                </TouchableOpacity>
                :
                null
            }

          </View> */}
<TouchableOpacity onPress={() => this.onTilePress("DVR")}>
                <View style={styles.outerView}>
                  <Icon name={"calendar-day"} size={35} style={styles.icon} />
                  <View style={styles.innerView}>
                    <Text style={styles.tileText}>DVR Summary Monthly</Text>
                  </View>
                </View>
              </TouchableOpacity>
              </View>
          </View>
        </ScrollView>

        <View>
          <Text style={styles.poweredlabel}>Powered by <Text style={{ fontWeight: 'bold' }}>GCSS BI</Text></Text>
          <Image source={require('../../images/zong-logo.png')} style={{ height: 40, width: 130, alignSelf: 'center', marginBottom: 15 }}></Image>
        </View>

        <View>
          <RemotePushController
            paramObj={{
              "username": this.props.navigation.getParam('user', null).username,
              "event": "open",
              "cause": "notification received",
              "jwt": this.props.navigation.getParam('user', null).jwt,
              "location": "Home",
              "apiHost": this.props.navigation.getParam('user', null).apiHost,
              "android_version_code": this.props.navigation.getParam('user', null).android_version_code,
              "ios_build": this.props.navigation.getParam('user', null).ios_build,
            }} />
        </View>
      </ScrollView >
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
    color: "#bbb",
  },
  iconContainer: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center',
  },
  // icon: {
  //   width: 24,
  //   height: 24,
  // },
  poweredlabel: {
    textAlign: 'center',
    marginBottom: 0,
    color: "#ccc",
  },

  dismissModal: {
    color: "grey",
    textAlign: "center",
    paddingBottom: 10,
    paddingTop: 10,
    borderTopColor: "#eee",
    borderTopWidth: 1
  },

  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  outerView: {
    borderRadius: 10,
    height: 110,
    width: 170,
    borderWidth: 2,
    borderColor: "#8dc540",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "transparent"
  },
  innerView: {
    position: "absolute",
    left: 0 - 2,
    top: 110 - 35 - 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 35,
    width: 170,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    backgroundColor: "#8dc540",
    borderColor: "#8dc540",
    justifyContent: "center",
    alignItems: "center"
  },

  tileText: {
    color: "#555",
    // fontWeight: "bold",
    fontSize: 13.5
  },

  icon: {
    marginBottom: 30,
    color: '#ed0281'
  },
});


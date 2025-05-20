import React, { Component } from 'react';
import {NativeModules} from 'react-native';
//const {CalendarModule} = NativeModules;
const { LocationModule } = NativeModules;
import {
  Text,
  View,
  TextInput,
  Keyboard,
  Animated,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
  KeyboardAvoidingView
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import axios from 'axios';
import styles from './styles_login';
import { Button } from 'react-native-elements';

import * as SecureStore from 'expo-secure-store';

import { navigation, StackActions, NavigationActions } from 'react-navigation';

import PushNotification from 'react-native-push-notification'

import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from 'react-native-material-textfield';

import JailMonkey from 'jail-monkey';

// import RemotePushController from '../services/RemotePushController'

export default class Login extends Component {

  constructor(props) {
    super(props);

    if (JailMonkey.isJailBroken()) {
      // Alternative behaviour for jail-broken/rooted devices.
      BackHandler.exitApp();
    }

    this.authenticateUser = this.authenticateUser.bind(this);

    this.state = {
      username: '',
      password: '',
      showSpinner: false,
      imageURL: "",
      imageFlag: false,
      android_version_code: 52,
      ios_build: 47,
      latitude:"",
      longitude:"",
      locationname:"",
       
    apiHost: 'https://gcssbi.zong.com.pk/index.php/',
    apiHostOther: 'https://gcssbi.zong.com.pk/index.php/',
   // apiHost: 'http://172.25.41.219:8018/index.php/',
    //apiHostOther: 'http://172.25.41.219:8018/index.php/',
      // apiHostOther: 'http://192.168.100.4:800',
      spinnerTimeOutValue: Platform.OS === 'android' ? 10 : 1000,
      jwt: ""

    };

    this.imageHeight = new Animated.Value(128);
    this.imageWidth = new Animated.Value(128);

  }
  gpspermission = async () => {
   
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Location Permission',
          'message': 'GCSS BI App needs access to your location!',
          //buttonNeutral: 'Ask Me Later',
          //buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      )      
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.warn("undergranted network request");
       this.gpson();
        
              
      }
      else
      {
        Alert.alert("Location Permission Not Granted");
      }
    } catch (err) {
      console.warn(err)
    }
  };
  /* componentWillMount() {
  //   this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
  //   this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
   }*/

   componentWillUnmount() {
  //   this.keyboardWillShowSub.remove();
  //   this.keyboardWillHideSub.remove();
   this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
   }
   gpson = async () => {
    console.warn("undergranted network request");
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      try {
          const location = await new Promise((resolve, reject) => {
            LocationModule.getCurrentLocation(resolve, reject);
              
          });
          console.log('Current Location:', location);
          const { latitude, longitude } = location;

          const address = await new Promise((resolve, reject) => {
              LocationModule.getAddressFromCoordinates(latitude, longitude, resolve, reject );
          });
          console.log('Address:', address);
          this.state.latitude = latitude;
          this.state.longitude =longitude;
          this.state.locationname = address;
      } catch (error) {
          if (error.code === 'NETWORK_ERROR') {
              console.error('Network Error: Unable to fetch location due to no network connection.');
          } else {
              console.error('Error getting location or address:', error);
          }
      }
  } else {
      console.log('Location permission denied');
  }
  /*  try {
      
      const eventId = await CalendarModule.createCalendarEvent(
        'Party',
        'My House',
      );
    
if(eventId == "Not found"){
  console.log('Location address not found');
  this.state.latitude = "notfetch";
      this.state.longitude = "notfetch";
  Alert.alert(
    'Device Location Status',
    'Please enable your GPS!',
    [
      {
        text: 'OK',
        onPress: () => {
         // onSubmit();
         // this.props.navigation.goBack('DVR');
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
      var str_array = eventId.replace(/\[/g, '');
      str_array = str_array.replace(/\]/g, '');
      str_array = str_array.split(',');
      
      this.state.latitude = str_array[0];
      this.state.longitude = str_array[1];
      this.state.locationname = str_array[2];
      
     // console.log('Location address login page',this.state.locationname);
}
    } catch (e) {
      console.error(e);
    }*/

  };
  componentDidMount() {
    this.gpspermission();
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);

  /*  let redirectCode = this.props.navigation.getParam('redirectCode', null); //is only set when returned from Drawer Logout Button
    // ////console.warn("REDIRECT CODE :: ", redirectCode);

    if (redirectCode === null) {

      this._get("jwt").then((jwt) => {
        if (jwt) {

          this._get("username").then((username) => {
            if (jwt) {
              var myHeaders = new Headers();
              myHeaders.append('Content-Type', 'application/json');
              myHeaders.append('Authorization', jwt);
              this.authenticateUserBearingToken(myHeaders, jwt, username);
            }
          }).catch((error) => {

            //console.log('Get Username value from Secure Store Promise is rejected with error: ' + error);
            this.authenticateUserBearingToken(null, null, null);

          });

        }

      }).catch((error) => {

        //console.log('Get JWT value from Secure Store Promise is rejected with error: ' + error);
        this.authenticateUserBearingToken(null, null, null);


      });

    }


    this._unsubscribe = this.props.navigation.addListener('didFocus', () => {

      let redirectCode = this.props.navigation.getParam('redirectCode', null); //is only set when returned from Drawer Logout Button
      let username = this.props.navigation.getParam('username', null); //is only set when returned from Drawer Logout Button
      let jwt = this.props.navigation.getParam('jwt', null); //is only set when returned from Drawer Logout Button
      let location = this.props.navigation.getParam('location', null); //is only set when returned from Drawer Logout Button

      if (redirectCode === 301) {
        // ////console.warn("INSIDE MANUAL");

        try {
          this._delete("jwt");
          //console.log("DELETE ITEM SUCCESSFUL with redirect code: ", redirectCode);
          // ////console.warn("THE JWT ISSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS: ", this.state.jwt, " , ", this.state.username);


          this.sendLog({
            "username": username,
            "event": "logout",
            "cause": "manual",
            "jwt": jwt,
            "location": location
          });


        } catch (error) {
          //console.log("DELETE ITEM ERROR", error);
        }
      }



      if (redirectCode === 401) {

        let errorMessage = this.props.navigation.getParam('errorMessage', null); //is only set when returned from Performance Screen
        // ////console.warn("INSIDE TOKEN INVALID");

        try {
          this._delete("jwt");
          //console.log("DELETE ITEM SUCCESSFUL with errorMessage: ", errorMessage);

        } catch (error) {
          //console.log("DELETE ITEM ERROR", error);
        }

        this.sendLog({
          "username": username,
          "event": "logout",
          "cause": "token_invalid",
          "jwt": jwt,
          "location": location

        });


        let errorTitle = this.props.navigation.getParam('errorTitle', null); //is only set when returned from Performance Screen

        //console.log("ERROR MESSSSSSSSSSSSSSSSAGE", errorMessage);

        // setTimeout(() => {
        //   this.setState({ showSpinner: false });
        // }, this.state.spinnerTimeOutValue);


        setTimeout(() => {
          Alert.alert(
            errorTitle,
            errorMessage,
            [
              {
                text: 'Ok',
                style: 'cancel',
              },
            ],
            { cancelable: true },
          );
        }, this.state.spinnerTimeOutValue);

      }

    });*/

  }

 /* componentDidUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }*/

  keyboardWillShow = (event) => {
    Animated.timing(this.imageWidth, {
      duration: event.duration,
      toValue: 97,
    }).start();

    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: 97,
    }).start();
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.imageWidth, {
      duration: event.duration,
      toValue: 128,
    }).start();

    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: 128,
    }).start();
  };

  keyboardDidShow = (event) => {
    Animated.timing(this.imageWidth, {
      duration: event.duration,
      toValue: 97,
    }).start();

    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: 97,
    }).start();
  };

  keyboardDidHide = (event) => {
    Animated.timing(this.imageWidth, {
      duration: event.duration,
      toValue: 128,
    }).start();

    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: 128,
    }).start();
  };

  checkIfLatestVersion(user) {

    if (Platform.OS === "android" && user.android_version_code > this.state.android_version_code) {
      ////console.warn("so not 23");

      Alert.alert(
        'New Update Available',
        'To continue using the app, please update to the latest version',
        [
          {
            text: 'Later',
            style: 'cancel',
          },
          {
            text: 'Now',
            onPress: () => {
              Linking.openURL("https://play.google.com/store/apps/details?id=pk.com.zong.business.bi&hl=en").
                catch((err) => console.error('An error occurred in Android Linking', err));
            },
          },
        ],
        { cancelable: false },
      );

      return false;

    }




    if (Platform.OS === "ios" && user.ios_build > this.state.ios_build) {
      ////console.warn("ios version outdate ", user.ios_build);

      setTimeout(() => {
        // this log will output
        //console.log("show alert")
        // but Alert doesn't display, so to fix it, we put it in timeout


        Alert.alert(
          'New Update Available',
          'To continue using the app, please update to the latest version',
          [
            {
              text: 'Later',
            },
            {
              text: 'Now',
              onPress: () => {
                Linking.openURL("https://apps.apple.com/kw/app/zong-gcss-bi-dashboard/id1484467206").
                  catch((err) => console.error('An error occurred in iOS Linking', err));
              },
            },
          ],
          { cancelable: false },
        );
      }, this.state.spinnerTimeOutValue)

      return false;

    }

    return true;

  }


  sendLog = (paramObj) => {
    const url = this.state.apiHost + '/user/write_log';
    //console.warn("LOG CALL URL: ", url, " and jwt is > > > > > > > > > > : ", paramObj.jwt);

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeaders.append('Authorization', paramObj.jwt);


    return fetch(url, {
      method: 'POST',
      headers: myHeaders,
      body: "username=" + paramObj.username + "&event=" + paramObj.event + "&cause=" + paramObj.cause + "&token=not sent due to security reasons" + "&description=" + paramObj.location + "&platform=" + Platform.OS + "&version=" + (Platform.OS === 'android' ? this.state.android_version_code : this.state.ios_build) // <-- Post parameters
    }).then(response => response.text())
      .then((text) => {
        text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
       // console.log(text);
        return text;
      })
      .then(responseJs => {

        let responseJson = JSON.parse(responseJs);
        // //console.log("RESPONSE JSON", responseJson);

        if (responseJson.status == 200) {
          ////console.warn("log sent and written with response: ", responseJson.msg);
        } else {

          ////console.warn("log sent but NOT WRITTEN with response: ", responseJson.msg);
        }

      })
      .catch(error => {
        ////console.warn("error occured in sending log with details username=" + paramObj.username + " & event=" + paramObj.event + " & cause=" + paramObj.cause);

      })
  }
 

  authenticateUser = () => {
   // console.log(this.getMobileOperatingSystem());
   // console.log("new dashboard");
    //console.log("http://172.25.41.219:8018/index.php/user/returnUser"+this.state.username+"n"+this.state.password);
    return fetch('https://gcssbi.zong.com.pk/index.php/user/returnUser', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: "username=" + this.state.username + "&password=" + this.state.password
    })
      .then(response => response.text())
      .then((text) => {
        text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
       // console.log(text);
        return text;
      }).then(responseJs => {

        let myData = JSON.parse(responseJs);
       //  console.log(responseJs);
        // return;
        // let myData = JSON.parse(res.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, ''));

        // user.apiHost = this.state.apiHost;
        // user.apiHostOther = this.state.apiHostOther;
        // user.spinnerTimeOutValue = this.state.spinnerTimeOutValue;
        // user.android_version_code = this.state.android_version_code;
        // user.ios_build = this.state.ios_build;

        let user = Object.assign(myData, {
          apiHost: this.state.apiHost,
          apiHostOther: this.state.apiHostOther,
          spinnerTimeOutValue: this.state.spinnerTimeOutValue,
          android_version_code: this.state.android_version_code,
          ios_build: this.state.ios_build
        });

       // console.log(this.state.android_version_code);
        // res.data.map(item => {
        //   mData.push(...item, {
        //     apiHost: this.state.apiHost,
        //     apiHostOther: this.state.apiHostOther,
        //     spinnerTimeOutValue: this.state.spinnerTimeOutValue,
        //     android_version_code: this.state.android_version_code,
        //     ios_build: this.state.ios_build
        //   })
        // });

        //let user = mData;
        // user.apiHost = this.state.apiHost;
        // user.apiHostOther = this.state.apiHostOther;
        // user.spinnerTimeOutValue = this.state.spinnerTimeOutValue;
        // user.android_version_code = this.state.android_version_code;
        // user.ios_build = this.state.ios_build;


        if (!this.checkIfLatestVersion(user)) {
          // setTimeout(() => {
          this.setState({ showSpinner: false });
          // }, this.state.spinnerTimeOutValue);

          return false;
        }

        //console.log("latest version passed", user);

       // console.log('------------->>>>>>>>' + user.employee_no);


        if (user.username !== null) {
          //console.log('role: ', user.role);
          let name = this.state.username;

          try {
            this._save("jwt", user.jwt);
            //console.log('jwt saved -------->>>>>>>>');
          } catch (error) {
            //console.log("SET ITEM ERROR", error);
          }

          try {
            this._save("username", user.username);
            //console.log('jwt saved -------->>>>>>>>',user.username);
          } catch (error) {
            //console.log("SET ITEM ERROR", error);
          }
          //console.log("save complete");

          this.setState({ jwt: user.jwt });
          user.jwt = this.state.jwt;

          fetch(this.state.apiHost + "/assets/img/profilepics/" + name + ".jpg")
            .then(res => {
              if (res.status != 200) {
               // console.warn("not 200");

                this.setState({ imageURL: "" });
                this.setState({ imageFlag: false });
              } else {

              //  console.warn("is 200");

                this.setState({ imageURL: this.state.apiHostOther + "/assets/img/profilepics/" + name + ".jpg" });
                this.setState({ imageFlag: true });

              }

              // ////console.warn("state value: " + this.state.imageURL);

             // console.warn("state value outside: " + this.state.imageURL);

              const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({
                  routeName: 'home', params: {
                    latitude: this.state.latitude,
                    longitude:this.state.longitude,
                    locationname:this.state.locationname,
                    user: user,
                    imageURL: this.state.imageURL,
                    imageFlag: this.state.imageFlag
                  }
                })],
              });


              this.props.navigation.dispatch(resetAction)


              // this.props.navigation.navigate('home', {
              //   user: user,
              //   imageURL: this.state.imageURL,
              //   imageFlag: this.state.imageFlag
              // });
              setTimeout(() => {
                this.setState({ showSpinner: false });
              }, this.state.spinnerTimeOutValue);


            })
            .catch(error => {
              this.setState({ imageURL: "" });
              this.setState({ imageFlag: false });
            })


          this.sendLog({
            "username": user.username,
            "event": "login",
            "cause": "manual",
            "jwt": this.state.jwt,
            "location": "authenticateUser"

          });

     //   console.warn("JWT SAVED AS >>>>>>>>>>>>> ", user.seller_id);
       //  console.warn("JWT SAVED AS >>>>>>>>>>>>> ", user.phone);
          

        } else {
          setTimeout(() => {
            this.setState({ showSpinner: false });
          }, 500);

          setTimeout(() => {

            let errorTitle = 'Login Error';
            let errorMessage = 'Incorrect username or password';
            let buttonText = "Try again";

            if (typeof user.errorTitle !== 'undefined' && user.errorTitle !== null) {

              errorTitle = user.errorTitle;
              errorMessage = user.errorMessage;
              buttonText = user.buttonText;

            }

            Alert.alert(errorTitle, errorMessage, [
              {
                text: buttonText,
              },
            ]);
          }, this.state.spinnerTimeOutValue);

        }
      }).catch(err => {
        console.log('axios error => ', err);
      });

  }


  authenticateUserBearingToken = (myHeaders, jwt, username) => {

  //  console.warn("authenticateUserBearingToken APIHOST::::::::::::::::::::::::::: ", this.state.apiHost);
    this.setState({ showSpinner: true });
    const url = this.state.apiHost + '/user/return_user_bearing_token';
 //console.warn(url);
  // console.warn('comes up-to here');
    return fetch(url, {
      method: 'GET',
      headers: myHeaders
    })
      .then(response => response.text())
      .then((text) => {
        text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
        return text;
      })
      .then(responseJs => {

        let responseJson = JSON.parse(responseJs);
        //console.log('return user bearing token json: ', responseJson);
        user = responseJson;
        user.apiHost = this.state.apiHost;
        user.apiHostOther = this.state.apiHostOther;
        user.spinnerTimeOutValue = this.state.spinnerTimeOutValue;
        user.android_version_code = this.state.android_version_code;
        user.ios_build = this.state.ios_build;
       // console.log('role: ', user.ios_build);
        if (typeof user.username !== 'undefined' && user.username !== null) {
          

          this.setState({ jwt: jwt }); // jwt taken from args
          user.jwt = this.state.jwt;


          if (!this.checkIfLatestVersion(user)) {
            // setTimeout(() => {
            this.setState({ showSpinner: false });
            // }, this.state.spinnerTimeOutValue);

            return false;
          }

          let name = user.username;

          fetch(this.state.apiHostOther + "/assets/img/profilepics/" + name + ".jpg")
            .then(res => {
              if (res.status != 200) {
                // ////console.warn("not 200");

                this.setState({ imageURL: "" });
                this.setState({ imageFlag: false });
              } else {

                // ////console.warn("is 200");

                this.setState({ imageURL: this.state.apiHostOther + "/assets/img/profilepics/" + name + ".jpg" });
                this.setState({ imageFlag: true });

              }

              // ////console.warn("state value: " + this.state.imageURL);

              // ////console.warn("state value outside: " + this.state.imageURL);


              // ////console.warn("===================> BEFORE MAKING RESET ACTION");


              const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({
                  routeName: 'home', params: {
                   latitude: this.state.latitude,
                   longitude: this.state.longitude,
                   locationname: this.state.locationname,
                    user: user,
                    imageURL: this.state.imageURL,
                    imageFlag: this.state.imageFlag
                  }
                })],
              });

              // ////console.warn("===================> BEFORE DISPATCHING RESET ACTION");



              this.props.navigation.dispatch(resetAction)

              // ////console.warn("===================> AFTER DISPATCHING RESET ACTION");


              // this.props.navigation.navigate('home', {
              //   user: user,
              //   imageURL: this.state.imageURL,
              //   imageFlag: this.state.imageFlag
              // });
              setTimeout(() => {
                this.setState({ showSpinner: false });
              }, this.state.spinnerTimeOutValue);


            })
            .catch(error => {
              this.setState({ imageURL: "" });
              this.setState({ imageFlag: false });
            })

          this.sendLog({
            "username": username,
            "event": "login",
            "cause": "token_valid",
            "jwt": jwt,
            "location": "authenticateUserBearingToken"

          });

          // ////console.warn("JWT SAVED AS BEARING TOKEN>>>>>>>>>>>>> ", this.state.jwt);






        } else {

          try {
            // //console.log("JWTTTTTTTTTTTTTTTTTTTTTTTTTTTT: ", responseJson.jwt);

            this._delete("jwt");
            //console.log("DELETE ITEM SUCCESSFUL");

          } catch (error) {
            //console.log("DELETE ITEM ERROR", error);

          }

          this.sendLog({
            "username": username,
            "event": "logout",
            "cause": "token_invalid",
            "jwt": jwt,
            "location": "authenticateUserBearingToken"

          });


          setTimeout(() => {
            this.setState({ showSpinner: false });
          }, 500);


          setTimeout(() => {
            Alert.alert('Token Invalid', 'Please login again.', [
              {
                text: 'Ok',
              },
            ]);
          }, this.state.spinnerTimeOutValue);

        }


      })
      .catch((error, response) => {
        ////console.warn(error);
        // ////console.warn(response.statusText);

        try {
          // //console.log("JWTTTTTTTTTTTTTTTTTTTTTTTTTTTT: ", responseJson.jwt);

          this._delete("jwt");
          //console.log("DELETE ITEM SUCCESSFUL");

        } catch (error) {
          //console.log("DELETE ITEM ERROR", error);

        }

        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, 500);


        setTimeout(() => {
          Alert.alert('Login Error', 'Unexpected state occurred. Please make sure you have:\n\n1. Working data connection\n2. Updated to the latest version of the app\n\nIf issue still persists, please contact GCSS BI Team.', [
            {
              text: 'Close'
            },
            {
              text: 'Update',
              onPress: () => {
                Linking.openURL(Platform.OS == "android" ? "https://play.google.com/store/apps/details?id=pk.com.zong.business.bi&hl=en"
                  : "https://apps.apple.com/kw/app/zong-gcss-bi-dashboard/id1484467206").
                  catch((err) => console.error('An error occurred in Linking', err));
              },
            },
          ]);
        }, this.state.spinnerTimeOutValue);

      });

  }

  static navigationOptions = {
    header: null,
  };

  _save = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
  };

  _delete = async (key, value) => {
    await SecureStore.deleteItemAsync(key);
  };


  _get = async (key) => {

    try {

      let result = await SecureStore.getItemAsync(key);


      return result;
    } catch (error) {
      //console.log("this error: ", error.message);
    }
    return

  };


  formatText = (text) => {
    return text.replace(/[^a-z0-9.]/gi, '');
  };



  render() {
    const {
      container,
      logoContainer,
      logo,
      title,
      subTitle,
      infoContainer,
      input,
      buttonContainer,
      buttonText,
      spinnerTextStyle,
    } = styles;


    return (


      Platform.OS === "android" ? (

        <View style={container}>

          <Spinner
            visible={this.state.showSpinner}
            textContent={'Authenticating'}
            textStyle={spinnerTextStyle}
            color='#fff'
            overlayColor='rgba(0, 0, 0, 0.5)'
            size='large'
            animation='fade'
          />

          <View style={logoContainer}>
            <View style={logoContainer}>
              <Animated.Image
                style={[logo, { height: this.imageHeight }, { width: this.imageWidth }]}
                source={require('../../images/logo.png')} />
              <Text style={title}>GCSS BI Dashboard</Text>
              {/* <Text style={subTitle}>Please sign in</Text> */}
            </View>
            <View style={infoContainer}>

              <OutlinedTextField
                label='Username'
                // keyboardType='email-address'
                formatText={this.formatText}
                returnKeyType="next"
                autoCorrect={false}
                onSubmitEditing={() => this.refs.txtPassword.focus()}
                onChangeText={text => this.setState({ username: text })}
                animationDuration={400}
                autoCapitalize='none'
              />

              {/* <TextInput
                style={input}
                placeholder="Username"
                placeholderTextColor="#495057"
                keyboardType="email-address"
                returnKeyType="next"
                autoCorrect={false}
                onSubmitEditing={() => this.refs.txtPassword.focus()}
                onChangeText={text => this.setState({ username: text })}
              /> */}


              <OutlinedTextField
                label='Password'
                secureTextEntry={true}
                returnKeyType="go"
                autoCorrect={false}
                ref={'txtPassword'}
                onChangeText={text => this.setState({ password: text })}
                autoCompleteType='password'
                autoCapitalize='none'
                textContentType='password'
                animationDuration={400}
              />



              {/* <TextInput
                style={input}
                placeholder="Password"
                placeholderTextColor="#495057"
                returnKeyType="go"
                secureTextEntry
                autoCorrect={false}
                ref={'txtPassword'}
                onChangeText={text => this.setState({ password: text })}
              /> */}
              <Button
                title='Sign in'
                color='#0062cc'
                onPress={() => this.authenticateUser()}
              />
            </View>
          </View>


        </View>

      ) :


        //for iOS
        (
          <KeyboardAvoidingView style={container} behavior="padding">

            <Spinner
              visible={this.state.showSpinner}
              textContent={'Authenticating'}
              textStyle={spinnerTextStyle}
              color='#fff'
              overlayColor='rgba(0, 0, 0, 0.5)'
              size='large'
              animation='fade'
            />

            <View style={logoContainer}>
              <View style={logoContainer}>
                <Animated.Image
                  style={[logo, { height: this.imageHeight }, { width: this.imageWidth }]}
                  source={require('../../images/logo.png')} />
                <Text style={title}>GCSS BI Dashboard</Text>
                {/* <Text style={subTitle}>Please sign in</Text> */}
              </View>
              <View style={infoContainer}>
                <OutlinedTextField
                  label='Username'
                  // keyboardType='email-address'
                  formatText={this.formatText}
                  returnKeyType="next"
                  autoCorrect={false}
                  onSubmitEditing={() => this.refs.txtPassword.focus()}
                  onChangeText={text => this.setState({ username: text })}
                  animationDuration={1000}
                  autoCapitalize='none'
                />
                <OutlinedTextField
                  label='Password'
                  secureTextEntry={true}
                  returnKeyType="go"
                  autoCorrect={false}
                  ref={'txtPassword'}
                  onChangeText={text => this.setState({ password: text })}
                  autoCompleteType='password'
                  textContentType='password'
                  animationDuration={1000}
                />
                <Button
                  title='Sign in'
                  color='#0062cc'
                  onPress={() => this.authenticateUser()}
                />
              </View>



            </View>


          </KeyboardAvoidingView>
        )
    );
  }
}

import React, { Component,useState } from 'react';
import MultiSelect from 'react-native-multiple-select';
//import DatePicker from the package we installed
//import {useState} from 'react';
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
import DatePicker from 'react-native-datepicker';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { Dropdown } from 'react-native-material-dropdown';
import {
  SafeAreaView,
  //TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
  View,
  Alert,
} from 'react-native';


import Spinner from 'react-native-loading-spinner-overlay';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  OutlinedTextField,
} from 'react-native-material-textfield';



 
class leadoptionshq extends Component {

  
  state = {
    selectedItems : []  
      // This is a default value...
  
  };

  
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };
  getexisitngleads = () =>{
    //

    // var obj = JSON.parse(this.state.userdvr);
     console.log('here is the user_id: ', this.state.user.user_id);
    //let jwt = await this._get("jwt");
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    //myHeaders.append('Authorization', jwt);

    return fetch('https://gcssbi.zong.com.pk/index.php/summary/checklead?user_id='+this.state.user.user_id+'&account_type=hq', {
      method: 'GET',
      headers: myHeaders
    }).then(response => response.text())
      .then((text) => {
        text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
        return text;
      })
      .then(myData => {
         // console.log(myData);
         //console.log(JSON.stringify(myData));
       let res = JSON.parse(myData);
       
       if(res.userid[0] == null) 
   { //console.warn("REDIRECT CODE long::",this.state.long_info);
   //this.findemployee();
           Alert.alert(
             'No Exisitng visit Found',
             'Please add new visit',
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
        //console.warn("REDIRECT CODE lat ::",this.state.lat_info);
       
        this.props.navigation.navigate('leadopenHQ',{
          userids: this.state.user.user_id,      
          email:this.state.user.email,
          region_location: this.state.user.region_location,    
          employee_no: this.state.user.employee_no,
          user_name: this.state.user.username,
          sellerid: this.state.user.seller_id,
          lat_info:this.state.lat_info,
          long_info:this.state.long_info,
          address_info:this.state.address_info,
          mobile_no: this.state.user.phone,
          regionname: this.state.user.big_region,
        });
      }
 
   
 
      })
      .catch(err => { console.log(err) });
  };
 
  sendFeedbackToServer = () => {
    
    if (this.state.selectedType === 'Select Potential Business') {
      Alert.alert('Incomplete Form', 'Please select Potential Business');
      return;
    } /*else if (this.state.sellerID.length === 0) {
      Alert.alert('Incomplete Form', 'Please add SellerID');
      return;
    } */else {
     // this.generateRandomNumber;
      this.setState({ showSpinner: true });
    /*  console.log('here is the user_id: ', this.state.user.user_id);
      //onChangeText={this.state.GenerateRandomNumber}
      console.log('here is the lead_id: ', this.state.user.seller_id+this.state.numberHolder);
      console.log('here is the PotentialBusiness: ', this.state.selectedType);
      console.log('here is the username: ', this.state.user.username);
      console.log('here is the sellerID: ', this.state.user.seller_id);
      console.log('here is the phone: ', this.state.user.phone);
      console.log('here is the leadclosure: ', this.state.leadclosurestatus);
      console.log('here is the comments: ', this.state.comments);
      console.log('here is the company: ', this.state.company_name);
      console.log('here is the nextvisidate: ', this.state.nextvisitdata);
      console.log('here is the visitdate: ', this.state.visitdate);*/
      return fetch('https://gcssbi.zong.com.pk/index.php/summary/submitDVR/', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        }),
       // body: "feedback_type=" + this.state.selectedType + "&sellerID=" + this.state.sellerID + "&user_id=" +this.state.user.user_id
       body: "user_id=" +this.state.user.user_id + "&LeadID=" + this.state.user.seller_id+"_"+this.state.numberHolder+ "&sellerID=" + this.state.user.seller_id + "&companyname=" +this.state.company_name + "&POCName=" +this.state.user.username+ "&POCcontact_no=" +this.state.user.phone+ "&PotentialBusiness="+this.state.selectedType +"&visitdate="+this.state.visitdate +"&leadstatus="+this.state.selectedType+"&sellercomments="+this.state.comments+"&leadclosure_status="+this.state.leadclosurestatus+"&officelocation="+this.state.officelocation+"&next_visitdate="+this.state.nextvisitdate+"&wayforward="+this.state.way_forward
      })
        .then(response => response.text())
        .then((text) => {
          text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
         // alert(text);
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
              'Lead Status',
              'Lead submitted successfully',
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
 
  findemployee = () => {
     
    return fetch('https://track.zong.com.pk/spm/api/FindEmployee', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: "employee_number=" +this.state.user.employee_no + "&manager_number=" + this.state.user.seller_id
     
    })
      .then(response => response.text())
      .then((text) => {
        text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
       console.log(text);
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
            'Move to SPM Portal',
            'Lead submitted successfully',
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

  gpson = async () => {

    // console.warn("gps permission");
     try {
       
       const eventId = await CalendarModule.createCalendarEvent(
         'Party',
         'My House',
       );
     
 if(eventId == "Not found"){
  // console.log('Location address not found');
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
       
 
       this.state.lat_info = str_array[0];
       this.state.long_info = str_array[1];
       this.state.address_info = str_array[2];
       
      // console.log('Location address EADOPTION',this.state.address_info);
 }
     } catch (e) {
       console.error(e);
     }
   };
  componentDidMount() {
   this.gpson();
 //   this.getTypeData();
 //this.getexisitngleads();
   // this.getclosurestatus();
    //this.GenerateRandomNumber();
   //this.getDVRData();
  // this.getclosedstatus();
   
  }

  
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
  // const itemId = params ? params.latitude : null;

    this.state = {
     user:this.props.navigation.getParam('user', null),
     lat_info: this.props.navigation.getParam('lat_info', null),
     long_info: this.props.navigation.getParam('long_info', null),
     address_info: this.props.navigation.getParam('address_info', null),
      
      selectedType: 'Select Potential Business',
      leadclosurestatus: 'Select Lead Closure Status',

      visitdate:'',
      nextvisitdate:'',
      numberHolder: 1,
      showSpinner: false,
      startDate: new Date(),
      isLoading:false,
      nextDate: new Date()
    };
   // this.handleChange = this.handleChange.bind(this);
   // this.handleChangenext = this.handleChangenext.bind(this);
  }
 
  render() {
    const { selectedItems } = this.state;
   
    const {
      spinnerTextStyle
    } = styles;
   
    
    if (this.state.isLoading) {
      return (
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator
            size={64}
            animating={this.state.isLoading}
            color={'#8dc540'}
          />
          <Text style={{
            color: '#8dc540',
            fontSize: 22
          }}>Fetching Location</Text>
        </View>
      );
    } else {
    return (
      
      <SafeAreaView>
         <ScrollView style={styles.scrollView}>
         <Header companyName={"Daily Visit Report"} />
         <View
          style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>

          

             
                <View
                style={{ marginHorizontal: 20, backgroundColor: "#8DC63F", borderRadius: 10,marginTop: 150 }}>
           
            <Button
           
              title='HQ Driven Accounts Visit'
              color='#8DC63F'
              alignItems='center'
              onPress={() => {
             //   console.warn("REDIRECT CODE latitude ::",this.state.long_info);
             // console.warn("REDIRECT CODE  longitude::",this.state.lat_info);
              
             this.props.navigation.navigate('DVRHQ',{
               userids: this.state.user,
               lat_info:this.state.lat_info,
               long_info:this.state.long_info,
               address_info:this.state.address_info                
             });

        // this.getDVRData();
            
             // this.props.navigation.navigate('GovFeedback');
           }}
            />
          </View>
 
                <View
            style={{ marginHorizontal: 20, backgroundColor: '#8DC63F', borderRadius: 10, marginTop: 30 }}>
            <Button
              title='Exisitng Visit'
              
              backgroundColor='#8DC63F'
              onPress={() => this.getexisitngleads()

        // this.getDVRData();
            
             // this.props.navigation.navigate('GovFeedback');
              }
            />
          </View>
</View>
        </ScrollView>
      </SafeAreaView>
      
    );
  }
}
}

export const Header = ({ companyName }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{companyName}</Text>
    </View>
  );
};
//const [date, setDate] = useState(new Date());
//const [open, setOpen] = useState(false);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 40,
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
    padding: 0,
  },

  pickerWrapper: {
    borderRadius: 8,
    borderColor: 'grey',
    borderWidth: 1,
    height: 50,
    justifyContent: 'flex-end',
    marginTop: 8,
    marginHorizontal: 20,
    marginBottom: 10,
    paddingTop: 0,
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

export default leadoptionshq;

import React, { Component,useState } from 'react';
import MultiSelect from 'react-native-multiple-select';
//import DatePicker from the package we installed
//import {useState} from 'react';
import DatePicker from 'react-native-datepicker';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { Dropdown } from 'react-native-material-dropdown';
import {
  SafeAreaView,
  SelectList,
  StyleSheet,
  ScrollView,
  Text,
  View,
  Alert,
} from 'react-native';
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
import Spinner from 'react-native-loading-spinner-overlay';
import { Button, CheckBox } from 'react-native-elements';
import {
  OutlinedTextField,
} from 'react-native-material-textfield';



 
class SPM extends Component {

  
  state = {
    selectedItems : []  
      // This is a default value...
    
  };


  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };
 
  sendFeedbackToSPM = () => {
    
    if (this.state.selectedType === 'Select Industry Type') {
      Alert.alert('Incomplete Form', 'Please select industry type');
      return;
    }
      
     else {
      this.generateRandomNumber;
      this.setState({ showSpinner: true });
  //    console.log('here is the poccontactno: ', this.state.employee_no);
    //  console.log('here is the poccontactno: ', this.state.compname);
    //console.log('here is the user_id: ', this.state.poc_no);
    //console.log('here is the user_id: ', this.state.remarks);
    //console.log('here is the user_id: ', this.state.product_type);
  //  console.log('here is the email: ', this.state.email);
   // console.log('here is the region_location: ', this.state.region_location);
  //  console.log("lead_name=" +this.state.compname + "&employee_id=" + this.state.employee_no+"&email=" + this.state.email+"&region_location=" + this.state.region_location+ "&potential_closing_date=" + this.state.visitdate+ "&servicing_manager=0000" +"&customer_type=1"+"&segment="+this.state.selectedsegment+"&industry="+this.state.industry_type+"&p_mrc=1000&p_otc=500&win_probability=80&created_by=9876&gross_adds=1203&potential_charging_date=000&" + "&company_ntn=" +this.state.company_ntn + "&company_poc_name=" +this.state.poc_name+ "&company_poc_number=" +this.state.poc_no+ "&project_remarks="+this.state.remarks +"&existing_zong_services[0]='zong'&product_leads[0]="+this.state.product_type);
    /*  console.log('here is the user_id: ', this.state.user.big_region);
      //onChangeText={this.state.GenerateRandomNumber}
      console.log('here is the lead_id: ', this.state.user.seller_id+this.state.numberHolder);
      console.log('here is the PotentialBusiness: ', this.state.selectedType);
      console.log('here is the username: ', this.state.user.username);
      console.log('here is the pocname: ', this.state.poc_name);
      console.log('here is the sellerID: ', this.state.user.seller_id);
      console.log('here is the phone: ', this.state.user.phone);
      console.log('here is the leadclosure: ', this.state.leadclosurestatus);
      console.log('here is the comments: ', this.state.comments);
      console.log('here is the comments: ', this.state.leadprogressval);
      console.log('here is the company: ', this.state.company_name);
      console.log('here is the latitude: ', this.state.lat_info);
      console.log('here is the nextvisitdate: ', this.state.nextDate);
      console.log('here is the visitdate: ', this.state.visitdate);*/
   
   
  }
      return fetch('https://track.zong.com.pk/spm/api/InsertLead', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        }),
       // body: "feedback_type=" + this.state.selectedType + "&sellerID=" + this.state.sellerID + "&user_id=" +this.state.user.user_id
      // body: "user_id=" +this.state.user.user_id + "&LeadID=" + this.state.user.seller_id+"_"+this.state.numberHolder+ "&sellerID=" + this.state.user.seller_id + "&companyname=" +this.state.company_name + "&POCName=" +this.state.poc_name+ "&POCcontact_no=" +this.state.user.phone+ "&PotentialBusiness="+this.state.selectedType +"&visitdate="+this.state.visitdate +"&leadstatus="+this.state.leadprogressval+"&sellercomments="+this.state.comments+"&leadclosure_status="+this.state.leadclosurestatus+"&officelocation="+this.state.newlocationname+"&next_visitdate="+this.state.nextvisitdata+"&wayforward="+this.state.way_forward+"&region="+this.state.user.big_region
      //latest one
    //  body: "user_id=" +this.state.user.user_id + "&LeadID=" + this.state.user.seller_id+"_"+this.state.numberHolder+ "&sellerID=" + this.state.user.seller_id + "&companyname=" +this.state.company_name + "&POCName=" +this.state.poc_name+ "&POCcontact_no=" +this.state.user.phone+ "&PotentialBusiness="+this.state.selectedType +"&visitdate="+this.state.visitdate +"&leadstatus="+this.state.leadprogressval+"&latitutude="+this.state.newlatitude+"&sellercomments="+this.state.newlongitude+"&leadclosure_status="+this.state.leadclosurestatus+"&officelocation="+this.state.newlocationname+"&next_visitdate="+this.state.nextDate+"&wayforward="+this.state.way_forward+"&region="+this.state.user.big_region
   body: "lead_name=" +this.state.compname + "&employee_id=" + this.state.employee_no+"&employee_email=" + this.state.email+"&city=" + this.state.region_location+ "&potential_closing_date=" + this.state.visitdate+ "&servicing_manager=0000" +"&customer_type=1"+"&segment="+this.state.selectedsegment+"&industry="+this.state.industry_type+"&p_mrc=1000&p_otc=500&win_probability=80&created_by=9876&gross_adds=1203&potential_charging_date=000&" + "&company_ntn=" +this.state.company_ntn + "&company_poc_name=" +this.state.poc_name+ "&company_poc_number=" +this.state.poc_no+ "&project_remarks="+this.state.remarks +"&existing_zong_services[0]='zong'&product_leads[0]="+this.state.product_type
     
      })
        .then(response => response.text())
        .then((text) => {
          text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
       //  console.log(text);
          return text;
        }).then(responseJs => {
          let res = JSON.parse(responseJs);
         // console.log(res['success']);
          setTimeout(() => {
            this.setState({ showSpinner: false });
          }, this.state.spinnerTimeOutValue);

          if (res['success'] == 'false') {
            Alert.alert(
              'Operation Failed',
              res['message'],
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
                  
                   // this.props.navigation.goBack(null);
                    //this.props.navigation.navigate('Home')
                    this.props.navigation.popToTop();
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
  

  GenerateRandomNumber=()=>
  {
    //const [date, setDate] = useState(new Date());
  var RandomNumber = Math.floor(Math.random() * 1000) + 1 ;
   
 
    this.setState({ numberHolder: RandomNumber })
 
  }
  getindustry = () => {

    const url = 'https://track.zong.com.pk/spm/api/GetSegment';
    //console.warn(url);
    //console.warn('get segment');

    return fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
    })
      .then(response => response.text())
      .then((text) => {
        text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
       // console.warn(text);
        return text;
      })
      .then(responseJs => {

        let responseJson = JSON.parse(responseJs);
       /* console.log('return industry tagging: ', responseJson.segments);
        //industry = responseJson;
       // industry.apiHost = this.state.apiHost;
      // console.log(JSON.stringify(responseJson));
       // console.log(JSON.stringify(myData));
       const segments = [];
       for(let j=0; j<responseJson.segments.length; j++){
        segments.push(responseJson.segments[j]);
       }
        
       console.log('return industry tagging: ', segments[0]);
       
       this.setState({industryarray: segments});
*/

const drop_down_data = [];
for(var i=0;i<responseJson.segments.length;i++){

  drop_down_data.push({label:responseJson.segments[i].name, value: responseJson.segments[i].id }); // Create your array of data
}
this.setState({ drop_down_data }); // Set the new state
//console.log('return industry tagging: ',this.state.drop_down_data); // I need to add 
      });
        }
  getTypeData = () => {
    let data = [
      {
        value: 'GSM',
      },
      {
        value: 'MAD',
      },
      {
        value: 'VPBX',
      },
      {
        value: 'CBS',
      },
      {
        value: 'Other',
      },
      {
        value: 'PRI',
      }
      ,
      {
        value: 'M2M',
      }
      ,
      {
        value: 'ICT PRODUCT',
      }
      ,
      {
        value: 'Terminal',
      }
      ,
      {
        value: 'MBB',
      }
      ,
      {
        value: 'DIA/DPLC',
      }
      ,
      
      {
        value: 'Zong Connect Video Conferencing',
      }
      ,
      {
        value: 'CORPORATE SMS',
      }
      ,
      {
        value: 'BVMB',
      }
      ,
      {
        value: 'TEST Tariff',
      }

      ,
      {
        value: 'IOT',
      }
      ,
      {
        value: 'PTT',
      },
      {
        value: 'Zong Track',
      }
      ,
      {
        value: 'Employee Tariff',
      }
      ,
      {
        value: 'ZFM',
      }
      ,
      {
        value: 'Zong Moto guard',
      }
      ,
      {
        value: 'Daas',
      }
      ,
      {
        value: 'Zong Energy Management',
      }
      ,
      {
        value: 'Zong water Management',
      }
      ,
      {
        value: 'Smart Disinfection Tunnel',
      }
      ,
      {
        value: 'CBS',
      }
      ,
      {
        value: 'DIA',
      }
      ,
      {
        value: 'DPLC',
      }

    ];
    this.setState({ typeData: data });
  };

  
  getIndustryData = () => {
    let data = [
      {
        label:'Services',
        value: '1',
      },
      {
        label:'Industry & Manufacturing',
        value: '2',
      },
      {
        label:'Government',
        value: '3',
      },
      {
        label:'Military',
        value: '4',
      },
      {
        label:'Financial Institution',
        value: '5',
      },
      {
        label:'Chinese-Government Owned Chinese-Pr',
        value: '6',
      }
      ,
      {
        label:'Not-identified',
        value: '7',
      }
      ,
      {
        label:'B2G',
        value: '8',
      }
      ,
      {
        label:'Banking and Finance',
        value: '9',
      }
      ,
      {
        label:'Education',
        value: '10',
      }
      ,
      {
        label:'Manufacturing',
        value: '11',
      }
      ,
      
      {
        label:'Power Energy and CPEC',
        value: '12',
      }
      ,
      {
        label:'Services and SME',
        value: '13',
      }

    ];
    this.setState({ industryData: data });
  };

  getclosurestatus = () => {
    let data = [
      {
        value: 'Open',
      },
      {
        value: 'Closed',
      }
    ];
    this.setState({ leadclosuretype: data });
  };
  getclosedstatus = () => {
    let dataclosed = [
      {
        value: 'Successful',
      },
      {
        value: 'Unsuccessful',
      }
    ];
    this.setState({ leadclosedtype: dataclosed });
  };

  
  componentDidMount() {
    this.getTypeData();
    this.getclosurestatus();
    this.GenerateRandomNumber();
   this.getclosedstatus();
   //this.getIndustryData();
   this.getindustry();
   //this.locationcheck();
   
  }
  
  handleChange(date) {
    this.setState({
      visitdate: date,
      startDate: date
    }, () => {
      //console.log(this.state.visitdate);
    });
   /* this.setState({ visitdata: date }, () => {
      console.log(this.state.visitdate);
    });*/
   // e.preventDefault();
   // console.log(this.state.startDate)
  }
  handleChangenext(date) {
    this.setState({
      nextvisitdate: date,
      nextDate: date
    }, () => {
     // console.log(this.state.nextvisitdate);
    });
   /* this.setState({ visitdata: date }, () => {
      console.log(this.state.visitdate);
    });*/
   // e.preventDefault();
   //console.log("nextdd");
    //console.log(this.state.nextDate)
  }
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const itemId = params ? params.userids : null;
   // const [withoutTime] = new Date.split('T');
    const date = new Date();
    
 
const [withoutTime] = date.toISOString().split('T');
//console.log(withoutTime); // 👉️ 2022-01-18

    this.state = {
      isLoading: false,
      isSelected:true,
      setSelection:false,
      industryarray:'',
      poc_no: this.props.navigation.getParam('poc_no', null),
      poc_name: this.props.navigation.getParam('poc_name', null),
      compname: this.props.navigation.getParam('compname', null),
      remarks: this.props.navigation.getParam('remarks', null),
      employee_no: this.props.navigation.getParam('employee_no', null),
      region_location: this.props.navigation.getParam('region_location', null),
      email: this.props.navigation.getParam('email', null),
      industry_type: this.props.navigation.getParam('industry_type', null),
      product_type: this.props.navigation.getParam('product_type', null),
      user: itemId,
      selectedType: 'Select Potential Business',
      leadclosurestatus: 'Select Lead Closure Status',
      selectedindustry:'Select Industry Type',
      selectedsegment:'Select Segment Type',
      leadprogressval: 'Select Lead Progress Status',
      visitdate: withoutTime,
      nextvisitdate:'',
      numberHolder: 1,
      showSpinner: false,
      dvr_showSpinner: false,
      /*newlatitude:'',
      newlongitude:'',
      newlocationname:'',*/
      startDate: new Date(),
      nextDate: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangenext = this.handleChangenext.bind(this);
  }
  
  render() {
   
    const {
      spinnerTextStyle
    } = styles;
    
    return (
      
      <SafeAreaView>
         <ScrollView style={styles.scrollView}>


        <View
          style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>

          <Header companyName={"SPM"} />

          <Spinner
            visible={this.state.showSpinner}
            textContent={'Sending Feedback'}
            textStyle={spinnerTextStyle}
            color='#fff'
            overlayColor='rgba(0, 0, 0, 0.5)'
            size='large'
            animation='fade'
          />

<Spinner
            visible={this.state.dvr_showSpinner}
            textContent={'Fetching Location'}
            textStyle={spinnerTextStyle}
            color='#fff'
            overlayColor='rgba(0, 0, 0, 0.5)'
            size='large'
            animation='fade'
          />
<Text style={{ marginLeft: 5, marginBottom:0,paddingLeft: 20 }}>
        Closing Date
        </Text>

      <View style={[styles.pickerWrapper,{textAlign:'center'}]}>
            <Text 
               style={{marginBottom:15,textAlign:'center'}}>
              {this.state.visitdate}

            </Text>
         </View>
</View>
<View >
      <View
            style={{marginTop:10,marginHorizontal:20}}>

            <OutlinedTextField
              label='Enter Company NTN'
              autoCorrect={false}
             // name='ntncompany'
              multiline={true}
              onChangeText={text => this.setState({ company_ntn: text })}
              animationDuration={1000}
              autoCapitalize='none'

            />

          </View>
     
        
          <View style={styles.pickerWrapper}>
            <Dropdown
              data={this.state.drop_down_data}
              onChangeText={value => {
                this.setState({ selectedsegment: value }, () => {
                //  console.log(this.state.selectedsegment);
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
              placeholder="Select Segment Type"
              textInputProps={
                {
                  placeholder: this.state.selectedsegment,
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
              value={this.state.selectedsegment}

            />
          </View>
 
       
          {this.state.selectedsegment === 'Select Segment Type' ? null : 
      
          <View
            style={{ marginHorizontal: 20, backgroundColor: '#FF1493', borderRadius: 10, marginTop: 30 }}>
            <Button
              title='Submit'
              color='#FF1493'
              onPress={() => this.sendFeedbackToSPM()}
            />
          </View>
  }


        </View>
        </ScrollView>
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
//const [date, setDate] = useState(new Date());
//const [open, setOpen] = useState(false);

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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
});

export default SPM;

import React, { Component } from 'react';
//import DatePicker from the package we installed
//import {useState} from 'react';
import DatePicker from 'react-native-datepicker';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { Dropdown } from 'react-native-material-dropdown';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  View,
  Alert,
} from 'react-native';
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
import Spinner from 'react-native-loading-spinner-overlay';
import { Button } from 'react-native-elements';
import {
  OutlinedTextField,
} from 'react-native-material-textfield';
var hqdrivencompanyname = '';
const industry = [
  {id: 1, name: 'Auto, Transportation and logistics'},
  {id: 2, name: 'B2G'},
  {id: 3, name: 'Banking & Finance'},
  {id: 4, name: 'FMCG, Food & Restaurant Industry'},
  {id: 5, name: 'Health & Pharma'},
  {id: 6, name: 'Manufacturing, Construction & Property, Textile & Engineering'},
  {id: 7, name: 'Media, Education, NGO, Travel & Tourism'},
  {id: 8, name: 'Power, Oil, Chemical & GAS'},
  {id: 9, name: 'Services'},
  {id: 10, name: 'Technology & IT'},
  {id: 11, name: 'Wholesaler, Retailer & Traders'},
];
const products = [
  {id: 1, name: 'Domestic Private Lease Circuit DPLC'},
  {id: 2, name: 'Industrial Routers'},
  {id: 3, name: 'Managed Wifi'},
  {id: 4, name: 'Push to Talk'},
  {id: 5, name: 'Short Message Peer to Peer SMPP'},
  {id: 6, name: 'Video Surveillance Zong Linkup'},
  {id: 7, name: 'Bike Tracker'},
  {id: 8, name: 'Bulk Voice Messages BVM'},
  {id: 9, name: 'Cold Chain Monitoring'},
  {id: 10, name: 'Corporate Bulk SMS CBS'},
  {id: 11, name: 'Coverage Solutions IBS Micro & Macro Sites'},
  {id: 12, name: 'Customized Software Application Develop'},
  {id: 13, name: 'Data Pool'},
  {id: 14, name: 'Dedicated Internet Access DIA'},
  {id: 15, name: 'Employee Management'},
  {id: 16, name: 'Energy Management Solution'},
  {id: 17, name: 'ESS Products'},
  {id: 18, name: 'Fuel Monitoring'},
  {id: 19, name: 'Genset Monitoring'},
  {id: 20, name: 'GSM'},
  {id: 21, name: 'Handsets & Terminals'},
  {id: 22, name: 'Integrated Data Center'},
  {id: 23, name: 'Internet SIMs'},
  {id: 24, name: 'IPLC'},
  {id: 25, name: 'Machine to Machine Solution M2M'},
  {id:26, name: 'Mobile Broadband MBB'},
  {id:27, name: 'MPLS'},
  {id:28, name: 'Primary Rate Interface PRI SIP'},
  {id:29, name:'Public Cloud'},
  {id:30, name:'SD WAN'},
  {id:31, name:'Vehicle Tracker'},
  {id:32, name:'Video Conferencing'},
  {id:33, name:'Virtual Private Branch Exchange VPBX Customer Acquisition Platform CAP'},
  {id:34,name:'Water Management Solution'},
  {id:35,name:'Workforce Productivity Managemement'},
  {id:36,name:'Zong Secure Connect'},
  {id:37,name:'Zong Track GPS'},
  {id:38,name:'Zong Track LBS'},
  {id:38,name:'Z-Verse'},

];
class DVRHQ extends Component {

  
  state = {
    selectedItems : []  
      // This is a default value...
  
  };


  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };
  checklocationstatus = () => {
   
   if (this.state.lat_info === 'notfetch' || this.state.long_info === 'notfetch') {
     // console.log('here is the latitude:kl ', this.state.lat_info);
    // console.log('here is the latitude:in if statement DVR', this.state.lat_info);
    //console.log('here is the longitude:kl DVR', this.state.long_info);
   this.locationcheck();
       return;}
       else{
       
        setTimeout(() => {
          this.setState({ dvr_showSpinner: false });
        }, this.state.spinnerTimeOutValue);
       
        this.sendFeedbackToServer();

       }
     }

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
          const cleanedArray = [];
      
          for(var i=0;i<res.sellerid.length;i++)
          {
          //  cleanedArray.push(res.companyname[i]);
         //   console.log('kkf',res.companyname[i]);
            let obj = {   
              name:res.companyname[i],     
              id: res.industry[i],        
            }
            cleanedArray.push(obj);
          }

          this.setState({hqdrivenarray:cleanedArray});
      //    console.log(this.state.hqdrivenarray);
         
         }
        

        })
        .catch(err => {  
           //console.log('kkf',res.companyname[i]);
            this.setState({getaccounttypeval:'New Account'});
         
          console.log(err) });
    };

  sendFeedbackToServer = () => {
    //console.log(this.state.selectedinterest);
    //console.log(this.state.selectedoperator);
    this.getindustry();
    if(this.state.getvisittypeval === 'Select Visit Type'){
      Alert.alert('Incomplete Form', 'Please select visit type');
      return;
    }
   
  
    
     if(this.state.poc_contactno === ''){
      Alert.alert('Incomplete Form', 'Please select POC contact number');
      return;
     }

     if(this.state.poc_name === ''){
      Alert.alert('Incomplete Form', 'Please select POC name');
      return;
     }


      
    if(this.state.selectedoperator === 'Select Service Provider'){
      Alert.alert('Incomplete Form', 'Please select current service provider');
      return;
    }

     
    if (this.state.expirydate === '') {  
      Alert.alert('Incomplete Form', 'Please select expiry date');
        return;
      }
 
      if (this.state.setproductvalues.length === 0 || this.state.setexisting_prod_values.length === 0 ) {
        Alert.alert('Incomplete Form', 'Please select products, existing products in-use');
       
        return;
      }

      if(this.state.amountrange === 'Select Amount Range'){
        Alert.alert('Incomplete Form', 'Please select amount range');
        return;
      }
  
      if(this.state.selectedinterest === 'Select Customer Interest'){
        Alert.alert('Incomplete Form', 'Please select customer response');
        return;
      }
      if(this.state.selectedinterest === 'Not Interested' && this.state.selectednotinterest === 'Select Reason of Not-Interested'){
        Alert.alert('Incomplete Form', 'Please select reason of customers lack of interest');
        return;
      }
   
  if(this.state.getaccounttypeval === 'HQ Account'){
    const hq_arrayToClean = this.state.selectedhqaccounts;
    console.log(hq_arrayToClean);
   // let newhqacc = '';
    hq_arrayToClean.forEach((val, index) => {
      if (val.name !== null) {
       // val.name
       // this.state.getHQaccounts.push(val.name);

      hqdrivencompanyname = val.name;
      // console.log('newhqacc'+newhqacc);
       console.log(hqdrivencompanyname);
       //console.log(index);
              //this.setState({company_name: hqdrivencompanyname+"_hq"});  
              this.state.company_name = hqdrivencompanyname+"_hq";
             // console.log(this.state.company_name); 
        this.state.setindustryvalues.push(val.id);
      }
    });
   
    console.log("company name wirh hq",this.state.company_name);
    //console.log(this.state.setindustryvalues);
  
   } 
      if(this.state.setindustryvalues.length === 0){
        Alert.alert('Incomplete Form', 'Please select industry');
        return;
      }
  
      
      if (this.state.leadclosurestatus == 'Closed' && this.state.comments == 'Please enter comments')
      {
        //console.log("closed");
        Alert.alert('Incomplete Form', 'Please enter comments');
       
        return;
           
      }

      if (this.state.leadclosurestatus == 'Open' && this.state.way_forward == 'Please enter comments')
      {
        //console.log("open");
        Alert.alert('Incomplete Form', 'Please enter comments');
        return;
           
      }
    if (this.state.leadclosurestatus == 'Closed' && this.state.leadprogressval == 'Select Lead Progress Status'  ) {
     
     // this.state.way_forward= this.state.comments;   
      Alert.alert('Incomplete Form', 'Please select closed lead progress status and enter comments');
    return;
       
  }
 
 
   /* else if (ntncompany.trim().length !== 0) {
      Alert.alert('Incomplete Form', 'Please select lead closure status');
      return;
    }*/
  if (this.state.visitdate >= this.state.nextvisitdate && this.state.leadclosurestatus == 'Open') {
      Alert.alert('Please select next visit date correctly!', 'Next visit date cannot be less than last visit date');
      return;
    }  else {
      this.GenerateRandomNumber;
      this.setState({ showSpinner: true });
     
    if (this.state.leadclosurestatus == 'Open') {
      //Alert.alert('visit',this.state.visitdate);
    //  this.state.nextvisitdata = '2023-01-01';
      this.state.leadprogressval= "Open";
     
 
  }
  else
  {
    this.state.way_forward= this.state.comments;  
  }
  

   
/*console.log(this.state.selectedoperator);
console.log(this.state.poc_name);
console.log(this.state.company_name);
console.log(this.state.setindustryvalues);
*/
      return fetch('https://gcssbi.zong.com.pk/index.php/summary/submitDVR/', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        }),

    body: "user_id=" +this.state.user.user_id + "&LeadID=" + this.state.user.seller_id+"_"+this.state.numberHolder+ "&sellerID=" + this.state.user.seller_id + "&companyname=" +this.state.company_name + "&POCName=" +this.state.poc_name+ "&POCcontact_no=" +this.state.poc_contactno+ "&PotentialBusiness="+this.state.setproductvalues +"&visitdate="+this.state.visitdate +"&leadstatus="+this.state.leadprogressval+"&latitude="+this.state.lat_info+"&longitude="+this.state.long_info+"&leadclosure_status="+this.state.leadclosurestatus+"&officelocation="+this.state.address_info+"&next_visitdate="+this.state.nextDate+"&wayforward="+this.state.way_forward+"&region="+this.state.user.big_region+"&visit_type="+this.state.getvisittypeval+"&industry_type="+this.state.setindustryvalues+"&existing_prod="+this.state.setexisting_prod_values+"&customer_int="+this.state.selectedinterest+"&contract_expiry_date="+this.state.expirydate+"&amount_range="+this.state.selectedrange+"&service_provider="+this.state.selectedoperator+"&cust_not_int="+this.state.selectednotinterest+"&acc_type_val="+this.state.getaccounttypeval
     
      })
        .then(response => response.text())
        .then((text) => {
          text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          //alert(text);
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
              'Visit Status',
              'Visit details submitted successfully',
              [
                {
                  text: 'OK',
                  onPress: () => {
                   
                    this.setState({long_info : 'notfetch'});
                    this.setState({lat_info : 'notfetch'});
                    this.setState({setproductvalues : []});
                    this.setState({setindustryvalues : []});
                  //  this.setState({selectedhqaccounts : ''});
                    this.setState({setexisting_prod_values : []});
                   
                 
                   
                     if (this.state.leadclosurestatus != 'Open' && this.state.leadprogressval == 'Successful') {
                    
                    this.props.navigation.navigate('SPM',{
                      employee_no: this.state.user.employee_no,
                      poc_no:this.state.poc_contactno,
                      poc_name:this.state.poc_name,
                      compname:this.state.company_name,
                      email:this.state.user.email,
                      region_location: this.state.user.region_location,
                      industry_type:this.state.setindustryvalues,
                      product_type:this.state.setproductvalues,
                      remarks: this.state.comments,        
                   });
                  // this.props.navigation.goBack(null);
                  }
                  else{
                    this.props.navigation.goBack(null);
                  }
                  
           
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

  
  GenerateRandomNumber=()=>
  {
    //date_default_timezone_set('Asia/Kolkata');
   // const { uuid } = require('uuidv4');
    //console.log(uuid());
  //  const id = uuidv1();
   // console.log(id);

   
  var RandomNumber = Date.now().toString(36);
   
 
    this.setState({ numberHolder: RandomNumber })
 
  }
  
  getindustry = () => {
      // console.log('product type',this.state.selectedItems);
 
       //console.log(this.state.selectedItems);
      // const drop_down_data = [];
        const arrayToClean = this.state.selectedItems;
        //const productvalues = [];

        arrayToClean.forEach((val, index) => {
          if (val.name !== null) {
            val.name
           this.state.setproductvalues.push(val.name);
          }
        });
   
//console.log('return product values: ',this.state.setproductvalues);  

const ind_arrayToClean = this.state.selectedindustry;
       
        ind_arrayToClean.forEach((val, index) => {
          if (val.name !== null) {
            //val.name
            this.state.setindustryvalues.push(val.id+"-"+val.name);
          }
        });


    const exi_arrayToClean = this.state.selectedexisting_product;
       
        exi_arrayToClean.forEach((val, index) => {
          if (val.name !== null) {
            val.name
            this.state.setexisting_prod_values.push(val.name);
          }
        });

       
      }
 

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
  getselectedinterest = () => {
    let data = [
      {
        value: 'Interested',
      },
      {
        value: 'Not-Interested',
      }
    ];
    this.setState({ customerbehaviour: data });
  };
  getamountrange = () => {
    let dataclosed = [
      {
        value: '0-25K',
      },
      {
        value: '25K-50K',
      }
      ,
      {
        value: '50K-150K',
      }
      ,
      {
        value: '150K-300K',
      }
      ,
      {
        value: '300K-500K',
      }
      ,
      {
        value: '500k-750K',
      }
      ,
      {
        value: '750k-1M',
      }
      ,
      {
        value: 'Greater than 1M',
      }
    ];
    this.setState({ amountrange: dataclosed });
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

  getvisitstatus = () => {
    let dataclosed = [
      {
        value: 'Random Visit',
      },
      {
        value: 'Scheduled Visit',
      }
    ];
    this.setState({ visitstatustype: dataclosed });

    let accountopt = [
      {
        value: 'HQ Account',
      },
      {
        value: 'New Account',
      }
    ];
    this.setState({ accounttype: accountopt });
  };

  getoperatorstatus = () => {
    let data = [
      {
        value: 'Jazz',
      },
        {
          value: 'Zong',
        },
      {
        value: 'Telenor',
      },
      {
        value: 'Warid',
      }
      ,
      {
        value: 'Wateen',
      }
      ,
      {
        value: 'PTCL',
      }
      ,
      {
        value: 'Ufone',
      }
      ,
      {
        value: 'Nayatel',
      }
      ,
      {
        value: 'Cybernet',
      }
      ,
      {
        value: 'Transworld',
      },
      ,
      {
        value: 'Other',
      }
    ];
    this.setState({ operatortypes: data });
  };

  getnot_interestedstatus = () => {
    let data = [
      {
        value: 'Already in contract with other service provider',
      },
      {
        value: 'Currently customer doesn’t have the required budget',
      },
      {
        value: 'Bad Experience in past',
      }
      ,
      {
        value: 'Weak Coverage Area',
      }
      ,
      {
        value: 'Price too High',
      }
      ,
      {
        value: 'Product/Solution not available',
      }
    ];
    this.setState({ notinterestedtype: data });
  };
 locationcheck = async () => {

  try {
    
    const eventId = await CalendarModule.createCalendarEvent(
      'Party',
      'My House',
    );
   // 
    if(eventId == "Not found"){
    //  console.log('Location address not found');

      
      Alert.alert(
        'Device Location Status',
        'Unable to fetch your location.Please wait!',
        [
          {
            text: 'OK',
            
            onPress: () => {
              
              this.setState({ dvr_showSpinner: true });
             
             this.checklocationstatus();
              
           
          }
          }
        ],
        {
          cancelable: true,
          onDismiss: () => {
    
          }
        }
      );
    }
    else{
    var str_array = eventId.replace(/\[|\]/g, '');
    //str_array = eventId.replace(/\]/g, '');
    str_array = str_array.split(',');
  
             
          setTimeout(() => {
            this.setState({ dvr_showSpinner: false });
          }, this.state.spinnerTimeOutValue);
    this.state.lat_info= str_array[0];
    this.state.long_info = str_array[1];
    this.state.address_info = str_array[2];
    
   // console.log('Location address ',this.state.lat_info);
    }
  } catch (e) {
    console.error(e);
  }
};
  componentDidMount() {
    //this.getTypeData();
    this.locationcheck();
    this.getHQaccounts();
    this.getclosurestatus();
    this.GenerateRandomNumber();
   this.getclosedstatus();
   this.getoperatorstatus();
   this.getamountrange();
   this.getselectedinterest();
   this.getvisitstatus();
   this.getnot_interestedstatus();
  }

  
  handleChange(date) {
    this.setState({
      visitdate: date,
      startDate: date
    }, () => {
      //console.log(this.state.visitdate);
    });
  
  }
  handleChangenext(date) {
    this.setState({
      nextvisitdate: date,
      nextDate: date
    }, () => {
      console.log(this.state.expirydate);
    });
  }

  handleChangeexpiry(date) {
    this.setState({
     
      expirydate: date
    }, () => {
      console.log(this.state.expirydate);
    });
  }
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const itemId = params ? params.userids : null;
   // const [withoutTime] = new Date.split('T');
    const date = new Date();
//let visittime = date.getTime();
    //console.log(visittime);
 
const [withoutTime] = date.toISOString().split('T');
console.log(withoutTime); // 👉️ 2022-01-18

    this.state = {
      selectedItems: [],
      selectedindustry: [],
      selectedexisting_product: [],
      selectedhqaccounts: [],
      isLoading: false,
      isSelected:true,
      setSelection:false,
      selectedindustryid:0,
      comments:'Please enter comments',
      way_forward:'Please enter comments',
      lat_info: this.props.navigation.getParam('lat_info', null),
      long_info: this.props.navigation.getParam('long_info', null),
      address_info: this.props.navigation.getParam('address_info', null),
      //user: this.props.navigation.getParam('user', null),
     // selectedindustry:'Select Industry Type',
     // selectedsegment:'Select Segment Type',
      selectedoperator:'Select Service Provider',
      setproductvalues:[],
      setindustryvalues:[],
      setexisting_prod_values:[],
      selectedrange:'Select Amount Range',
      user: itemId,
      otheroperator:'',
      poc_contactno:'',
      poc_name:'',
     // setproductvalues: 'Select Potential Business',
      leadclosurestatus: 'Select Lead Closure Status',
      leadprogressval: 'Select Lead Progress Status',
      getvisittypeval: 'Select Visit Type',
      getaccounttypeval: 'HQ Account',
      selectedinterest:'Select Customer Interest',
      selectednotinterest:'Select Reason of Not-Interested',
      visitdate: withoutTime,
     // gethqdrivenacc:'Select HQ Driven Account',
      nextvisitdate:'',
      company_name:'Select Company Name',
      numberHolder: 1,
      showSpinner: false,
      dvr_showSpinner: false,
      /*newlatitude:'',
      newlongitude:'',
      newlocationname:'',*/
      startDate: new Date(),
      nextDate: '',
      expirydate:'',
     
      hqdrivenarray:[],

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangenext = this.handleChangenext.bind(this);
    this.handleChangeexpiry = this.handleChangeexpiry.bind(this);
  }
  
  render() {
   
    const {
      spinnerTextStyle
    } = styles;
      
    return (
      <SafeAreaView>
  <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='always' overScrollMode = 'auto'>
   
        <View
          style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>

          <Header companyName={"Daily Visit Report Form"} />

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
        Customer Visit Date
        </Text>

      <View style={[styles.pickerWrapper,{textAlign:'center'}]}>
            <Text 
               style={{marginBottom:15,textAlign:'center'}}>
              {this.state.visitdate}

            </Text>
         </View>
</View>


<View style={styles.pickerWrapper}>
            <Dropdown
              data={this.state.visitstatustype}
              
              onChangeText={(value,index) => {     
                   
                this.setState({ getvisittypeval: value }, () => {
                  console.log(this.state.getvisittypeval);
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
             
              //resetValue={false}
              placeholder="Select Visit Type"
              textInputProps={
                {
                  placeholder: this.state.getvisittypeval,
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
              value={this.state.getvisittypeval}

            />
          </View>
             
<View>

             
<View style={styles.pickerWrapperSearch}>
        <SearchableDropdown
            multi={true}
            selectedItems={this.state.selectedhqaccounts}
            onItemSelect={(item,index) => {
             
              const items = this.state.selectedhqaccounts;
              //setItemname(item.value);
              items.push(item)
              this.setState({ selectedhqaccounts: items });
            }}
            
            onRemoveItem={(item, index) => {
              const items = this.state.selectedhqaccounts.filter((sitem) => sitem.id !== item.id);
              this.setState({ selectedhqaccounts: items });
            }}
           
            containerStyle={{ padding: 0 }}
            itemStyle={{
              padding: 10,
              marginTop: 10,
              backgroundColor: '#eee',
              borderColor: '#8dc540',
              borderWidth: 1,
              overflow: 'scroll',
              marginHorizontal:20,
            }}
            itemTextStyle={{ color: '#000' }}
            itemsContainerStyle={{ maxHeight: 100, overflow: 'scroll' }}
            items={this.state.hqdrivenarray}
            defaultIndex={0}
            chip={true}
            resetValue={false}
           
            textInputProps={
              {
                placeholder: "Select HQ Account",
                underlineColorAndroid: "transparent",
                
               // onTextChange: text => alert(text)
              }
            }
            listProps={
              {
                nestedScrollEnabled: true,
              }
            }
          />
</View>

          <View
            style={{marginTop:10,marginHorizontal:20}}>

            <OutlinedTextField
              label='Enter POC Name'
              autoCorrect={false}
             // name='ntncompany'
              multiline={true}
              onChangeText={text => this.setState({ poc_name: text })}
              animationDuration={1000}
              autoCapitalize='none'

            />

          </View>
          <View
            style={{marginTop:10,marginHorizontal:20}}>

            <OutlinedTextField
              label='Enter POC Contact No.'
              autoCorrect={false}
             // name='ntncompany'
              multiline={true}
              onChangeText={text => this.setState({ poc_contactno: text })}
              animationDuration={1000}
              autoCapitalize='none'
            />
          </View>
          <View style={styles.pickerWrapper}>
            <Dropdown
              data={this.state.operatortypes}
              onChangeText={value => {
                this.setState({ selectedoperator: value }, () => {
                //  console.log(this.state.selectedsegment);
                })
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
              placeholder="Select Service Provider"
              textInputProps={
                {
                  placeholder: this.state.selectedoperator,
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
              value={this.state.selectedoperator}

            />
          </View>

          {this.state.selectedoperator != 'Other' ? null : 
      
      <View
        style={{ marginHorizontal: 20 }}>

        <OutlinedTextField
          label='Enter Operator Name'
          autoCorrect={false}
          multiline={true}
          onChangeText={text => this.setState({ otheroperator: text })}
          animationDuration={1000}
          autoCapitalize='none'
        
      
        />
      
      </View>
}

<View style={{ marginBottom: 5}}>
          <Text style={{ marginLeft: 5, marginBottom:5,marginTop:5,paddingLeft: 20,fontfamily: 'lucida grande', fontsize: 11  }}>
         Please select contract expiry date
        </Text>
       
        <DatePicker
          style={{marginTop: 5,marginBottom:0,paddingLeft: 20,width:340}}
          date= { this.state.expirydate } // Initial date from state
          mode="date" // The enum of date, datetime and time
          placeholder="Select contract expiry date"          
          dateformat="YYYY-DD-MM"
          minDate="01-01-2022"
          maxDate="31-12-2022"
          selected={ this.state.expirydate }
          onDateChange={ this.handleChangeexpiry }
          name="ContractExpiryDate"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              //display: 'none',
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 0,
            },
          }}
         
        />
      </View>
<View style={styles.pickerWrapperSearch}>
        <SearchableDropdown
            multi={true}
            selectedItems={this.state.selectedexisting_product}
            onItemSelect={(item,index) => {
             
              const items = this.state.selectedexisting_product;
              //setItemname(item.value);
              items.push(item)
              this.setState({ selectedexisting_product: items });
            }}
            
            onRemoveItem={(item, index) => {
              const items = this.state.selectedexisting_product.filter((sitem) => sitem.id !== item.id);
              this.setState({ selectedexisting_product: items });
            }}
           
            containerStyle={{ padding: 0 }}
            itemStyle={{
              padding: 10,
              marginTop: 10,
              backgroundColor: '#eee',
              borderColor: '#8dc540',
              borderWidth: 1,
              overflow: 'scroll',
              marginHorizontal:20,
            }}
            itemTextStyle={{ color: '#000' }}
            itemsContainerStyle={{ maxHeight: 100, overflow: 'scroll' }}
            items={products}
            defaultIndex={0}
            chip={true}
            resetValue={false}
           
            textInputProps={
              {
                placeholder: "Select Exisitng Product In-Use",
                underlineColorAndroid: "transparent",
                
               // onTextChange: text => alert(text)
              }
            }
            listProps={
              {
                nestedScrollEnabled: true,
              }
            }
          />
</View>   


<View style={styles.pickerWrapper}>
            <Dropdown
              data={this.state.amountrange}
              onChangeText={value => {
                this.setState({  selectedrange: value }, () => {
                 // console.log(this.state.leadclosurestatus);
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
              placeholder="Select Range"
              textInputProps={
                {
                  placeholder: this.state.selectedrange,
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
              value={this.state.selectedrange}

            />
          </View>
          <View style={styles.pickerWrapper}>
            <Dropdown
              data={this.state.customerbehaviour}
              onChangeText={value => {
                this.setState({ selectedinterest: value }, () => {
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
              placeholder="Select Customer Behaviour"
              textInputProps={
                {
                  placeholder: this.state.selectedinterest,
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
              value={this.state.selectedinterest}

            />
          </View>
          {this.state.selectedinterest === 'Interested' || this.state.selectedinterest === 'Select Customer Interest'  ? null : 
          <View style={styles.pickerWrapper}>
            <Dropdown
              data={this.state.notinterestedtype}
              onChangeText={value => {
                this.setState({ selectednotinterest: value }, () => {
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
              placeholder="Select Visit Type"
              textInputProps={
                {
                  placeholder: this.state.selectednotinterest,
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
              value={this.state.selectednotinterest}

            />
          </View>
          }

   
<View style={styles.pickerWrapperSearch}>
        <SearchableDropdown
            multi={true}
            selectedItems={this.state.selectedItems}
            onItemSelect={(item,index) => {
             
              const items = this.state.selectedItems;
              //setItemname(item.value);
              items.push(item)
              this.setState({ selectedItems: items });
            }}
            
            onRemoveItem={(item, index) => {
              const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
              this.setState({ selectedItems: items });
            }}
           
            containerStyle={{ padding: 0 }}
            itemStyle={{
              padding: 10,
              marginTop: 10,
              backgroundColor: '#eee',
              borderColor: '#8dc540',
              borderWidth: 1,
              overflow: 'scroll',
              marginHorizontal:20,
            }}
            itemTextStyle={{ color: '#000' }}
            itemsContainerStyle={{ maxHeight: 100, overflow: 'scroll' }}
            items={products}
            defaultIndex={0}
            chip={true}
            resetValue={false}
           
            textInputProps={
              {
                placeholder: "Select Product Type",
                underlineColorAndroid: "transparent",
                
               // onTextChange: text => alert(text)
              }
            }
            listProps={
              {
                nestedScrollEnabled: true,
              }
            }
          />
</View>        
 
         

        
  
    
    
  
          <View style={styles.pickerWrapper}>
            <Dropdown
              data={this.state.leadclosuretype}
              onChangeText={value => {
                this.setState({ leadclosurestatus: value }, () => {
                 // console.log(this.state.leadclosurestatus);
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
              placeholder="Select Lead Closure Status"
              textInputProps={
                {
                  placeholder: this.state.leadclosurestatus,
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
              value={this.state.leadclosurestatus}

            />
          </View>
  
          {this.state.leadclosurestatus === 'Open' || this.state.leadclosurestatus === 'Select Lead Closure Status' ? null : 
          
          <View style={styles.pickerWrapper}>
            <Dropdown
              data={this.state.leadclosedtype}
              onChangeText={value => {
                this.setState({ leadprogressval: value }, () => {
                 // console.log(this.state.leadprogressval);
                  //console.log(value);
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
              placeholder="Select Lead Progress Status"
              textInputProps={
                {
                  placeholder: this.state.leadprogressval,
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
              value={this.state.leadprogressval}

            />
          </View>
 
            }     
         
          {this.state.leadclosurestatus === 'Open' || this.state.leadclosurestatus === 'Select Lead Closure Status' ? null : 
      
          <View
            style={{ marginHorizontal: 20 }}>

            <OutlinedTextField
              label='Enter Comments'
              autoCorrect={false}
              multiline={true}
              onChangeText={text => this.setState({ comments: text })}
              animationDuration={1000}
              autoCapitalize='none'
                     
            />
          
          </View>
  }
       
          {this.state.leadclosurestatus === 'Closed' || this.state.leadclosurestatus === 'Select Lead Closure Status' ? null : 
        <View>
          <Text style={{ marginLeft: 5, marginBottom:0,paddingLeft: 20,fontfamily: 'lucida grande', fontsize: 11  }}>
         Please select next visit date
        </Text>
       
        <DatePicker
          style={{marginTop: 5,marginBottom:0,paddingLeft: 20,width:340}}
          date= { this.state.nextDate } // Initial date from state
          mode="date" // The enum of date, datetime and time
          placeholder="Select next visit date"          
          dateformat="YYYY-DD-MM"
          minDate="01-01-2022"
          maxDate="31-12-2022"
          selected={ this.state.nextDate }
          onDateChange={ this.handleChangenext }
          name="NextVisitDate"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              //display: 'none',
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 0,
            },
          }}
         
        />
      </View>}

      {this.state.leadclosurestatus === 'Closed' || this.state.leadclosurestatus === 'Select Lead Closure Status' || this.state.selectedinterest === 'Select Customer Interest' ? null : 
         <View
            style={{ marginHorizontal: 20, marginTop:10 }}>

            <OutlinedTextField
              label='Enter way forward'
              autoCorrect={false}
              multiline={true}
              onChangeText={text => this.setState({ way_forward: text})}
              animationDuration={1000}
              autoCapitalize='none'

            />

          </View>  } 

          { this.state.leadclosurestatus === 'Select Lead Closure Status'  ? null : 
      
          <View
            style={{ marginHorizontal: 20, backgroundColor: '#FF1493', borderRadius: 10, marginTop: 30 }}>
            <Button
              title='Submit'
              color='#FF1493'
              onPress={() =>this.checklocationstatus()}
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
    marginTop: 10,
    marginHorizontal: 20,
    borderColor: 'grey',
    borderWidth: 1,
    justifyContent: 'center',
    padding: 5,
    marginBottom: 10,
  },

  pickerWrapper: {
    borderRadius: 8,
    borderColor: 'grey',
    borderWidth: 1,
    height: 50,
    justifyContent: 'flex-end',
    marginTop: 10,
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

export default DVRHQ;



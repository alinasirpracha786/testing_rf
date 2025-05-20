import React, { Component,useState } from 'react';
import MultiSelect from 'react-native-multiple-select';
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



 
class leadopenHQ extends Component { 

  
  
  handleChange(date) {
    
    this.setState({
      visitdate: date,
      startDate: date
    }, () => {
     // console.log(this.state.visitdate);
    });
   /* this.setState({ visitdata: date }, () => {
      console.log(this.state.visitdate);
    });*/
  // // e.preventDefault();
  //  console.log(this.state.startDate)
  }
  handleChangenext(date) {
    
    this.setState({
      nextvisitdate: date,
      nextDate: date
    }, () => {
    //  console.log(this.state.nextvisitdate);
    });
   /* this.setState({ visitdata: date }, () => {
      console.log(this.state.visitdate);
    });*/
   // e.preventDefault();
  // console.log("nextdd");
   
    //console.log(this.state.nextDate)
  }
  state = {
    
    selectedItems : [],

      // This is a default value...
  
  };

  
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
    
  };
  openvisitlocationstatus = () => {
    console.log('here is the latitude:kl DVR', this.state.employee_no);
   if (this.state.lat_info === 'notfetch' || this.state.long_info === 'notfetch') {
   //   console.log('here is the latitude:kl ', this.state.lat_info);
  // console.log('here is the latitude:in if statement DVR', this.state.lat_info);
   //console.log('here is the longitude:kl DVR oopen already', this.state.long_info);
   this.openvisitlocationcheck();
       return;}
       else{
       
        setTimeout(() => {
          this.setState({ dvr_showSpinner: false });
        }, this.state.spinnerTimeOutValue);
       
        this.sendupdateToServer();

       }
     }
//
openvisitlocationcheck = async () => {

  try {
    
    const eventId = await CalendarModule.createCalendarEvent(
      'Party',
      'My House',
    );
   // 
    if(eventId == "Not found"){
     // console.log('Location address not found');

      
      Alert.alert(
        'Device Location Status',
        'Unable to fetch your location.Please wait!',
        [
          {
            text: 'OK',
            
            onPress: () => {
            
              this.setState({ dvr_showSpinner: true });
             this.openvisitlocationstatus();
           
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
    
  //  console.log('Location address ',this.state.lat_info);
    }
  } catch (e) {
    console.error(e);
  }
};
  sendupdateToServer = () => {
    this.gpson();
   
    if (this.state.selectedType === 'Select Potential Business') {
      Alert.alert('Incomplete Form', 'Please select Potential Business');
      return;
    } /*else if (this.state.sellerID.length === 0) {
      Alert.alert('Incomplete Form', 'Please add SellerID');
      return;
    } */
    if(this.state.nextDate === '' && this.state.leadclosurestatus == 'Open'){
      Alert.alert('Incomplete Form', 'Please select Next Visit Date');
      return;
    }
    
    else if ( this.state.leadclosurestatus == 'Open' && this.state.next_visit >= this.state.nextvisitdate) {
      //Alert.alert('visit',this.state.next_visit);
     // Alert.alert('visit',this.state.next_visit);
      //Alert.alert('visitnnn',this.state.startDate);
     // this.state.selectedType = this.state.leadclosurestatus;
     Alert.alert('Please select next visit date correctly!', 'Next visit date cannot be less than last visit date');
      return;
    
  }
  else 
    {
      //this.generateRandomNumber;
      console.log("user_id=" +this.state.userdvr + "&LeadID=" +this.state.leadid+ "&sellerID=" + this.state.sellerid + "&companyname=" +this.state.selectedCompany+ "&POCName=" +this.state.pocname+ "&POCcontact_no=" +this.state.pocno+ "&PotentialBusiness="+this.state.potentialbusiness +"&visitdate="+this.state.next_visit +"&leadstatus="+this.state.leadprogressval+"&latitude2="+this.state.lat_info+"&longitude="+this.state.long_info+"&leadclosure_status="+this.state.leadclosurestatus+"&officelocation="+this.state.address_info+"&next_visitdate="+this.state.nextvisitdate+"&wayforward="+this.state.updatedcomments+"&region="+this.state.region+"&service_provider="+this.state.service_provider+"&customer_interest="+this.state.customer_interest+"&existing_prod_inuse="+ this.state.existing_prod_inuse+"&industry_type="+this.state.industry_type+"&contract_expiry_date="+this.state.contract_expiry_date+"&amount_range="+this.state.amount_range+"&cust_not_interested="+this.state.cust_not_interested);
   
      this.setState({ showSpinner: true });
    
   /*   console.log('here is the user_id: ',this.state.userdvr );
      console.log('here is the lead closure status: ',this.state.selectedType);
      console.log('here is the lat info: ',this.state.lat_info);
      console.log('here is the long info: ',this.state.long_info);
      console.log('here is the leadclosure: ', this.state.leadclosurestatus);
      console.log('here is the updatedcomments: ', this.state.updatedcomments);*/
    //  console.log('here is the company: ', this.state.companyselected);
    /*  console.log('here is the nextvisitdate: ', this.state.nextvisitdate);
      console.log('here is the leadid: ', this.state.leadid);

      console.log('here is the PotentialBusiness: ', this.state.potentialbusiness);
      console.log('here is the username: ', this.state.username);
      console.log('here is the sellerID: ', this.state.sellerid);
      console.log('here is the phone: ', this.state.mobile_no);
      console.log('here is the leadclosure: ', this.state.leadclosurestatus);
      console.log('here is the comments: ', this.state.comments);
      console.log('here is the company: ', this.state.company_name);
      console.log('here is the nextvisitdate: ', this.state.nextvisitdate);
      console.log('here is the visitdate: ', this.state.next_visit);*/
      //console.log('here is value', this.state.office_loc);
    //  console.log('here is value region', this.state.region);
      if(this.state.leadclosurestatus == 'Open'){
       // console.log('here is value', this.state.leadprogressval);
      this.state.leadprogressval = this.state.leadclosurestatus;
     // console.log('here is value closure', this.state.leadprogressval);
      }
       return fetch('https://gcssbi.zong.com.pk/index.php/summary/updateDVRform/', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        }),
      // body: "user_id=" +this.state.userdvr + "&LeadID=" +this.state.leadid+ "&sellerID=" + this.state.sellerid + "&companyname=" +this.state.selectedCompany+ "&POCName=" +this.state.pocname+ "&POCcontact_no=" +this.state.mobile_no+ "&PotentialBusiness="+this.state.potentialbusiness +"&visitdate="+this.state.next_visit +"&leadstatus="+this.state.selectedType+"&sellercomments="+this.state.comments+"&leadclosure_status="+this.state.leadclosurestatus+"&officelocation="+this.state.office_loc+"&next_visitdate="+this.state.nextvisitdate+"&wayforward="+this.state.updatedcomments+"&region="+this.state.region
      //body: "user_id=" +this.state.userdvr + "&LeadID=" +this.state.leadid+ "&sellerID=" + this.state.sellerid + "&companyname=" +this.state.selectedCompany+ "&POCName=" +this.state.pocname+ "&POCcontact_no=" +this.state.mobile_no+ "&PotentialBusiness="+this.state.potentialbusiness +"&visitdate="+this.state.next_visit +"&leadstatus="+this.state.latitude+"&sellercomments="+this.state.longitude+"&leadclosure_status="+this.state.leadclosurestatus+"&officelocation="+this.state.locationname+"&next_visitdate="+this.state.nextvisitdate+"&wayforward="+this.state.updatedcomments+"&region="+this.state.region   visit_type:'',
  
      body: "user_id=" +this.state.userdvr + "&LeadID=" +this.state.leadid+ "&sellerID=" + this.state.sellerid + "&companyname=" +this.state.selectedCompany+ "&POCName=" +this.state.pocname+ "&POCcontact_no=" +this.state.pocno+ "&PotentialBusiness="+this.state.potentialbusiness +"&visitdate="+this.state.next_visit +"&leadstatus="+this.state.leadprogressval+"&latitude2="+this.state.lat_info+"&longitude="+this.state.long_info+"&leadclosure_status="+this.state.leadclosurestatus+"&officelocation="+this.state.address_info+"&next_visitdate="+this.state.nextvisitdate+"&wayforward="+this.state.updatedcomments+"&region="+this.state.region+"&visit_type="+this.state.visit_type+"&service_provider="+this.state.service_provider+"&customer_interest="+this.state.customer_interest+"&existing_prod_inuse="+ this.state.existing_prod_inuse+"&industry_type="+this.state.industry_type+"&contract_expiry_date="+this.state.contract_expiry_date+"&amount_range="+this.state.amount_range+"&cust_not_interested="+this.state.cust_not_interested
  
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
              'Visit status updated successfully',
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
                      employee_no: this.state.employee_no,
                      poc_no:this.state.poc_contactno,
                      email:this.state.email,
                      region_location: this.state.region_location,
                      poc_name:this.state.poc_name,
                      compname:this.state.company_name,
                      industry_type:this.state.selectedindustryid,
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
  getcompanydata = (compval) => {
   // const { var1 } = this.props.compval;
   // alert(compval);
   this.setState({companyselected:compval});
    // run logic on the event and variable
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    //myHeaders.append('Authorization', jwt);
 
    return fetch('https://gcssbi.zong.com.pk/index.php/summary/getcompwisedata?CompanyName='+compval, {
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
       // console.log(JSON.stringify(myData));
       const cleanedArray = [];
       
       for(var i=0;i<res.userid.length;i++)
       {
       //  cleanedArray.push(res.companyname[i]);
        // console.log('kkf',res.companyname[i]);
         let obj = {
           userid: res.userid[i],
           leadid: res.leadid[i],
           value: res.companyname[i],
           pocname:res.pocname[i],
           lastvist:res.visit_date[i],
           businesstype:res.businesstype[i],
           comments:res.seller_comments[i]
         }
         this.setState({leadid:res.leadid[i]});
         this.setState({pocname:res.pocname[i]});
         this.setState({pocno:res.pocno[i]});
         this.setState({potentialbusiness:res.businesstype[i]});
         this.setState({office_loc:res.off_loc[i]});
         this.setState({next_visit:this.state.startDate});
         this.setState({visit_type:res.visit_type[i]});
         this.setState({service_provider:res.service_provider[i]}),
         this.setState({customer_interest:res.customer_interest[i]}),
         this.setState({existing_prod_inuse:res.existing_prod_inuse[i]}),
         this.setState({industry_type:res.industry_type[i]}),
         this.setState({contract_expiry_date:res.contract_expiry_date[i]}),
         this.setState({amount_range:res.amount_range[i]}),
         this.setState({cust_not_interested:res.cust_not_interested[i]}),
        // this.setState({next_visit:this.state.startDate});
         //this.setState({comments:res.seller_comments[i]});
         cleanedArray.push(obj);
       }
       //console.log('arraykeyval',res['data'][0].CompanyName);
       
  /*      const arrayToClean = res['data'];
    
        const cleanedArray = [];
        arrayToClean.forEach((val, index) => {
          if (val.data !== null) {
           console.log(val.data[0][0]);
           // console.log(val.CompanyName);
            let obj = {
              userid: val.User_ID,
              //leadtitle:index.User_ID,
              leadid :val.LeadID,
              sellertitle:'Seller ID',
              seller:val.SellerID,
              pocname:val.POCName,
              pocno:val.POC_ContactNo,
              businesstype:val.Potential_Business,
              lastvisit:val.Visit_Date,
              laststatus:val.Lead_Status,
              comments:val.Seller_Comments,
              leadcolsure:val.Lead_Closure_Status,
              officelocation:val.Office_Location,
              value: val.CompanyName
            }
            cleanedArray.push(obj);
          }
          
        });*/
 
      //  console.log("companies");
       // console.log( cleanedArray);
        this.setState({ companywiseData:  cleanedArray});
        //this.setState({ typeData: data });
      //  console.log('one company data');
      //  console.log(cleanedArray);
      })
      .catch(err => { console.log(err) });
  };
  getDVRDatas = () =>{
   //
   // var obj = JSON.parse(this.state.userdvr);
   // console.log('here is the user_id: ', this.state.userdvr);
   //let jwt = await this._get("jwt");
   var myHeaders = new Headers();
   myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
   //myHeaders.append('Authorization', jwt);

   return fetch('https://gcssbi.zong.com.pk/index.php/summary/checklead?user_id='+this.state.userdvr, {
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
    

      const cleanedArray = [];
      
      for(var i=0;i<res.userid.length;i++)
      {
      //  cleanedArray.push(res.companyname[i]);
       // console.log('kkf',res.companyname[i]);
        let obj = {   
          key:res.leadid[i],     
          value: res.companyname[i],        
        }
        cleanedArray.push(obj);
      }
      //console.log('arraykeyval',res['data'][0].CompanyName);
      
 /*      const arrayToClean = res['data'];
   
       const cleanedArray = [];
       arrayToClean.forEach((val, index) => {
         if (val.data !== null) {
          console.log(val.data[0][0]);
          // console.log(val.CompanyName);
           let obj = {
             userid: val.User_ID,
             //leadtitle:index.User_ID,
             leadid :val.LeadID,
             sellertitle:'Seller ID',
             seller:val.SellerID,
             pocname:val.POCName,
             pocno:val.POC_ContactNo,
             businesstype:val.Potential_Business,
             lastvisit:val.Visit_Date,
             laststatus:val.Lead_Status,
             comments:val.Seller_Comments,
             leadcolsure:val.Lead_Closure_Status,
             officelocation:val.Office_Location,
             value: val.CompanyName
           }
           cleanedArray.push(obj);
         }
         
       });*/

      // console.log("companies");
      // console.log( cleanedArray);
       this.setState({ companyData:  cleanedArray});
       //this.setState({ typeData: data });
    //   console.log(cleanedArray);
     })
     .catch(err => { console.log(err) });
 };

 gpson = async () => {

  try {
    
    const eventId = await CalendarModule.createCalendarEvent(
      'Party',
      'My House',
    );
  
   
    var str_array = eventId.replace(/\[/g, '');
    str_array = str_array.replace(/\]/g, '');
    str_array = str_array.split(',');
    
    this.state.latitude = str_array[0];
    this.state.longitude = str_array[1];
    this.state.locationname = str_array[2];
    
   // console.log('Location address ',this.state.locationname);

  } catch (e) {
    console.error(e);
  }
};
  componentDidMount() {
    this.getDVRDatas();
    this.getclosurestatus();
    this.getclosedstatus();
    this.gpson();
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
  constructor(props) {
    super(props);
   
    //const [date, setDate] = useState(new Date());
      /* 2. Get the param */
 // const { userid } = route.params;
 const date = new Date();
    

 const [withoutTime] = date.toISOString().split('T');
 //console.log(withoutTime); // 👉️ 2022-01-18
 
   /* 2. Read the params from the navigation state */
   const { params } = this.props.navigation.state;
   const itemId = params ? params.userids : null;

   const latinfo = params ? params.lat_info : null;
   const longinfo = params ? params.long_info : null;
   const addressinfo = params ? params.address_info : null;
   const otherParam = params ? params.user_name : null;
   const sellerparam = params ? params.sellerid : null;
   const phoneparam = params ? params.mobile_no : null;
   const regionparam = params ? params.regionname : null;
   const employee_no = params ? params.employee_no : null;
   const email= params ? params.email: null;
   const region_location= params ? params.region_location: null;
    this.state = {
      userdvr: itemId,
      dvr_showSpinner:false,
      username: otherParam,
      email: email,
      region_location: region_location,
      sellerid : sellerparam,
      mobile_no : phoneparam,
      employee_no: employee_no,
      region : regionparam,
      lat_info: latinfo,
      long_info: longinfo,
      address_info: addressinfo,
      comments:'',
      leadclosurestatus: 'Select Lead Closure Status',
      selectedCompany: 'Select Company',
      leadprogressval: 'Select Lead Progress Status',
      selectedleadid: 'lead id',
      updatedcomments:'',
      companyData: [],
      companywiseData: [],
      startDate: withoutTime,
      nextDate: '',
      companyselected:'',
      leadid : '',
      nextvisitdate:'',
      visit_type:'',
      service_provider:'',
      customer_interest:'',
      existing_prod_inuse:'',
     industry_type:'',
      contract_expiry_date:'',
     amount_range:'',
      cust_not_interested:''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangenext = this.handleChangenext.bind(this);
    

  }
  onChangeText = (value, index, data) => {
    const visitId = data[index].key;
    this.setState({ selectedCompany: data[index].value });
    this.getcompanydata(visitId);
   // console.log("cityId", visitId);
  };
 
  render() {
    const { selectedItems } = this.state;
   
    const {
      spinnerTextStyle
    } = styles;
   
    

    return (
      
      <SafeAreaView>
         <ScrollView style={styles.scrollView}>

        <View
          style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>

          <Header companyName={"Company Name"} />

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


    


          <View style={styles.pickerWrapper}>
                  <Dropdown
                    data={this.state.companyData}
                    onChangeText={this.onChangeText}
                   /* onChangeText={text => {
                      this.setState({ selectedCompany: text.key });
                      
                      //this.setState({ selectedleadid: text.key });
                     // alert(text.key);
                     //alert('ddf',this.state.selectedleadid);
                     const myArray = text.split(":");
                     let compsplit = myArray[0];
                     let visitid = myArray[1];
                     this.getcompanydata(visitid);
                    
                     this.state.companyval = compsplit;
                     //s this.getDVRDatas();
                      //this.getAllData();
                    }}*/
                   /* onChange={(e) => {find(e.target.key);
                      console.log(e.target.key)}}*/
                   // key = {this.state.selectedleadid}
                    value={this.state.selectedCompany}
                    //key = 
                  />
                </View>
  
                {this.state.selectedCompany === 'Select Company' ? null : <View style={{
                          flexDirection: 'row',
                          flex: 1,
                          paddingHorizontal: 4,
                          paddingVertical: 5,
                          marginHorizontal: 10,
                          backgroundColor: 'limegreen'
                        }}>
                <Text style={styles.dataHeaderText}>POC Name</Text>
                  <Text style={styles.dataHeaderText}>Last Visit Date</Text>
                  <Text style={styles.dataHeaderText}>Business Types</Text>
             
                  {/* <Text style={styles.dataHeaderText}>Product</Text> */}
                </View>}
                  {this.state.selectedCompany === 'Select Company' ? null :Object.entries(this.state.companywiseData).map(
                    ([key, value], index) => {
                      return (              
                        <View style={styles.stripStyle}>
                          <Text
                            style={[
                              styles.dataHeaderText,
                              { color: '#ed0281', fontWeight: 'bold' },
                            ]}>
                            {value.pocname}
                          </Text>
                          <Text
                            style={[
                              styles.dataHeaderText,
                              { color: '#444444', fontWeight: 'normal' },
                            ]}>
                            {value.lastvist}
                          </Text>
                          <Text
                            style={[
                              styles.dataHeaderText,
                              { color: '#444444', fontWeight: 'normal' },
                            ]}>
                            {value.businesstype}
                          </Text>
                    
                        </View>
                      );
                    })}




{this.state.selectedCompany === 'Select Company' ? null : <View style={{
                          flexDirection: 'column',
                          flex: 1,
                          paddingHorizontal: 4,
                          paddingVertical: 5,
                          marginHorizontal: 10,
                          backgroundColor: 'limegreen'
                        }}>
             
                  <Text style={styles.dataHeaderText}>Comments</Text>
                  {/* <Text style={styles.dataHeaderText}>Product</Text> */}
                </View>}
                  {this.state.selectedCompany === 'Select Company' ? null :Object.entries(this.state.companywiseData).map(
                    ([key, value], index) => {
                      return (              
                        <View style={styles.stripStyle}>
                          
                          <Text
                            style={[
                              styles.dataHeaderText,
                              { color: '#444444', fontWeight: 'normal' },
                            ]}>
                            {value.comments}
                          </Text>
                        </View>
                      );
                    })}
{this.state.selectedCompany === 'Select Company' ? null : <View style={styles.pickerWrapper}>
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
          </View>}
          {this.state.leadclosurestatus === 'Open' || this.state.leadclosurestatus === 'Select Lead Closure Status' ? null : 
          
          <View style={styles.pickerWrapper}>
            <Dropdown
              data={this.state.leadclosedtype}
              onChangeText={value => {
                this.setState({ leadprogressval: value }, () => {
                 // console.log(this.state.leadprogressval);
                //  console.log(value);
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
          {this.state.leadclosurestatus === 'Select Lead Closure Status' ? null : 
           <View
           style={{ marginHorizontal: 20 }}>

           <OutlinedTextField
             label='Wayforward'
             autoCorrect={false}
             multiline={true}
             onChangeText={text => this.setState({ updatedcomments: text })}
             animationDuration={1000}
             autoCapitalize='none'

           />

         </View>}
        
        {this.state.leadclosurestatus === 'Closed' || this.state.leadclosurestatus === 'Select Lead Closure Status' ? null : 
           <View>
           <Text style={{ marginLeft: 5, marginBottom:0,paddingLeft: 20,fontfamily: 'lucida grande', fontsize: 11  }}>
          Please select next visit date
         </Text>
        
         <DatePicker
           style={{marginTop: 5,marginBottom:0,paddingLeft: 20,width:340}}
           date= { this.state.nextDate } // Initial date from state
           mode="date" // The enum of date, datetime and time
           placeholder="Select Next Visit Date"          
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
       { this.state.updatedcomments === '' || this.state.selectedCompany === 'Select Company' || this.state.leadclosurestatus === 'Select Lead Closure Status'  || (this.state.leadclosurestatus === 'Closed' && this.state.leadprogressval === 'Select Lead Progress Status')  ? null : 
         
       <View
            style={{ marginHorizontal: 20, backgroundColor: '#FF1493', borderRadius: 10, marginTop: 30 }}>
            <Button
              title='Submit'
              color='#FF1493'
              onPress={() => this.openvisitlocationstatus()}
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
   
   backgroundColor: '#FFF1C14a',
    flexDirection: 'row',
    flex: 10,
    marginHorizontal: 10,
    marginTop: 7,
    borderRadius: 2,
  },
  stripStylecomments: {
   
    backgroundColor: '#FFF1C14a',
     flexDirection: 'column',
     flex: 10,
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


export default leadopenHQ;


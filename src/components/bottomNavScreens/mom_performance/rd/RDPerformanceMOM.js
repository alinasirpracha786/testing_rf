import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert, ImageBackground, Dimensions } from 'react-native';
import { Table, TableWrapper, Cell } from 'react-native-table-component';
import { Icon } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal, { ModalTitle, SlideAnimation, ModalContent } from 'react-native-modals';
import { NavigationActions } from 'react-navigation';
import * as SecureStore from 'expo-secure-store';
import SelectInput from 'react-native-select-input-ios';

export default class RDPerformanceMOM extends Component {
  static navigationOptions = {
    title: 'RD Performance',
    headerStyle: {
      backgroundColor: '#000',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      user: this.props.navigation.getParam('user', null),
      tableHead: ['Loading data'],
      tableData: [['']],
      sellername:"",
      tableHeadBottom: ['Loading data'],
      tableDataBottom: [['']],
      subTitle: "",
      modalSubTitle: "",
      widthArr: ['100%'],
      showSpinner: false,
      revenueBigStreamTableHead: ['Loading data'],
      revenueBigStreamTableData: [['']],
      revenueBigStreamTableHeadbottom: ['Loading data'],
      revenueBigStreamTableDatabottom: [['']],
      modal_revenueBigStreamBreakupVisible: false,
      productsDeltaValArray: {},
      modalheight: null,
      jsonData: 'empty',
      selectedYearValue: 0,
      years: [{ value: 0, label: 'Loading...' }],
    };
  }

  tokenInvalidResponse(title, message, username = this.state.user.username, redirectCode = 401) {
    //console.warn("\n\n inside invalid");
    this.setState({ modal_revenueBigStreamBreakupVisible: false });

    const parent = this.props.navigation.dangerouslyGetParent();

    parent.navigate('login', {
      errorTitle: title,
      errorMessage: message,
      redirectCode: redirectCode,
      username: username,
      location: parent.state.routeName + "::" + this.props.navigation.state.routeName
    });
  }

  getRDPerformance(myHeaders,value = null) {
    this.setState({ showSpinner: true });
    // const apiHost = 'http://192.168.10.10:8081/bi_dashboard/index.php';
    // const apiHost = 'http://209.150.154.21:8081/bi_dashboard/index.php';
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      'soa/get_mom_seller_performance_test/' +
      this.state.user.role +
      '/' +
      this.state.user.username+'/'+ 'South';
     /* 'soa/get_mom_seller_performance/' +
      this.state.user.role +
      '/' +
      this.state.user.username
      +
      '/' +
      value;*/
    console.warn(url);

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
        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {
          if(responseJson.app_down_flag == 1){
          
            Alert.alert(
              'MTD Update',
              'App is not updated due to month end activity. Will be updated soon!',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    //this.props.navigation.goBack('DVR');
                    this.props.navigation.goBack(null);
                    //this.props.navigation.navigate('leadopen')
                 //  this.props.navigation.navigate('Home');
                  //  this.props.navigation.navigate('Home', { go_back_key: this.state.key });
                  }
                }
              ],
              {
                cancelable: true,
                onDismiss: () => {
                  this.props.navigation.goBack(null);
                 // this.props.navigation.goBack(Home);
                }
              }
            );
          
          }
    /*      this.setState({ tableHead: responseJson.header_top });
          this.setState({ tableData: responseJson.indicator_current_last });

          this.setState({ tableHeadBottom: responseJson.header_bottom });
          this.setState({ tableDataBottom: responseJson.indicator_current });

          this.setState({ subTitle: "(" + responseJson.mtd_text + ")" });*/
          this.setState({ tableHead: responseJson.header });
          this.setState({ tableData: responseJson.indicators });

      /*    this.setState({ tableHeadBottom: responseJson.header_bottom });
          this.setState({ tableDataBottom: responseJson.indicator_current });
          this.setState({ title: responseJson.mtd_text });*/

         // this.setState({ title: 'Consecutive Last 3 months' });
          console.warn('updated state.tableData: ', this.state.tableData);
          //console.warn('updated state.tableData: ', this.state.tableData);
        }
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        return responseJson;
      })
      .catch(error => {
        // console.error(error);
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        //console.warn("Error after fetch failed: ", error);
        Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
          {
            text: 'Ok',
          },
        ]);
      });
  }




  onsellerSelect(selectedseller,selectedid) {
    // Alert.alert(selectedYear);
    console.warn("SELECTED seller: ", selectedseller);
    this.setState({ sellername: selectedid});
    this.setState({ selectedsellername: selectedseller });
    this.getlowperformers_prepare_sellerinfo();
   // this.getRDPerformance_prepare();
  }
  

  getlowperformers_prepare_sellerinfo() {

   
    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);
  //console.warn("seller wise info"+vstatus);
  
    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);
  
      this.getlowperformers_sellerinfo(myHeaders);
  
    }).catch((error) => {
      //this callback is executed when your Promise is rejected
     // console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });
  
  }
  getlowperformers_sellerinfo( myHeaders) {
  //  console.warn(title + " compname called");
  
    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;
  
   // //console.warn("this.state.productsDeltaValArray in getAccountWiseDiscount: ", this.state.productsDeltaValArray);
    ////console.warn("title: ", title);
  
   //let is_positive = 0;
   // let is_positive = (this.state.productsDeltaValArray[title].indexOf("-") >= 0) ? 0 : 1;
    ////console.warn("IS POSITIVE, in DISCOUNT: ", is_positive);
  
  
    const url =
      apiHost +
      'soa/get_mom_seller_performance_sellerid/' +
      this.state.user.role +
      '/' +
      this.state.user.username +"/"+
      this.state.sellername+"/"+this.state.selectedYearValue ;
    console.warn(url);
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
      //  console.warn('updated state.tableData: ', responseJson);
        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }
  
        else {
         
       /*   this.setState({ tableHead: responseJson.header });
          this.setState({ tableData: responseJson.indicators });

      /*    this.setState({ tableHeadBottom: responseJson.header_bottom });
          this.setState({ tableDataBottom: responseJson.indicator_current });
          this.setState({ title: responseJson.mtd_text });

          this.setState({ title: 'Consecutive Last 3 months' });
          this.setState({ modalSubTitle: title+"|"+ responseJson.mtd_text});
      */
          //console.warn('updated state.tableData: ', this.state.tableData);
          
  
          this.setState({ revenueBigStreamTableHead: responseJson.header_top });
          this.setState({ revenueBigStreamTableData: responseJson.indicator_current_last });
          this.setState({ modalSubTitle: this.state.selectedsellername+"|"+ responseJson.mtd_text});


          this.setState({ revenueBigStreamTableHeadbottom: responseJson.header_bottom });
          this.setState({ revenueBigStreamTableDatabottom: responseJson.indicator_current });
         
        console.warn('updated state.tableData: ', this.state.revenueBigStreamTableDatabottom);
        console.warn('updated state.tableheader: ', this.state.revenueBigStreamTableHeadbottom);
        }
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
         this.setState({ modal_revenueBigStreamBreakupVisible: true });
        return responseJson;
      })
      .catch(error => {
        console.error(error);
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
          {
            text: 'Ok',
          },
        ]);
      });
  } 
  componentDidMount() {

    this.props.navigation.dispatch(
      NavigationActions.init({
        params: { user: user },
      }),
    );
    this.getYearsAndRegions_prepare();

 //call get RD Performance
 this._get("jwt").then((jwt) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', jwt);

  this.getRDPerformance(myHeaders,0);

}).catch((error) => {
  //this callback is executed when your Promise is rejected
  //console.log('Promise is rejected with error: ' + error);
  this.tokenInvalidResponse("Token Not Found", "Token not found, please login again.");
});
    this._componentFocused();
    this._sub = this.props.navigation.addListener(
      'didFocus',
      this._componentFocused
    );


    this.getYearsAndRegions_prepare();
  }

  onYearSelect(selectedYear) {
    // Alert.alert(selectedYear);
    console.warn("SELECTED YEAR: ", selectedYear);
    this.setState({ selectedYearValue: selectedYear });
    
    this.getlowperformers_prepare_sellerinfo();
  }

  
  getRDPerformance_prepare(value) {

    //call get RD Performance
    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getRDPerformance(myHeaders,value);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Token Not Found", "Token not found, please login again.");
    });
    }

  getYearsAndRegions_prepare() {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);


    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getYearsAndRegions(myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Token Not Found", "Token not found, please login again.");
    });

  }

  getYearsAndRegions(myHeaders) {
    // //console.warn(tile + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa/get_mom_sellerwise/' +
      this.state.user.role +
      '/' +
      this.state.user.username;

    //console.warn(url);
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

        //console.warn("RESPONSE TEXT REGIONS: ", responseJson.regions);
        //console.warn("RESPONSE TEXT YEARS: ", responseJson.years);


        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {

          this.setState({ years: responseJson.years });
          // this.setState({ regions: responseJson.regions });
        }
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        return responseJson;
      })
      .catch(error => {
        console.error(error);
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        Alert.alert('Data Not Found', 'List of years and regions could not be loaded. Please restart the app or contact GCSS BI Team', [
          {
            text: 'Ok',
          },
        ]);
      });
  }
  _componentFocused = () => {
    this.props.navigation.closeDrawer();
  }

  componentWillUnmount() {
    this._sub.remove();
  }

  rd_to_region_mapping(rd) {

    // Alert.alert('Title', 'WINDOW: Height is: ' + Dimensions.get('window').height + ' and Width is: ' + Dimensions.get('window').width + ' AND SCREEN: Height is: ' + Dimensions.get('screen').height + ' and Width is: ' + Dimensions.get('screen').width);
    if (rd == 'farhan.zakir') {
      return "Central"
    }
    else if (rd == 'salman.ahmad') {
      return "North"
    }
    else if (rd == 'sameer.mughal') {
      return "South"
    }
  }

  getRevenueBigStreamPerformance_prepare() {
    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getRevenueBigStreamPerformance(myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });
  }

  getRevenueBigStreamPerformance(myHeaders) {

    this.setState({ showSpinner: true });
    // const apiHost = 'http://192.168.10.10:8081/bi_dashboard/index.php';
    // const apiHost = 'http://209.150.154.21:8081/bi_dashboard/index.php';
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa/get_mom_seller_performance/' +
      this.state.user.role +
      '/' +
      this.state.user.username 
      + '/' + this.state.selectedYearValue;
    console.warn(url);
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

        //console.log("\n\nRESPONSE JSON BIG STREAM: ", responseJson.status);

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {
          this.setState({ revenueBigStreamTableHead: responseJson.header });
          this.setState({ revenueBigStreamTableData: responseJson.indicators });
          this.setState({ modalSubTitle: "Revenue | Big Streams | MTD | " + responseJson.mtd_text });
          //console.warn('updated state.tableData: ', this.state.tableData);

          this.setState({ modal_revenueBigStreamBreakupVisible: !this.state.modal_revenueBigStreamBreakupVisible });

        }

        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        return responseJson;
      })
      .catch(error => {
        // console.error(error);
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
          {
            text: 'Ok',
          },
        ]);
      });
  }

  getProductWisePerformanceForBigStream_prepare(title) {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);


    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getProductWisePerformanceForBigStream(title, myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Token Not Found", "Token not found, please login again.");
    });

  }

  getProductWisePerformanceForBigStream(title, myHeaders) {
    //console.warn(title + " called here");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa/get_mtd_revenue_product_wise_for_big_stream/' +
      this.state.user.role +
      '/' +
      this.state.user.username +
      '/0/0/' + title.trim();
    //console.warn(url);
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

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {

          //productsDeltaValArray gets empty here and the lines to follow (ultimately in processCellData function) populate it again for results received from here.
          this.state.productsDeltaValArray = {};
          //console.warn("this.state.productsDeltaValArray in getProductWisePerformanceForBigStream: ", this.state.productsDeltaValArray);

          this.setState({ revenueBigStreamTableHead: responseJson.header });
          this.setState({ revenueBigStreamTableData: responseJson.indicators });
          this.setState({ modalSubTitle: title + " | Revenue Breakup | MTD | " + responseJson.mtd_text });
          //console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);
        }
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        // this.setState({ modal_revenueBigStreamBreakupVisible: true });
        return responseJson;
      })
      .catch(error => {
        // console.error(error);
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
          {
            text: 'Ok',
          },
        ]);
      });
  }

  getAccountWisePerformanceForProduct_prepare(title) {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);


    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getAccountWisePerformanceForProduct(title, myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });

  }
  getAccountWisePerformanceForProduct(title, myHeaders) {
    //console.warn(title + " called");

    // this.setState({ modal_revenueBigStreamBreakupVisible: false });
    this.setState({ showSpinner: true });
    // const apiHost = 'http://192.168.10.10:8081/bi_dashboard/index.php';
    // const apiHost = 'http://209.150.154.21:8081/bi_dashboard/index.php';
    const apiHost = this.state.user.apiHost;

    //console.warn("this.state.productsDeltaValArray: ", this.state.productsDeltaValArray);
    //console.warn("title: ", title);

    let is_positive = (this.state.productsDeltaValArray[title].indexOf("-") >= 0) ? 0 : 1;
    //console.warn("IS POSITIVE", is_positive);


    const url =
      apiHost +
      '/soa/get_mtd_revenue_account_wise/' +
      this.state.user.role +
      '/' +
      this.state.user.username +
      '/0/0/' + title.trim() + '/' + is_positive;
    //console.warn(url);
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

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {
          this.setState({ revenueBigStreamTableHead: responseJson.header });
          this.setState({ revenueBigStreamTableData: responseJson.indicators });
          this.setState({ modalSubTitle: title + " | Accounts Rev | MTD | " + responseJson.mtd_text });
          //console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);


        }
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        // this.setState({ modal_revenueBigStreamBreakupVisible: true });
        return responseJson;
      })
      .catch(error => {
        // console.error(error);
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
          {
            text: 'Ok',
          },
        ]);
      });
  }


  getProductWiseDiscount_prepare(title) {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);


    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getProductWiseDiscount(title, myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });

  }
  getProductWiseDiscount(title, myHeaders) {
    //console.warn(title + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa/get_mtd_discount_product_wise/' +
      this.state.user.role +
      '/' +
      this.state.user.username +
      '/0/0/';
    //console.warn(url);
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

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {

          //productsDeltaValArray gets empty here and the lines to follow (ultimately in processCellData function) populate it again for results received from here.
          this.state.productsDeltaValArray = {};
          //console.warn("this.state.productsDeltaValArray in getProductWisePerformanceForBigStream: ", this.state.productsDeltaValArray);

          this.setState({ revenueBigStreamTableHead: responseJson.header });
          this.setState({ revenueBigStreamTableData: responseJson.indicators });
          this.setState({ modalSubTitle: "Product Wise Discount | MTD | " + responseJson.mtd_text });
          //console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

          this.setState({ modal_revenueBigStreamBreakupVisible: true });


        }
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        // this.setState({ modal_revenueBigStreamBreakupVisible: true });
        return responseJson;
      })
      .catch(error => {
        // console.error(error);
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
          {
            text: 'Ok',
          },
        ]);
      });
  }

  getProductWisePayment_prepare(title) {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);


    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getProductWisePayment(title, myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });

  }
  getProductWisePayment(title, myHeaders) {
    //console.warn(title + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa/get_mtd_payment_product_wise/' +
      this.state.user.role +
      '/' +
      this.state.user.username +
      '/0/0/';
    //console.warn(url);
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

        //console.warn("response:::::::", responseJson);

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {

          //productsDeltaValArray gets empty here and the lines to follow (ultimately in processCellData function) populate it again for results received from here.
          this.state.productsDeltaValArray = {};
          //console.warn("this.state.productsDeltaValArray in getProductWisePerformanceForBigStream: ", this.state.productsDeltaValArray);

          this.setState({ revenueBigStreamTableHead: responseJson.header });
          this.setState({ revenueBigStreamTableData: responseJson.indicators });
          this.setState({ modalSubTitle: "Product Wise Payment | MTD | " + responseJson.mtd_text });
          //console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

          this.setState({ modal_revenueBigStreamBreakupVisible: true });


        }
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        // this.setState({ modal_revenueBigStreamBreakupVisible: true });
        return responseJson;
      })
      .catch(error => {
        // console.error(error);
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
          {
            text: 'Ok',
          },
        ]);
      });
  }

  getProductWiseBase_prepare(title) {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);


    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getProductWiseBase(title, myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });

  }
  getProductWiseBase(title, myHeaders) {
    //console.warn(title + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa/get_mtd_subscriber_base_product_wise/' +
      this.state.user.role +
      '/' +
      this.state.user.username +
      '/0/0/';
    //console.warn(url);
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

        //console.warn("response:::::::", responseJson);

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {

          //productsDeltaValArray gets empty here and the lines to follow (ultimately in processCellData function) populate it again for results received from here.
          this.state.productsDeltaValArray = {};
          //console.warn("this.state.productsDeltaValArray in getProductWisePerformanceForBigStream: ", this.state.productsDeltaValArray);

          this.setState({ revenueBigStreamTableHead: responseJson.header });
          this.setState({ revenueBigStreamTableData: responseJson.indicators });
          this.setState({ modalSubTitle: "Product Wise Subscriber Base | MTD | " + responseJson.mtd_text });
          //console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

          this.setState({ modal_revenueBigStreamBreakupVisible: true });


        }
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        // this.setState({ modal_revenueBigStreamBreakupVisible: true });
        return responseJson;
      })
      .catch(error => {
        // console.error(error);
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
          {
            text: 'Ok',
          },
        ]);
      });
  }

  getAccountWiseDiscount_prepare(title) {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);


    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getAccountWiseDiscount(title, myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });

  }
  getAccountWiseDiscount(title, myHeaders) {
    //console.warn(title + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    //console.warn("this.state.productsDeltaValArray in getAccountWiseDiscount: ", this.state.productsDeltaValArray);
    //console.warn("title: ", title);


    let is_positive = (this.state.productsDeltaValArray[title].indexOf("-") >= 0) ? 0 : 1;
    //console.warn("IS POSITIVE, in DISCOUNT: ", is_positive);


    const url =
      apiHost +
      '/soa/get_mtd_discount_account_wise/' +
      this.state.user.role +
      '/' +
      this.state.user.username +
      '/0/0/' + title.trim() + '/' + is_positive;
    //console.warn(url);
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

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {

          this.setState({ revenueBigStreamTableHead: responseJson.header });
          this.setState({ revenueBigStreamTableData: responseJson.indicators });
          this.setState({ modalSubTitle: title + " | Accounts wise Discount | MTD | " + responseJson.mtd_text });
          //console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

        }
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        // this.setState({ modal_revenueBigStreamBreakupVisible: true });
        return responseJson;
      })
      .catch(error => {
        // console.error(error);
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
          {
            text: 'Ok',
          },
        ]);
      });
  }

  getAccountWisePayment_prepare(title) {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);


    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getAccountWisePayment(title, myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });

  }
  getAccountWisePayment(title, myHeaders) {
    //console.warn(title + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    //console.warn("this.state.productsDeltaValArray in getAccountWisePayment: ", this.state.productsDeltaValArray);
    //console.warn("title: ", title);


    let is_positive = (this.state.productsDeltaValArray[title].indexOf("-") >= 0) ? 0 : 1;
    //console.warn("IS POSITIVE, in PAYMENT: ", is_positive);


    const url =
      apiHost +
      '/soa/get_mtd_payment_account_wise/' +
      this.state.user.role +
      '/' +
      this.state.user.username +
      '/0/0/' + title.trim() + '/' + is_positive;
    //console.warn(url);
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

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {

          this.setState({ revenueBigStreamTableHead: responseJson.header });
          this.setState({ revenueBigStreamTableData: responseJson.indicators });
          this.setState({ modalSubTitle: title + " | Accounts wise Payment | MTD | " + responseJson.mtd_text });
          //console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

        }
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        // this.setState({ modal_revenueBigStreamBreakupVisible: true });
        return responseJson;
      })
      .catch(error => {
        // console.error(error);
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
          {
            text: 'Ok',
          },
        ]);
      });
  }

  getAccountWiseBase_prepare(title) {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);


    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getAccountWiseBase(title, myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });

  }
  getAccountWiseBase(title, myHeaders) {
    //console.warn(title + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    //console.warn("this.state.productsDeltaValArray in getAccountWiseBase: ", this.state.productsDeltaValArray);
    //console.warn("title: ", title);


    let is_positive = (this.state.productsDeltaValArray[title].indexOf("-") >= 0) ? 0 : 1;
    //console.warn("IS POSITIVE, in BASE: ", is_positive);

    const url =
      apiHost +
      '/soa/get_mtd_subscriber_base_account_wise/' +
      this.state.user.role +
      '/' +
      this.state.user.username +
      '/0/0/' + title.trim() + '/' + is_positive;
    //console.warn(url);
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

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {

          this.setState({ revenueBigStreamTableHead: responseJson.header });
          this.setState({ revenueBigStreamTableData: responseJson.indicators });
          this.setState({ modalSubTitle: title + " | Accounts wise Subscriber Base | MTD | " + responseJson.mtd_text });
          //console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

        }
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        // this.setState({ modal_revenueBigStreamBreakupVisible: true });
        return responseJson;
      })
      .catch(error => {
        // console.error(error);
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
          {
            text: 'Ok',
          },
        ]);
      });
  }

  getProductWiseGCR_prepare(indicator) {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);


    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getProductWiseGCR(indicator, myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });

  }
  getProductWiseGCR(indicator, myHeaders) {
    //console.warn(indicator + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa/get_mtd_gcr_product_wise/' +
      this.state.user.role +
      '/' +
      this.state.user.username +
      '/0/0/' +
      indicator;
    //console.warn(url);
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

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {

          this.setState({ revenueBigStreamTableHead: responseJson.header });
          this.setState({ revenueBigStreamTableData: responseJson.indicators });
          this.setState({ modalSubTitle: "Product Wise " + indicator + " | MTD | " + responseJson.mtd_text });
          //console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

          this.setState({ modal_revenueBigStreamBreakupVisible: true });


        }
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        // this.setState({ modal_revenueBigStreamBreakupVisible: true });
        return responseJson;
      })
      .catch(error => {
        // console.error(error);
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
          {
            text: 'Ok',
          },
        ]);
      });
  }


  getAccountWiseGCR_prepare(product, indicator) {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);


    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getAccountWiseGCR(product, indicator, myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });

  }
  getAccountWiseGCR(product, indicator, myHeaders) {
    //console.warn(indicator.trim() + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa/get_mtd_gcr_account_wise/' +
      this.state.user.role.trim() +
      '/' +
      this.state.user.username.trim() +
      '/0/0/' +
      indicator.trim() +
      '/' +
      product.trim();

    //console.warn(url);
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

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {

          if (JSON.stringify(responseJson) === 'data not found') {
            this.setState({ jsonData: 'data not found' });
          }
          else {

            this.setState({ revenueBigStreamTableHead: responseJson.header });
            this.setState({ revenueBigStreamTableData: responseJson.indicators });
            this.setState({ modalSubTitle: indicator + " in " + product + " | MTD | " + responseJson.mtd_text });
            //console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

            this.setState({ modal_revenueBigStreamBreakupVisible: true });
          }

        }
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        // this.setState({ modal_revenueBigStreamBreakupVisible: true });
        return responseJson;
      })
      .catch(error => {
        // console.error(error);
        setTimeout(() => {
          this.setState({ showSpinner: false });
        }, this.state.user.spinnerTimeOutValue);
        Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
          {
            text: 'Ok',
          },
        ]);
      });
  }

  _get = async (key) => {

    try {

      let result = await SecureStore.getItemAsync(key);

      //console.log("GET ITEM: ", result);

      return result;
    } catch (error) {
      //console.log(error.message);
    }
    return

  };

  resizeModal(ev) {

    if (this.state.modalheight == null) {
      let height = ev.nativeEvent.layout.height + 30;
      const screenHeight = Math.round(Dimensions.get('window').height);

      //console.warn("MODAL HEIGHT INTIAL ::::::::::::::::::::::::::: ", height);
      height = height > screenHeight ? screenHeight * 0.8 : height;
      //console.warn("MODAL HEIGHT FINAL ::::::::::::::::::::::::::: ", height);

      this.setState({ modalheight: height });
    }
  }


  render() {
    const state = this.state;
    const element = (data, index) => (
      <Icon
        name={'arrow-drop-' + data.split("_")[0]}
        size={40}
        color={data.split("_")[1]}
        style={{ textAlign: 'center' }}
      />
    );

    const touchable = (data, index, rowData = null) => (

      (data[0] == "Revenue" || data[1] == "mtd_indicator")
        ? <TouchableOpacity onPress={() => this.getRevenueBigStreamPerformance_prepare()}>
          <View>
            <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
          </View>
        </TouchableOpacity>
        : (['1Line', '3i', 'Mobility', 'IaaS'].indexOf(data[0]) >= 0 && data[1] == "bigstream_revenue_indicator")
          ? <TouchableOpacity onPress={() => this.getProductWisePerformanceForBigStream_prepare(data[0])} rejectResponderTermination>
            <View>
              <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
            </View>
          </TouchableOpacity>
          : (data[0] == "Discount" && data[1] == "mtd_indicator")
            ? <TouchableOpacity onPress={() => this.getProductWiseDiscount_prepare(data[0])} rejectResponderTermination>
              <View>
                <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
              </View>
            </TouchableOpacity>
            : (data[0] == "Payment" && data[1] == "mtd_indicator")
              ? <TouchableOpacity onPress={() => this.getProductWisePayment_prepare(data[0])} rejectResponderTermination>
                <View>
                  <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
                </View>
              </TouchableOpacity>
              : (data[0] == "Base" && data[1] == "mtd_indicator")
                ? <TouchableOpacity onPress={() => this.getProductWiseBase_prepare(data[0])} rejectResponderTermination>
                  <View>
                    <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
                  </View>
                </TouchableOpacity>
                : (['Base', 'Payment', 'Terminal', 'Prepaid'].indexOf(data[0]) >= 0 && (data[1] == "mtd_indicator" || data[1] == "product_revenue_indicator"))
                  ? <View>
                    <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
                  </View>
                  : (['Churn', 'Gross Adds', 'Reconnection'].indexOf(data[0]) >= 0 && data[1] == "mtd_indicator")
                    ? <TouchableOpacity onPress={() => this.getProductWiseGCR_prepare(data[0])} rejectResponderTermination>
                      <View>
                        <Text style={styles.colTextBottom}>{data[0]}</Text>
                      </View>
                    </TouchableOpacity>
                    : (data[1] == "discount_indicator")
                      ? <TouchableOpacity onPress={() => this.getAccountWiseDiscount_prepare(data[0])} rejectResponderTermination>
                        <View>
                          <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
                        </View>
                      </TouchableOpacity>
                      : (data[1] == "payment_indicator")
                        ? <TouchableOpacity onPress={() => this.getAccountWisePayment_prepare(data[0])} rejectResponderTermination>
                          <View>
                            <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
                          </View>
                        </TouchableOpacity>
                        : (data[1] == "subscriber_base_indicator")
                          ? <TouchableOpacity onPress={() => this.getAccountWiseBase_prepare(data[0])} rejectResponderTermination>
                            <View>
                              <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
                            </View>
                          </TouchableOpacity>
                          : (['M2M', 'GSM', 'MBB', 'Others'].indexOf(data[0]) >= 0 && data[1] == "gcr_indicator")
                            ? <TouchableOpacity onPress={() => this.getAccountWiseGCR_prepare(data[0], rowData[1])} rejectResponderTermination>
                              <View>
                                <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
                              </View>
                            </TouchableOpacity>
                              : (data[1] == "mom_indicator")
                              ? <TouchableOpacity onPress={() => this.onsellerSelect(data[0],data[2])} rejectResponderTermination>
                                <View>
                                  <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
                                </View>
                              </TouchableOpacity>
                            : (['PRI', 'FBB', 'M2M', 'VPBX',
                              'BVMB', 'IoT', 'PTT', 'CBS',
                              'Zong Track', 'ZFM', 'GSM',
                              'MBB', 'ICT'].indexOf(data[0]) >= 0 && data[1] == "product_revenue_indicator"  || data[1] == "mom_indicator" )
                              ? <TouchableOpacity onPress={() => this.getAccountWisePerformanceForProduct_prepare(data[0])} rejectResponderTermination>
                                <View>
                                  <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
                                </View>
                              </TouchableOpacity>
                              : { data }
    );

    const untouchable = (data, index) => (
      <View>
        <Text style={index === 0 ? styles.colText : styles.text}>{data}</Text>
      </View>
    );

    const processCellData = (data, index, rowData) => {

      if (typeof rowData != undefined && rowData != null) {

        let title = (data[1] == "product_revenue_indicator" || data[1] == "discount_indicator" || data[1] == "payment_indicator" || data[1] == "subscriber_base_indicator"  || data[1] == "mom_indicator") ? (rowData[0][0]) : rowData[0];
        this.state.productsDeltaValArray[title] = rowData[3];
        // }
      }


      return (
        (data.includes("up_") || data.includes("down_"))
          ? element(data, index)
          : (['Revenue', 'Discount', 'Base', 'Payment','low_performers', '1Line', '3i', 'Mobility', 'IaaS','PRI', 'FBB', 'M2M', 'VPBX',
            'BVMB', 'IoT', 'PTT', 'CBS',
            'Zong Track', 'ZFM', 'GSM',
            'MBB', 'ICT', 'Churn', 'Gross Adds',
            'Reconnection', 'Terminal', 'Prepaid',
            'Zong Moto guard', 'Zong Track', 'Zong Track ', 'Employee Tariff',
            'TEST Tariff', 'Daas', 'Zong Energy Management',
            'Zong water Management', 'NULL'].indexOf(data[0]) >= 0 || data[1] == "discount_indicator" || data[1] == "product_revenue_indicator" || data[1] == "gcr_indicator" || data[1] == "mom_indicator")
            ? touchable(data, index, rowData)
            : untouchable(data, index)
      );
    };



    const putIcon = (data) => {


      return (
        (data.includes("[vvv]"))
          ? <View style={{
            paddingVertical: 0,
            paddingHorizontal: -20,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
          }}>
            <Text style={{
              color: "white",
              fontWeight: "bold",
            }}>{data.replace("[vvv]", "")}
            </Text>
            < Icon name='chevron-down' type='font-awesome' size={17} color={"white"} style={{ textAlign: 'center' }} />
          </View>
          : data
      );
    };

    const cellStyle = (cellIndex, data = null) => (
      cellIndex === 0 ? styles.singleHead : (cellIndex === 2 ? styles.singleHeadEqual : (data === "Reconnection" ? styles.singleHeadTTPF : styles.singleHeadSixty))
    );

    const cellStyleBottom = (cellIndex) => (
      styles.singleHeadbottom
    );

    return (

      <ImageBackground source={{ uri: this.state.user.punch }} style={{ width: "100%", height: "100%" }} imageStyle={{ height: "200%", width: "100%", resizeMode: "repeat" }}>

        <ScrollView style={styles.container}>
          <Spinner
            visible={this.state.showSpinner}
            textContent={'Loading'}
            textStyle={styles.spinnerTextStyle}
            color='#fff'
            overlayColor='rgba(0, 0, 0, 0.5)'
            size='large'
            cancelable={true}
            animation='fade'
          />

          <Modal
            visible={this.state.modal_revenueBigStreamBreakupVisible}
            onTouchOutside={() => {
              this.setState({ modal_revenueBigStreamBreakupVisible: false });
            }}
            onHardwareBackPress={() => true}
            useNativeDriver={true}
            width={0.97}
            height={this.state.modalheight}
            swipeDirection={['up', 'down']} // can be string or an array
            swipeThreshold={100} // default 100
            onSwipeOut={(event) => {
              this.setState({ modal_revenueBigStreamBreakupVisible: false });
              this.setState({ modalheight: null });
            }}

            modalAnimation={new SlideAnimation({
              initialValue: 0.7, // optional
              slideFrom: 'bottom', // optional
              useNativeDriver: true, // optional          
            })}

            modalTitle={<ModalTitle title={state.modalSubTitle} />}


          >
            <ModalContent style={styles.modalContent}>
              <ImageBackground source={{ uri: this.state.user.punch }} style={{}} imageStyle={{ height: "64000%", width: "1600%", resizeMode: "repeat" }}>
                <ScrollView onLayout={(ev) => { this.resizeModal(ev) }}>
                <View style={styles.rowSelectInput}>
                  <View style={styles.smallInputWrapper}>
                   
                    <SelectInput
                      value={this.state.selectedYearValue}
                      options={this.state.years}
                      onCancelEditing={() => { }}
                      onSubmitEditing={this.onYearSelect.bind(this)}
                      submitKeyText="Done"
                      cancelKeyText="Close"
                      style={[styles.selectInput, styles.selectInputSmall]}
                    />
                  </View>
          </View>
          <Table style={styles.tableStyle} borderStyle={{ borderColor: 'transparent' }}>
                      <TableWrapper
                        style={styles.headbottom}>
                        {state.revenueBigStreamTableHeadbottom.map((cellData, cellIndex, rowData) => (
                          <Cell
                            key={cellIndex}
                            data={cellData ? cellData : ""}
                            textStyle={cellIndex === 3 ? styles.colHeadTextbottom : styles.headTextbottom}
                            style={cellStyleBottom(cellIndex)}
                          />
                        ))}
                      </TableWrapper>
                      
                      <TableWrapper
                        style={styles.row}>
                        {state.revenueBigStreamTableDatabottom.map((cellData, cellIndex) => (
                          <Cell
                            key={cellIndex}
                            data={cellData ? cellData : ""}
                            textStyle={cellIndex === 0 ? styles.textbottom : styles.textbottom}
                            style={cellStyleBottom(cellIndex)}
                          />
                        ))}
                      </TableWrapper>
                      
                      
                      </Table>
                  {
                    this.state.jsonData === 'data not found' ?
                      <View>
                        <Text>Data Not Found. No data found for this selection criteria. Please contact GCSS BI Team in case of queries.</Text>
                      </View>
                      :
                     
                      <Table style={styles.tableStyleModal} borderStyle={{ borderColor: 'transparent' }}>
                        <TableWrapper
                          style={styles.head}>
                          {this.state.revenueBigStreamTableHead.map((cellData, cellIndex) => (
                            <Cell
                              key={cellIndex}
                              data={putIcon(cellData ? cellData : "")}
                              textStyle={cellIndex === 0 ? styles.colHeadText : styles.headText}
                              style={cellStyle(cellIndex)}
                            />
                          ))}
                        </TableWrapper>
                        {this.state.revenueBigStreamTableData.map((rowData, index) => (
                          <TableWrapper
                            key={index}
                            style={styles.row}>
                            {rowData.map((cellData, cellIndex, rowData) => (
                              <Cell
                                key={cellIndex}
                                data={processCellData(cellData ? cellData : "", cellIndex, rowData ? rowData : "")}
                                // data={processCellData(cellData, cellIndex, rowData)}
                                textStyle={cellIndex === 0 ? styles.colText : styles.text}
                                style={cellStyle(cellIndex, cellData)}
                              />
                            ))}
                          </TableWrapper>
                        ))}
                      </Table>
                      
                  }
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#ffffff",
                      paddingTop: 15,
                      paddingBottom: 25
                    }}
                    onPress={() => {
                      this.setState({ modal_revenueBigStreamBreakupVisible: false });
                      setTimeout(() => {
                        this.setState({ modalheight: null });
                      }, 1000);
                    }}
                    rejectResponderTermination
                  >
                    <View>
                      <Text style={styles.dismissModal}>Click here or swipe up to dismiss</Text>
                    </View>
                  </TouchableOpacity>

                </ScrollView>
              </ImageBackground>

            </ModalContent>
          </Modal>
          <View>
            <Text style={styles.title}>{"Low Performers IQ Score < 80%\n Consecutive Last 3 months"}{"\n"}</Text>
          </View>

          <Table style={styles.tableStyle} borderStyle={{ borderColor: 'transparent' }}>
            <TableWrapper
              style={styles.head}>
              {state.tableHead.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={cellData ? cellData : ""}
                  textStyle={cellIndex === 0 ? styles.colHeadText : styles.headText}
                  style={cellStyle(cellIndex)}
                />
              ))}
            </TableWrapper>
            {state.tableData.map((rowData, index) => (
              <TableWrapper
                key={index}
                style={styles.row}>
                {rowData.map((cellData, cellIndex, rowData) => (
                  <Cell
                    key={cellIndex}
                    data={processCellData(cellData ? cellData : "", cellIndex, rowData)}
                    textStyle={cellIndex === 0 ? styles.colText : styles.text}
                    style={cellStyle(cellIndex)}
                  />
                ))}
              </TableWrapper>
            ))}
          </Table>
        


        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 2,
    // height: "100%"
    // paddingTop: 20,
    // backgroundColor: '#fff',
  },

  title: {
    textAlign: 'center',
    marginTop: 20,
    color: '#ed0281',
    fontSize: 22,
    fontWeight: 'bold',
    margin: 0,
  },

  noteStyle: {
    color: '#ed0281',
    marginBottom: 50,
    fontWeight: "bold"
  },

  spinnerTextStyle: {
    color: '#fff',
    fontSize: 30
  },

  dismissModal: {
    color: "grey",
    textAlign: "center",
    paddingBottom: 20
  },

  singleHeadEqual: {
    width: "23%",
  },
  singleHeadbottom: {
    width: "33%",
  },
  singleHead: {
    width: "35%",
  },

  singleHeadSixty: {
    width: "19.5%"
  },

  singleHeadTTPF: {
    width: "22.5%"
  },

  singleHeadLast: {
    width: "22%"
  },

  tableStyle: {
    marginBottom: 10,
    // width: "100%"
  },

  tableStyleModal: {
    padding: 0,
    marginTop: 20,
  },

  head: {
    flexDirection: 'row',
    marginLeft: 0,
    //textAlign: 'center',
    height: 40,
    backgroundColor: '#8dc540',
    color: 'white',
    width: "100%"
  },

  text: {
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 14
  },
  textbottom: {
    paddingVertical: 10,
    textAlign: 'center',
    color: '#ed0281',
    fontSize: 14
  },
  colText: {
    //textAlign: 'center',
    paddingVertical: 10,
    marginLeft: 3,
    fontSize: 14,
    color: '#ed0281',
    fontWeight: 'bold',
  },

  colTextBottom: {
    textAlign: 'center',
    paddingVertical: 10,
    marginLeft: 3,
    fontSize: 14,
    color: '#ed0281',
    fontWeight: 'bold',
  },

  headText: {
    //textAlign: 'center',
    paddingVertical: 10,
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    textAlign: "center"
  },
  headTextbottom: {
    //textAlign: 'center',
    paddingVertical: 10,
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    textAlign: "center"
  },


  colHeadText: {
    // marginTop: 10,
    //textAlign: 'left',
    marginLeft: 3,
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  colHeadTextbottom: {
    // marginTop: 10,
    //textAlign: 'left',
    marginLeft: 3,
    fontSize: 14,
    color: '#ed0281',
    fontWeight: 'bold',
  },

  row: {
    marginLeft: 0,
    flexDirection: 'row',
    backgroundColor: '#FFF1C14a',
    width: "100%"
  },
  

  headbottom: {
    flexDirection: 'row',
    marginLeft: 0,
    backgroundColor: '#8dc540',
    color: 'white',
    width: "100%"
  },

  modalContent: {
    paddingHorizontal: 2,
  }


});

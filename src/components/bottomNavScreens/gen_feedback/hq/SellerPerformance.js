import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
  ImageBackground,
  Dimensions
} from 'react-native';

import { Table, TableWrapper, Cell } from 'react-native-table-component';
import { Icon } from 'react-native-elements';
import SwitchToggle from 'react-native-switch-toggle';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal, { ModalTitle, SlideAnimation, ModalContent } from 'react-native-modals';
import * as SecureStore from 'expo-secure-store';
import SelectInput from 'react-native-select-input-ios'

export default class DVRSellerPerformance extends Component {
  state = {
    user: this.props.navigation.getParam('user', null),
    selectedSellerLabel: 'Please select Seller',
    selectedSellerValue: 0,
    selectedTLLabel: 'Please select Team Lead',
    selectedTLValue: 0,
    sellers: [{ value: 0, label: 'Loading' }],
    tls: [{ value: 0, label: 'Loading' }],
    tableHead: [''],
    tableData: [['']],
    tableHeadBottom: [''],
    tableDataBottom: [['']],
    subTitle: "",
    modalSubTitle: "",
    widthArr: ['100%'],
    switchRM: false,
    switchKAM: false,
    switchBDO: false,
    showSpinner: false,
    revenueBigStreamTableHead: ['Loading data'],
    revenueBigStreamTableData: [['']],
    modal_revenueBigStreamBreakupVisible: false,
    productsDeltaValArray: {},
    modalheight: null
  };

  constructor(props) {
    super(props);
  }

  tokenInvalidResponse(title, message, username = this.state.user.username, redirectCode = 401) {
    ////console.warn("\n\n inside invalid");
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


  getSellersForRD(value = 0) {
    this.setState({ selectedTLValue: value });
    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost + '/soa/return_sellers_for_rd/' + value + '/0/0/' + this.state.switchRM + '/' + this.state.switchKAM + '/' + this.state.switchBDO + '/0/mtd/1';
    ////console.warn('url: ', url);
    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

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

            this.setState({ sellers: responseJson });
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
    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Token Not Found", "Token not found, please login again.");
    });
  }

  getTLsForRD() {
    this.setState({ showSpinner: true });
    // const apiHost = 'http://192.168.10.10:8081/bi_dashboard/index.php';
    // const apiHost = 'http://209.150.154.21:8081/bi_dashboard/index.php';
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost + '/soa/return_tls_for_rd/0/0/mtd/1';
    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

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

            this.setState({ tls: responseJson });
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
    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Token Not Found", "Token not found, please login again.");
    });
  }

  componentDidMount() {
    this.getSellersForRD();
   // this.getTLsForRD();
    // ////console.warn("DID MOUNT RM: " + this.state.switchRM + " KAM: " + this.state.switchKAM + " BDO: " + this.state.switchBDO);

    this._componentFocused();
    this._sub = this.props.navigation.addListener(
      'didFocus',
      this._componentFocused
    );


  }

  _componentFocused = () => {
    this.props.navigation.closeDrawer();
  }

  componentWillUnmount() {
    this._sub.remove();
  }

  getSelectedSellerLabel(sellers, value) {
    sellers.forEach(function (seller) {
      if (seller.value == value) {
        ////console.warn('matched name: ', seller.label);
        return seller.label;
      }
    });
  }

  getSellerPerformance_prepare(value) {
    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getSellerPerformance(value, myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });
  }


  getSellerPerformance(value, myHeaders) {

    this.setState({ showSpinner: true });
    ////console.warn(value);
    const apiHost = this.state.user.apiHost;

    const url = apiHost + '/soa_dvr/get_mtd_all_kpi_dvr_daily/seller' + '/' + value;
    //console.log('url', url);
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

          this.state.sellers.forEach(seller => {
            if (seller.value == value) {
              ////console.warn('matched name: ', seller.label);
              this.setState({ selectedSellerLabel: seller.label + "'s" });
              this.setState({ selectedSellerValue: value });
              ////console.warn(
              // 'UPDATED STATE NAME: ',
              //   this.state.selectedSellerLabel,
              // );
            }
          });

          this.setState({ tableHead: responseJson.header_top });
          this.setState({ tableData: responseJson.indicator_current_last });

          this.setState({ tableHeadBottom: responseJson.header_bottom });
          this.setState({ tableDataBottom: responseJson.indicator_current });

          this.setState({ subTitle: "(" + responseJson.mtd_text + ")" });
          ////console.warn('updated state.tableData: ', this.state.tableData);

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

 
 

  getRevenueBigStreamPerformance_prepare() {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);


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
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa_dvr/get_mtd_all_kpi_big_stream_dvr_daily/seller/' +
      this.state.selectedSellerValue;
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
          this.setState({ modalSubTitle: "Seller Wise " + responseJson.mtd_text });
          ////console.warn('updated state.tableData: ', this.state.tableData);

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

  getRevenueBigStreamPerformance_prepare_open(title) {
    //console.warn("in visitoption");
    //console.warn(title);
  setTimeout(() => {
    this.setState({ modalheight: null });
  }, 1000);


  this._get("jwt").then((jwt) => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', jwt);

    this.getRevenueBigStreamPerformance_open(myHeaders,title);

  }).catch((error) => {
    //this callback is executed when your Promise is rejected
    console.log('Promise is rejected with error: ' + error);
    this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
  });
}

getRevenueBigStreamPerformance_open(myHeaders,title) {

  this.setState({ showSpinner: true });
  const apiHost = this.state.user.apiHost;

  const url =
    apiHost +
    '/soa_dvr/get_mtd_subscriber_base_product_wise_dvr_daily/seller/' +
    this.state.selectedSellerValue +'/'+title;
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
      //console.log("\n\nRESPONSE JSON BIG STREAM: ", responseJson);

      if (responseJson.status == 401) {
        this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
      }

      else {
        this.setState({ revenueBigStreamTableHead: responseJson.header });
        this.setState({ revenueBigStreamTableData: responseJson.indicators });
        this.setState({ modalSubTitle:this.state.selectedRSMValue+'_'+ title+" Visits_" + responseJson.mtd_text });
        ////console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

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
    ////console.warn(title + " called");

    // this.setState({ modal_revenueBigStreamBreakupVisible: false });
    this.setState({ showSpinner: true });
    // const apiHost = 'http://192.168.10.10:8081/bi_dashboard/index.php';
    // const apiHost = 'http://209.150.154.21:8081/bi_dashboard/index.php';
    const apiHost = this.state.user.apiHost;


    const url =
      apiHost +
      '/soa/get_mtd_revenue_product_wise_for_big_stream/seller/' +
      this.state.selectedSellerValue +
      '/0/0/' + title.trim();


    ////console.warn(url);
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
          ////console.warn("this.state.productsDeltaValArray in getProductWisePerformanceForBigStream: ", this.state.productsDeltaValArray);

          this.setState({ revenueBigStreamTableHead: responseJson.header });
          this.setState({ revenueBigStreamTableData: responseJson.indicators });
          this.setState({ modalSubTitle: title + " | Revenue Breakup | MTD | " + responseJson.mtd_text });
          ////console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

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

  static navigationOptions = {
    header: null,
    title: 'Seller',
  };

  onPressRM = () => {
    // ////console.warn("RM: " + this.state.switchRM + " KAM: " + this.state.switchKAM + " BDO: " + this.state.switchBDO);
    this.setState({ switchRM: !this.state.switchRM }, () => this.getSellersForRD());


    // if(this.state.switchRM === true) {
    //   this.setState({ switchKAM: false });
    //   this.setState({ switchBDO: false });
    // }


  }

  onPressKAM = () => {
    this.setState({ switchKAM: !this.state.switchKAM }, () => this.getSellersForRD());
    // ////console.warn("RM: " + this.state.switchRM + " KAM: " + this.state.switchKAM + " BDO: " + this.state.switchBDO);

  }

  onPressBDO = () => {
    this.setState({ switchBDO: !this.state.switchBDO }, () => this.getSellersForRD());
    // ////console.warn("RM: " + this.state.switchRM + " KAM: " + this.state.switchKAM + " BDO: " + this.state.switchBDO);

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
    ////console.warn(title + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa/get_mtd_discount_product_wise/seller/' +
      this.state.selectedSellerValue +
      '/0/0/';
    ////console.warn(url);
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
          //console.log("Here We Are success case: ", responseJson);
          if (responseJson !== "data not found") {
            this.state.productsDeltaValArray = {};
            ////console.warn("this.state.productsDeltaValArray in getProductWisePerformanceForBigStream: ", this.state.productsDeltaValArray);

            this.setState({ revenueBigStreamTableHead: responseJson.header });
            this.setState({ revenueBigStreamTableData: responseJson.indicators });
            this.setState({ modalSubTitle: "Product Wise Discount | MTD | " + responseJson.mtd_text });
            ////console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

            this.setState({ modal_revenueBigStreamBreakupVisible: true });
          }
          //productsDeltaValArray gets empty here and the lines to follow (ultimately in processCellData function) populate it again for results received from here.



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
    ////console.warn(title + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa/get_mtd_payment_product_wise/seller/' +
      this.state.selectedSellerValue +
      '/0/0/';
    ////console.warn(url);
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

        ////console.warn("response:::::::", responseJson);

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {

          //productsDeltaValArray gets empty here and the lines to follow (ultimately in processCellData function) populate it again for results received from here.
          this.state.productsDeltaValArray = {};
          ////console.warn("this.state.productsDeltaValArray in getProductWisePerformanceForBigStream: ", this.state.productsDeltaValArray);

          this.setState({ revenueBigStreamTableHead: responseJson.header });
          this.setState({ revenueBigStreamTableData: responseJson.indicators });
          this.setState({ modalSubTitle: "Product Wise Payment | MTD | " + responseJson.mtd_text });
          ////console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

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
    ////console.warn(title + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa/get_mtd_subscriber_base_product_wise/seller/' +
      this.state.selectedSellerValue +
      '/0/0/';
    ////console.warn(url);
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

        ////console.warn("response:::::::", responseJson);

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {

          //productsDeltaValArray gets empty here and the lines to follow (ultimately in processCellData function) populate it again for results received from here.
          this.state.productsDeltaValArray = {};
          ////console.warn("this.state.productsDeltaValArray in getProductWisePerformanceForBigStream: ", this.state.productsDeltaValArray);

          this.setState({ revenueBigStreamTableHead: responseJson.header });
          this.setState({ revenueBigStreamTableData: responseJson.indicators });
          this.setState({ modalSubTitle: "Product Wise Subscriber Base | MTD | " + responseJson.mtd_text });
          ////console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

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
    ////console.warn(title + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    ////console.warn("this.state.productsDeltaValArray in getAccountWiseBase: ", this.state.productsDeltaValArray);
    ////console.warn("title: ", title);


    let is_positive = (this.state.productsDeltaValArray[title].indexOf("-") >= 0) ? 0 : 1;
    ////console.warn("IS POSITIVE, in BASE: ", is_positive);


    const url =
      apiHost +
      '/soa/get_mtd_subscriber_base_account_wise/seller/' +
      this.state.selectedSellerValue +
      '/0/0/' + title.trim() + '/' + is_positive;
    ////console.warn(url);
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
          ////console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

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


 

  getAccountWiseDiscount_prepare_compnwise(title,vstatus) {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);
//console.warn("seller wise info"+title+""+vstatus);

    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getAccountWiseDiscount_compnwise(title, myHeaders,vstatus);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });

  }
  getAccountWiseDiscount_compnwise(title, myHeaders,vstatus) {
    //console.warn(title + " called"+""+vstatus);

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    //console.warn("this.state.productsDeltaValArray in getAccountWiseDiscount: ", this.state.productsDeltaValArray);
    //console.warn("title: ", title);

   let is_positive = vstatus;
   // let is_positive = (this.state.productsDeltaValArray[title].indexOf("-") >= 0) ? 0 : 1;
    ////console.warn("IS POSITIVE, in DISCOUNT: ", is_positive);


    const url =
      apiHost +
      '/soa_dvr/get_mtd_discount_account_wise_dvr_sellerwise_daily/seller/' +
      this.state.selectedSellerValue +'/'+
       title.trim() + '/' + vstatus +'/0/0/';
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
          this.setState({ modalSubTitle: title+'|'+ responseJson.mtd_text });
          //console.warn('updated state.tableData: ', this.state.revenueBigStreamTableHead);

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

  
 
  getAccountWiseDiscount_prepare(title,visitstatus) {
  //console.warn(title+"ddhd");
    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);

    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getAccountWiseDiscount(title, myHeaders,visitstatus);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });

  }
  getAccountWiseDiscount(title, myHeaders,visitstatus) {
    //console.warn(title + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    ////console.warn("this.state.productsDeltaValArray in getAccountWiseDiscount: ", this.state.productsDeltaValArray);
    ////console.warn("title: ", title);


   // let is_positive = (this.state.productsDeltaValArray[title].indexOf("-") >= 0) ? 0 : 1;
    ////console.warn("IS POSITIVE, in DISCOUNT: ", is_positive);


    const url =
      apiHost +
      '/soa_dvr/get_mtd_discount_account_wise_dvr_daily/seller/' +
      this.state.selectedSellerValue +
      '/' + title.trim() + '/' + visitstatus+'/0/0/';
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
          this.setState({ modalSubTitle: title + " | " + responseJson.mtd_text });
          ////console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

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

      ////console.warn("MODAL HEIGHT INTIAL ::::::::::::::::::::::::::: ", height);
      height = height > screenHeight ? screenHeight * 0.8 : height;
      ////console.warn("MODAL HEIGHT FINAL ::::::::::::::::::::::::::: ", height);

      this.setState({ modalheight: height });
    }
  }

  getAccountWiseDiscount_prepare_compnwise_sellerinfo(title,vstatus) {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);
  //console.warn("seller wise info"+title);
  
    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);
  
      this.getAccountWiseDiscount_compnwise_sellerinfo(title, myHeaders,vstatus);
  
    }).catch((error) => {
      //this callback is executed when your Promise is rejected
     // console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });
  
  }
  getAccountWiseDiscount_compnwise_sellerinfo(title, myHeaders,vstatus) {
    //console.warn(title + " compname called");
  
    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;
  
   // //console.warn("this.state.productsDeltaValArray in getAccountWiseDiscount: ", this.state.productsDeltaValArray);
    ////console.warn("title: ", title);
  
   //let is_positive = 0;
   // let is_positive = (this.state.productsDeltaValArray[title].indexOf("-") >= 0) ? 0 : 1;
    ////console.warn("IS POSITIVE, in DISCOUNT: ", is_positive);
  
  
    const url =
      apiHost +
      '/soa_dvr/get_mtd_discount_account_wise_dvr_sellerwise_compwise/seller/' +
      this.state.selectedSellerValue +
      '/' + title.trim() + '/' + vstatus +'/0/0/';
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
          this.setState({ modalSubTitle: title+"|"+ responseJson.mtd_text});
        //  //console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);
  
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

      (data[0] == "TotalVisits" )
      ? <TouchableOpacity onPress={() =>this.getRevenueBigStreamPerformance_prepare()}>
        <View>
          <Text style={index === 0 ? styles.colText : styles.text}>{'Total Visits'}</Text>
        </View>
      </TouchableOpacity>
     : (['RM', 'BDO', 'KAM', 'CSO'].indexOf(data[0]) >= 0 || data[1] == "OpenVisits" || data[1] == "ClosedVisits" || data[1] == "TotalVisits" || data[1] == "SuccessfulVisit" || data[1] == "bigstream_revenue_indicator")
        ? <TouchableOpacity onPress={() => this.getAccountWiseDiscount_prepare(data[0],data[1])} rejectResponderTermination>
          <View>
            <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
          </View>
        </TouchableOpacity>
        : (data[0] == "SuccessfulVisit")
          ? <TouchableOpacity onPress={() => this.getRevenueBigStreamPerformance_prepare_open('Successful')} rejectResponderTermination>
            <View>
              <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
            </View>
          </TouchableOpacity>
          : (data[0] == "ClosedVisits")
            ? <TouchableOpacity onPress={() => this.getRevenueBigStreamPerformance_prepare_open('Closed')} rejectResponderTermination>
              <View>
                <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
              </View>
            </TouchableOpacity>
            : (data[0] == "OpenVisits")
              ? <TouchableOpacity onPress={() => this.getRevenueBigStreamPerformance_prepare_open('Open')} rejectResponderTermination>
                <View>
                  <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
                </View>
              </TouchableOpacity>
               : (data[1] == "discount_indicator")
                    ? <TouchableOpacity onPress={() => this.getAccountWiseDiscount_prepare_compnwise(data[0],data[2])} rejectResponderTermination>
                      <View>
                        <Text style={index === 0 ? styles.colText : styles.text}>{data[0]}</Text>
                      </View>
                    </TouchableOpacity>
                      : (data[1] == "dvr_indicator")
                      ? <TouchableOpacity onPress={() => this.getAccountWiseDiscount_prepare_compnwise_sellerinfo(data[0],data[2])} rejectResponderTermination>
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

        let title = (data[1] == "product_revenue_indicator" || data[1] == "discount_indicator" || data[1] == "dvr_indicator" || data[1] == "payment_indicator" || data[1] == "subscriber_base_indicator") ? (rowData[0][0]) : rowData[0];
        this.state.productsDeltaValArray[title] = rowData[3];
        // }
      }


      return (
        (data.includes("up_") || data.includes("down_"))
          ? element(data, index)
          : (['TotalVisits','OpenVisits','ClosedVisits','SuccessfulVisit','seller_indicator','RM','BDO', 'KAM','CSO'].indexOf(data[0]) >= 0 || data[1] == "discount_indicator" || data[1] == "product_revenue_indicator" || data[1] == "gcr_indicator" || data[1] == "dvr_indicator")? touchable(data ? data : "", index, rowData)
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
      cellIndex === 0 ? styles.singleHead : (cellIndex === 4 ? styles.singleHeadLast : (data === "Reconnection" ? styles.singleHeadTTPF : styles.singleHeadSixty))
    );

    const cellStyleBottom = (cellIndex) => (
      styles.singleHeadEqual
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

            <View onStartShouldSetResponder={() => true}>
    
    <ScrollView
      onLayout={(ev) => {
        this.resizeModal(ev);
      }}
      contentContainerStyle={styles.scrollContent}
    >

                  <Table style={styles.tableStyleModal} borderStyle={{ borderColor: 'transparent' }}>
                    <TableWrapper
                      style={styles.head}>
                      {state.revenueBigStreamTableHead.map((cellData, cellIndex) => (
                        <Cell
                          key={cellIndex}
                          data={putIcon(cellData)}
                          textStyle={cellIndex === 0 ? styles.colHeadText : styles.headText}
                          style={cellStyle(cellIndex)}
                        />
                      ))}
                    </TableWrapper>
                    {state.revenueBigStreamTableData.map((rowData, index) => (
                      <TableWrapper
                        key={index}
                        style={styles.row}>
                        {rowData.map((cellData, cellIndex, rowData) => (
                          <Cell
                            key={cellIndex}
                            data={processCellData(cellData ? cellData : "", cellIndex, rowData ? rowData : "")}
                            textStyle={cellIndex === 0 ? styles.colText : styles.text}
                            style={cellStyle(cellIndex, cellData)}
                          />
                        ))}
                      </TableWrapper>
                    ))}
                  </Table>

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
                      <Text style={styles.dismissModal}>Swipe up to dismiss</Text>
                    </View>
                  </TouchableOpacity>


</ScrollView>
</View>
            </ModalContent>
          </Modal>


          <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
            <View style={styles.rowSelectInput}>
              
              <View style={styles.smallInputWrapper}>
                <Text style={styles.label}>Select Seller</Text>

                <SelectInput
                  value={this.state.selectedSellerValue}
                  options={this.state.sellers}
                  onCancelEditing={() => { }}
                  onSubmitEditing={this.getSellerPerformance_prepare.bind(this)}
                  submitKeyText="Done"
                  cancelKeyText="Close"
                  style={[styles.selectInput, styles.selectInputSmall]}
                />
              </View>
            </View>

          </ScrollView>

          {/* <View style={{ flex: 2, flexDirection: "column", justifyContent: "space-evenly" }}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerLabel}>
              <Text style={styles.pickerLabelText}>Select TL: </Text>
            </View>
            <View style={styles.pickerItself}>
              <Picker
                selectedValue={this.state.selectedTL}
                mode="dialog"
                style={{ height: Platform.OS === 'ios' ? 5 : 50, width: '100%', marginRight: 10 }}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({ selectedTL: itemValue });
                  this.getSellersForRD(itemValue);
                  // Alert.alert('Info', itemValue);
                }}>
                {this.state.tls == null ? (
                  <Picker.Item label="Loading list of TLs" value={0} key={0} />
                ) : (
                    this.state.tls.map((item, key) => (
                      <Picker.Item
                        label={item.name}
                        value={item.username}
                        key={key}
                      />
                    ))
                  )}
              </Picker>
            </View>
          </View>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerLabel}>
              <Text style={styles.pickerLabelText}>Select Seller: </Text>
            </View>
            <View style={styles.pickerItself}>
              <Picker
                selectedValue={this.state.selectedSeller}
                mode="dialog"
                style={{ height: Platform.OS === 'ios' ? 5 : 50, width: '100%', marginRight: 10 }}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({ selectedSeller: itemValue });
                  this.getSellerPerformance(itemValue);
                  // Alert.alert('Info', itemValue);
                }}>
                {this.state.sellers == null ? (
                  <Picker.Item
                    label="Loading list of Sellers"
                    value={0}
                    key={0}
                  />
                ) : (
                    this.state.sellers.map((item, key) => (
                      <Picker.Item
                        label={item.name}
                        value={item.username}
                        key={key}
                      />
                    ))
                  )}
              </Picker>
            </View>
          </View>
        </View> */}

          <View>
            <Text style={styles.title}>{this.state.selectedSellerLabel}{"\n"}{this.state.subTitle}</Text>
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
         
          <Table style={styles.tableStyle} borderStyle={{ borderColor: 'transparent' }}>

            <TableWrapper
              style={styles.head}>
              <Cell
                data={"AVG Visits Per Week"}
                textStyle={styles.headText}
              />
            </TableWrapper>

            <TableWrapper
              style={styles.row}>
              {state.tableHeadBottom.map((cellData, cellIndex, rowData) => (
                <Cell
                  key={cellIndex}
                  data={processCellData(cellData ? cellData : "", cellIndex, rowData ? rowData : "")}
                  textStyle={styles.colTextBottom}
                  style={cellStyleBottom(cellIndex)}
                />
              ))}
            </TableWrapper>

            <TableWrapper
              style={styles.row}>
              {state.tableDataBottom.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={cellData ? cellData : ""}
                  textStyle={cellIndex === 0 ? styles.text : styles.text}
                  style={cellStyleBottom(cellIndex)}
                />
              ))}
            </TableWrapper>
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
    paddingTop: 5,
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
    width: "100%",
  },

  singleHead: {
    width: "31%",
  },

  singleHeadSixty: {
    width: "19.5%"
  },

  singleHeadTTPF: {
    width: "22.5%"
  },

  singleHeadLast: {
    width: "12%"
  },

  tableStyle: {
    marginBottom: 10
  },

  tableStyleModal: {
    padding: 0,
    marginTop: 20,
  },

  head: {
    flexDirection: 'row',
    marginLeft: 0,
    height: 40,
    backgroundColor: '#8dc540',
   // color: 'white',
    width: "100%"
  },

  text: {
    paddingVertical: 10,
    textAlign: 'center',
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

  colHeadText: {
    // marginTop: 10,
    //textAlign: 'left',
    marginLeft: 3,
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },

  row: {
    marginLeft: 0,
    flexDirection: 'row',
    backgroundColor: '#FFF1C14a',
    width: "100%"
  },

  modalContent: {
    paddingHorizontal: 2,
  },

  allSwitchContainerView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },

  switchContainerView: {
    marginHorizontal: 1
  },

  scrollViewContentContainer: {
    flex: 1,
    width: '100%',
    padding: MARGIN_LARGE,
    flexDirection: 'column',
    justifyContent: "flex-start",
    marginVertical: 10,
  },
  label: {
    fontSize: 13,
    marginTop: MARGIN_LARGE,
    color: "#ed0281"
  },
  rowSelectInput: {
    flexDirection: 'row',
    justifyContent: "space-evenly",
  },
  smallInputWrapper: {
    width: '80%',
    flexDirection: 'column',
  },
  selectInput: {
    flexDirection: Platform.OS === 'ios' ? "row" : "column",               //>ios
    height: Platform.OS === 'ios' ? 36 : 40,                         //>ios
    borderWidth: 0,                     //both
    borderRadius: 0,                    //both
    padding: MARGIN_SMALL,              //both
    marginTop: MARGIN_LARGE,            //both
    backgroundColor: '#FFFFFF',         //both
    borderColor: '#eee',       //both
    borderWidth: 1,               //both
    borderBottomColor: '#ed0281',       //both
    borderBottomWidth: 1,               //both
  },
  selectInputSmall: {
    width: '100%',
  },
  selectInputLarge: {
    width: '100%',
    paddingHorizontal: MARGIN_LARGE,
  },
  bananawrapper: {
    margin: MARGIN_LARGE * 2,
    marginBottom: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    height: 1,
    marginHorizontal: MARGIN_SMALL,
    backgroundColor: 'black',
  },


});

const MARGIN_SMALL = 8;
const MARGIN_LARGE = 16;
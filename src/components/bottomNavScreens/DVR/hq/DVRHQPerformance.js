import React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity,SafeAreaView, Alert, ImageBackground, Dimensions } from 'react-native';
import { Table, TableWrapper, Cell } from 'react-native-table-component';
import { Icon } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal, { ModalTitle, SlideAnimation, ModalContent } from 'react-native-modals';
import { NavigationActions } from 'react-navigation';
import * as SecureStore from 'expo-secure-store';
import axios from "axios"

export default class DVRHQPerformance extends React.Component {
  static navigationOptions = {
    title: 'HQ Performance',
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
      tableHeadBottom: ['Loading data'],
      tableDataBottom: [['']],
      title: "",
      modalSubTitle: "",
      widthArr: ['100%'],
      showSpinner: false,
      revenueBigStreamTableHead: ['Loading data'],
      revenueBigStreamTableData: [['']],
      modal_revenueBigStreamBreakupVisible: false,
      productsDeltaValArray: {},
      modalheight: null
    };
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

  getHQPerformance(myHeaders) {
    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa_dvr/get_mtd_all_kpi_dvr/' +
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


        ////console.warn("\n\nresponse json ::::::::::::::::::: ", responseJson, "\n\n");

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
          this.setState({ tableHead: responseJson.header_top });
          this.setState({ tableData: responseJson.indicator_current_last });

          this.setState({ tableHeadBottom: responseJson.header_bottom });
          this.setState({ tableDataBottom: responseJson.indicator_current });

          this.setState({ title: responseJson.mtd_text });
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
        ////console.warn("Error after fetch failed: ", error);
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

    //call get HQ Performance
    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getHQPerformance(myHeaders);

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
  }

  _componentFocused = () => {
    this.props.navigation.closeDrawer();
  }


  getRevenueBigStreamPerformance_prepare() {
      console.warn("ddd");
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
      '/soa_dvr/get_mtd_all_kpi_big_stream_dvr/' +
      this.state.user.role +
      '/' +
      this.state.user.username;
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
      console.log("\n\nRESPONSE JSON BIG STREAM: ", responseJson);

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {
          this.setState({ revenueBigStreamTableHead: responseJson.header });
          this.setState({ revenueBigStreamTableData: responseJson.indicators });
          this.setState({ modalSubTitle: "" + responseJson.mtd_text });
          console.warn('updated state.tableData: ', this.state.revenueBigStreamTableData);

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
    //console.warn("ddd");
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
    '/soa_dvr/get_mtd_subscriber_base_product_wise_dvr/' +
    this.state.user.role +
    '/' +
    this.state.user.username+'/'+title;
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
      //console.log("\n\nRESPONSE JSON BIG STREAM: ", responseJson);

      if (responseJson.status == 401) {
        this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
      }

      else {
        this.setState({ revenueBigStreamTableHead: responseJson.header });
        this.setState({ revenueBigStreamTableData: responseJson.indicators });
        this.setState({ modalSubTitle: title+" | " + responseJson.mtd_text });
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



 
  getAccountWiseDiscount_prepare(title,visitstatus) {

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
    //echo(title + " ACCOUNTWISEDVRcalled");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    //console.warn("this.state.productsDeltaValArray in getAccountWiseDiscount: ", this.state.productsDeltaValArray);
    //console.warn("title: ", title);

   let is_positive = visitstatus;
   // let is_positive = (this.state.productsDeltaValArray[title].indexOf("-") >= 0) ? 0 : 1;
    ////console.warn("IS POSITIVE, in DISCOUNT: ", is_positive);


    const url =
      apiHost +
      '/soa_dvr/get_mtd_discount_account_wise_dvr/' +
      this.state.user.role +
      '/' +
      this.state.user.username +
     '/'+ title.trim() + '/' + is_positive+ '/0/0/' ;
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
          this.setState({ modalSubTitle: title + "| " + responseJson.mtd_text });
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
//console.warn("seller wise info"+title);

    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getAccountWiseDiscount_compnwise(title, myHeaders,vstatus);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
     // console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });

  }
  getAccountWiseDiscount_compnwise(title, myHeaders,vstatus) {
    //console.warn(title + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

   // //console.warn("this.state.productsDeltaValArray in getAccountWiseDiscount: ", this.state.productsDeltaValArray);
    ////console.warn("title: ", title);

   //let is_positive = 0;
   // let is_positive = (this.state.productsDeltaValArray[title].indexOf("-") >= 0) ? 0 : 1;
    ////console.warn("IS POSITIVE, in DISCOUNT: ", is_positive);


    const url =
      apiHost +
      '/soa_dvr/get_mtd_discount_account_wise_dvr_sellerwise/' +
      this.state.user.role +
      '/' +
      this.state.user.username +
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
          this.setState({ modalSubTitle: title });
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

 //compwise sellerinfo
 
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
    '/soa_dvr/get_mtd_discount_account_wise_dvr_sellerwise_compwise_monthly/' +
    this.state.user.role +
    '/' +
    this.state.user.username +
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
      // this.setState({ modalheight: null });
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
      (data[0] == "TotalVisits" )
        ? <TouchableOpacity onPress={() => this.getRevenueBigStreamPerformance_prepare()}>
          <View>
            <Text style={index === 0 ? styles.colText : styles.text}>{"Total Visits"}</Text>
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
                <Text style={index === 0 ? styles.colText : styles.text}>{"Successful Visit"}</Text>
              </View>
            </TouchableOpacity>
            : (data[0] == "ClosedVisits")
              ? <TouchableOpacity onPress={() => this.getRevenueBigStreamPerformance_prepare_open('Closed')} rejectResponderTermination>
                <View>
                  <Text style={index === 0 ? styles.colText : styles.text}>{"Closed Visits"}</Text>
                </View>
              </TouchableOpacity>
              : (data[0] == "OpenVisits")
                ? <TouchableOpacity onPress={() => this.getRevenueBigStreamPerformance_prepare_open('Open')} rejectResponderTermination>
                  <View>
                    <Text style={index === 0 ? styles.colText : styles.text}>{"Open Visits"}</Text>
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

      // console.log(data);

      if (typeof rowData != undefined && rowData != null) {

        let title = (data[1] == "product_revenue_indicator" || data[1] == "dvr_indicator" || data[1] == "discount_indicator" || data[1] == "payment_indicator" || data[1] == "subscriber_base_indicator") ? (rowData[0][0]) : rowData[0];
        this.state.productsDeltaValArray[title] = rowData[3];
        // }
      }

      return (
        (data.includes("up_") || data.includes("down_"))
          ? element(data, index)
          : (['TotalVisits','OpenVisits','ClosedVisits','SuccessfulVisit','seller_indicator','1Line','RM','BDO', 'KAM','CSO'].indexOf(data[0]) >= 0 || data[1] == "discount_indicator" || data[1] == "product_revenue_indicator" || data[1] == "dvr_indicator" || data[1] == "gcr_indicator")
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
      cellIndex === 0 ? styles.singleHead : (cellIndex === 4 ? styles.singleHeadLast : (data === "Reconnection" ? styles.singleHeadTTPF : styles.singleHeadSixty))
    );

    const cellStyleBottom = (cellIndex) => (
      styles.singleHeadEqual
    );

    return (

      <ImageBackground source={{ uri: this.state.user.punch }} style={{ width: "100%", height: "100%" }} imageStyle={{ height: "200%", width: "100%", resizeMode: "repeat" }}>
       
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
            // useNativeDriver={true}
            width={0.97}
            height={400}
            
            // height={this.state.modalheight}
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
  <View flex={1} onStartShouldSetResponder={() => true}>
    
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
                        this.setState({ modalheight: 50 });
                      }, 1000);
                    }}
                    rejectResponderTermination
                  >
                 
                  </TouchableOpacity>
      </ScrollView>
  </View>
  <View>
                      <Text style={styles.dismissModal}>Please swipe up to dismiss</Text>
                    </View>
</ModalContent> 
</Modal>
                     
          <View>
            <Text style={styles.title}>GCSS NWD{"\n"}({this.state.title})</Text>
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
                  data={processCellData(cellData ? cellData : "", cellIndex, rowData)}
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

     
      </ImageBackground>
    );
  }
}
 
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 2,
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
    marginBottom: 10,
  },

  tableStyleModal: {
    padding: 0,
    marginTop: 20,
  },

  head: {
    flexDirection: 'row',
    marginLeft: 0,
    textAlign: 'center',
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
    marginLeft: 10,
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

 /* modalContent: {
    paddingHorizontal: 2,
  }*/
  modalContent: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
  },
  imageStyle: {
    resizeMode: "repeat",
  },
  scrollContent: {
    flexGrow: 10,
  }
});

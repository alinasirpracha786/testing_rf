import React, { Component }  from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Platform, Alert, ImageBackground, Dimensions } from 'react-native';
import { Table, TableWrapper, Cell } from 'react-native-table-component';
import { Icon } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal, { ModalTitle, SlideAnimation, ModalContent } from 'react-native-modals';
import { NavigationActions } from 'react-navigation';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import SelectInput from 'react-native-select-input-ios';

export default class RDPerformanceMOM extends Component {

  state = {
    user: this.props.navigation.getParam('user', null),
    selectedRDLabel: 'Please Select Region',
    selectedRDValue: 0,
    rds: [{ value: 0, label: 'Loading' }],
    tableHead: [''],
    tableData: [['']],
    tableHeadBottom: [''],
    tableDataBottom: [['']],
    subTitle: "",
    modalSubTitle: "",
    widthArr: ['100%'],
    showSpinner: false,
    revenueBigStreamTableHead: ['Loading data'],
    revenueBigStreamTableData: [['']],
    modal_revenueBigStreamBreakupVisible: false,
    productsDeltaValArray: {},
    modalheight: null,
    jsonData: 'empty',
    selectedYearValue: 0,
    years: [{ value: 0, label: 'Loading...' }],
  };

  constructor(props) {
    super(props);

  }
  static navigationOptions = {
    header: null,
    title: 'RD',
  };

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


  getRegionsForHQ() {
    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url = apiHost + '/soa/return_rds_for_hq/1';
    //console.warn("URL: " + url);

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

            this.setState({ rds: responseJson });
            //console.warn('------------- rds: ', this.state.rds);

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
    this.getRegionsForHQ();
    // //console.warn('>>>>>>>>>>>>>>> IN DID MOUNT: ', this.state.rsms);

    this._componentFocused();
    this._sub = this.props.navigation.addListener(
      'didFocus',
      this._componentFocused
    );

    this.getYearsAndRegions_prepare();
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

  onYearSelect(selectedYear) {
   //  Alert.alert(selectedYear);
   // console.warn("SELECTED YEAR: ", selectedYear);
    this.setState({ selectedYearValue: selectedYear });
   // this.setState({ selectedRDValue: value });
   //this.setState({ selectedYearValue: selectedYear });
    this.getRDPerformance_prepare();
  }

  onRDSelect(selectedRD) {
   // Alert.alert(selectedRD);
  
   this.setState({ selectedRDValue: selectedRD });

  this.state.rds.forEach(rd => {
    if (rd.value == selectedRD) {
      //console.warn('matched name: ', rd.label);
    this.setState({selectedRDLabel: '('+rd.label.split('(')[1] });
   
    }
  });

   this.getRDPerformance_prepare();
 }

  componentWillUnmount() {
    this._sub.remove();
  }

  getRDPerformance_prepare() {
    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getRDPerformance(myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });
  }

  getRDPerformance(myHeaders) {
    this.setState({ showSpinner: true });
   
    const apiHost = this.state.user.apiHost;
    const url = apiHost + '/soa/get_mom_seller_performance/rd'+'/'+this.state.selectedRDValue + '/'+this.state.selectedYearValue ;
   // console.log('url', this.state.selectedRDValue);
  //  Alert.alert(this.state.selectedRDValue+""+this.state.selectedYearValue);
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

         

          this.setState({ tableHead: responseJson.header_top });
          this.setState({ tableData: responseJson.indicator_current_last });

          this.setState({ tableHeadBottom: responseJson.header_bottom });
          this.setState({ tableDataBottom: responseJson.indicator_current });

          this.setState({ subTitle: "(" + responseJson.mtd_text + ")" });
         // console.warn('updated state.tableData: ', this.state.tableData);

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
        Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
          {
            text: 'Ok',
          },
        ],
          { cancelable: false });
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

      (data[0] == "Net Revenue Non-Aggregator" && data[1] == "mtd_indicator")
        ? <TouchableOpacity onPress={() => this.getRevenueBigStreamPerformance_prepare()}>
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

        let title = (data[1] == "product_revenue_indicator" || data[1] == "discount_indicator" || data[1] == "payment_indicator" || data[1] == "subscriber_base_indicator") ? (rowData[0][0]) : rowData[0];
        this.state.productsDeltaValArray[title] = rowData[3];

       // console.warn("this.state.productsDeltaValArray: ", this.state.productsDeltaValArray);

        // }
      }


      return (
        (data.includes("up_") || data.includes("down_"))
          ? element(data, index)
          : (['Revenue', 'Discount', 'Base', 'Payment', '1Line', '3i', 'Mobility', 'IaaS',
            'PRI', 'FBB', 'M2M', 'VPBX',
            'BVMB', 'IoT', 'PTT', 'CBS',
            'Zong Track', 'ZFM', 'GSM',
            'MBB', 'ICT', 'Churn', 'Gross Adds',
            'Reconnection', 'Terminal', 'Prepaid',
            'Zong Moto guard', 'Zong Track', 'Zong Track ', 'Employee Tariff',
            'TEST Tariff', 'Daas', 'Zong Energy Management',
            'Zong water Management', 'NULL'].indexOf(data[0]) >= 0 || data[1] == "discount_indicator" || data[1] == "product_revenue_indicator" || data[1] == "gcr_indicator")
            ? touchable(data, index, rowData)
            : untouchable(data, index)
      );
    };


    const cellStyle = (cellIndex, data = null) => (
      cellIndex === 0 ? styles.singleHead : (cellIndex === 3 ? styles.singleHeadEqual : (data === "Reconnection" ? styles.singleHeadTTPF : styles.singleHeadSixty))
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

          <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
            <View style={styles.rowSelectInput}>
              <View style={styles.smallInputWrapper}>
                <Text style={styles.label}>Select RD</Text>

                <SelectInput
                  value={this.state.selectedRDValue}
                  options={this.state.rds}
                  onCancelEditing={() => { }}
                  onSubmitEditing={this.onRDSelect.bind(this)}
                  submitKeyText="Done"
                  cancelKeyText="Close"
                  style={[styles.selectInput, styles.selectInputSmall]}
                />
              </View>
            </View>

          </ScrollView>

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

          <View>
            <Text style={styles.title}>{this.state.selectedRDLabel}{"\r"}{this.state.subTitle}</Text>
          </View>

         
          <Table style={styles.tableStyle} borderStyle={{ borderColor: 'transparent' }}>


            <TableWrapper
              style={styles.headbottom}>
              {state.tableHeadBottom.map((cellData, cellIndex, rowData) => (
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
              {state.tableDataBottom.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={cellData ? cellData : ""}
                  textStyle={cellIndex === 0 ? styles.textbottom : styles.textbottom}
                  style={cellStyleBottom(cellIndex)}
                />
              ))}
            </TableWrapper>

            
          </Table>
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
    paddingVertical: 0,
    marginLeft: 5,
    fontSize: 14,
    color: '#ed0281',
    fontWeight: 'bold',
  },

  colTextBottom: {
    textAlign: 'center',
    //paddingVertical: 10,
    marginLeft: 0,
    fontSize: 14,
    color: '#ed0281',
    fontWeight: 'bold',
  },
  colHeadTextbottom: {
    // marginTop: 10,
    //textAlign: 'lef                                                                                     t',
    marginLeft: 0,
    fontSize: 14,
    color: 'white',
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
  singleHeadbottom: {
    width: "35%",
  },
  headbottom: {
    flexDirection: 'row',
    marginLeft: 0,
    backgroundColor: '#8dc540',
    color: 'white',
    width: "100%"
  },

  colHeadText: {
    // marginTop: 10,
    //textAlign: 'left',
    marginLeft: 0,
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  textbottom: {
    paddingVertical: 0,
    textAlign: 'center',
    color: '#ed0281',
    fontSize: 14
  },
  colTextBottom: {
    textAlign: 'center',
    paddingVertical: 10,
    marginLeft: 3,
    fontSize: 14,
    color: '#ed0281',
    fontWeight: 'bold',
  },

  headTextbottom: {
    //textAlign: 'center',
    paddingVertical: 0,
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    textAlign: "center"
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
    width: '95%',
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
    // borderRadius: 4,
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
import React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert, ImageBackground, Dimensions } from 'react-native';
import { Table, TableWrapper, Cell } from 'react-native-table-component';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal, { ModalTitle, SlideAnimation, ModalContent } from 'react-native-modals';
import { NavigationActions } from 'react-navigation';
import * as SecureStore from 'expo-secure-store';
import SelectInput from 'react-native-select-input-ios'


export default class RDPerformance extends React.Component {
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
      tableHeadBottom: ['Loading data'],
      tableDataBottom: [['']],
      subTitle: "",
      modalSubTitle: "",
      widthArr: ['100%'],
      showSpinner: false,
      modalTableHead: ['Loading data'],
      modalTableData: [['']],
      modal_revenueBigStreamBreakupVisible: false,
      productsDeltaValArray: {},
      modalheight: null,
      years: [{ value: 0, label: 'Loading...' }],
      regions: [{ value: 0, label: 'Loading...' }],
      selectedYearValue: 0,
      selectedRegionValue: 0,
      selectedTileValue: 0,
      selectedTileLabel: null,

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
      '/soa/get_tva_years_regions/' +
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

  componentDidMount() {

    this.props.navigation.dispatch(
      NavigationActions.init({
        params: { user: user },
      }),
    );

    this.getYearsAndRegions_prepare();


    //call get RD Performance
    // this._get("jwt").then((jwt) => {
    //   var myHeaders = new Headers();
    //   myHeaders.append('Content-Type', 'application/json');
    //   myHeaders.append('Authorization', jwt);

    //   this.getRDDormancy(myHeaders);

    // }).catch((error) => {
    //   //this callback is executed when your Promise is rejected
    //   //console.log('Promise is rejected with error: ' + error);
    //   this.tokenInvalidResponse("Token Not Found", "Token not found, please login again.");
    // });


    this._componentFocused();
    this._sub = this.props.navigation.addListener(
      'didFocus',
      this._componentFocused
    );
  }

  _componentFocused = () => {
    this.props.navigation.closeDrawer();
  }


  onYearSelect(selectedYear) {
    // Alert.alert(selectedYear);
    //console.warn("SELECTED YEAR: ", selectedYear);
    this.setState({ selectedYearValue: selectedYear });
    this.getTVA_prepare();
  }

  // onRegionSelect(selectedRegion) {
  //   // Alert.alert(selectedRegion);
  //   //console.warn("SELECTED REGION: ", selectedRegion);
  //   this.setState({selectedRegionValue: selectedRegion})
  //   this.getTVA_prepare();
  // }

  componentWillUnmount() {
    this._sub.remove();
  }

  rd_to_region_mapping(rd) {

    // Alert.alert('Title', 'WINDOW: Height is: ' + Dimensions.get('window').height + ' and Width is: ' + Dimensions.get('window').width + ' AND SCREEN: Height is: ' + Dimensions.get('screen').height + ' and Width is: ' + Dimensions.get('screen').width);
    if (rd == 'abdul.hadi.dar') {
      return "Central"
    }
    else if (rd == 'salman.ahmad') {
      return "North"
    }
    else if (rd == 'sameer.mughal') {
      return "South"
    }
  }

  getTVA_prepare(tile = null) {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);


    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getTVA(tile, myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });

  }

  getTVA(tile = null, myHeaders) {
    //console.warn(tile + " called");
    tile ? this.setState({ selectedTileLabel: tile[0] }) : null;
    tile ? this.setState({ selectedTileValue: tile[1] }) : null;


    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa/get_tva/' +
      this.state.user.role +
      '/' +
      this.state.user.username +
      '/' +
      this.state.selectedTileValue +
      '/' +
      this.state.selectedYearValue +
      '/' +
      this.state.user.big_region;

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

        //console.warn("RESPONSE TEXT: ", responseJson);


        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {

          this.setState({ modalTableHead: responseJson.header });
          this.setState({ modalTableData: responseJson.indicators });
          this.setState({ modalSubTitle: this.state.selectedTileLabel + "\nAccounts & Product wise Dormancy " });

          //console.warn('updated state.tableData: ', this.state.modalTableData);
          this.setState({ modal_revenueBigStreamBreakupVisible: true });
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

  onTilePress(tile) {
    // Alert.alert("Tile", tile);
    this.getTVA_prepare(tile);
  }


  render() {

    const tilesArray = [["Total Revenue", "revenue", "dollar-sign"], ["Churn", "churn", "door-open"], ["Bad Debt", "bad_debt", "weight-hanging"], ["Total GAs", "ga", "user-plus"], ["GSM GAs", "gsm_ga", "plus-square"], ["M2M GAs", "m2m_ga", "plus-square"], ["MBB GAs", "mbb_ga", "plus-square"], ["ESS", "ess_revenue", "cogs"]];

    const element = (data, index) => (
      <Icon
        name={'arrow-drop-' + data.split("_")[0]}
        size={40}
        color={data.split("_")[1]}
        style={{ textAlign: 'center' }}
      />
    );

    const touchable = (data, index) => (

      (data[1] == "dormancy_indicator")
        ? <TouchableOpacity onPress={() => this.getAccountAndProductWiseDormancy_prepare(data[0])} rejectResponderTermination>
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

      return (
        (data.includes("up_") || data.includes("down_"))
          ? element(data, index)
          : (data[1] == "dormancy_indicator")
            ? touchable(data, index)
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

    const cellStyleModal = (cellIndex) => (
      cellIndex === 0 ? { width: "20%" } : { width: "20%" }
    );

    return (

      <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
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

          modalTitle={<View style={{ textAlign: "center", paddingVertical: 10 }}><Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>{this.state.modalSubTitle}</Text></View>}

        >
          <ModalContent style={styles.modalContent}>
            <ImageBackground source={{ uri: this.state.user.punch }} style={{}} imageStyle={{ height: "400%", width: "100%", resizeMode: "repeat" }}>
              <ScrollView onLayout={(ev) => { this.resizeModal(ev) }}>

                <View style={styles.rowSelectInput}>
                  <View style={styles.smallInputWrapper}>
                    <Text style={styles.label}>Select Year</Text>

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

                  {/* <View style={styles.smallInputWrapper}>
                    <Text style={styles.label}>Select Region</Text>

                    <SelectInput
                      value={this.state.selectedRegion}
                      options={this.state.regions}
                      onCancelEditing={() => //console.log('onCancel')}
                      onSubmitEditing={this.onRegionSelect.bind(this)}
                      submitKeyText="Done"
                      cancelKeyText="Close"
                      style={[styles.selectInput, styles.selectInputSmall]}
                    />
                  </View> */}
                </View>


                <Table style={styles.tableStyleModal} borderStyle={{ borderColor: 'transparent' }}>
                  <TableWrapper
                    style={styles.head}>
                    {this.state.modalTableHead.map((cellData, cellIndex) => (
                      <Cell
                        key={cellIndex}
                        // data={putIcon(cellData)}
                        data={putIcon(cellData ?? "")}
                        textStyle={cellIndex === 0 ? styles.colHeadText : styles.headText}
                        style={cellStyleModal(cellIndex)}
                      />
                    ))}
                  </TableWrapper>
                  {this.state.modalTableData.map((rowData, index) => (
                    <TableWrapper
                      key={index}
                      style={styles.row}>
                      {rowData.map((cellData, cellIndex, rowData) => (
                        <Cell
                          key={cellIndex}
                          // data={processCellData(cellData, cellIndex, rowData)}
                          data={processCellData(cellData ? cellData : "", cellIndex, rowData ? rowData : "")}
                          textStyle={cellIndex === 0 ? styles.colText : styles.text}
                          style={cellStyleModal(cellIndex)}
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
                    <Text style={styles.dismissModal}>Click here or swipe up to dismiss</Text>
                  </View>
                </TouchableOpacity>

              </ScrollView>
            </ImageBackground>

          </ModalContent>
        </Modal>

        {/* <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}> */}
        <View style={styles.container}>

          {
            tilesArray.map((data, index) => (
              <TouchableOpacity onPress={() => this.onTilePress(data)}>
                <View style={styles.outerView}>
                  <Icon name={data[2]} size={30} style={styles.icon} />
                  <View style={styles.innerView}>
                    <Text style={styles.tileText}>{data[0]}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          }



        </View>
        {/* </View> */}
      </View>

    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#ddd"
  },
  outerView: {
    borderRadius: 10,
    height: 110,
    width: 120,
    borderWidth: 2,
    borderColor: "#8dc540",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#eee"
  },
  innerView: {
    position: "absolute",
    left: 0 - 2,
    top: 110 - 30 - 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 30,
    width: 120,
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
    fontSize: 16
  },

  icon: {
    marginBottom: 30,
    color: '#ed0281'
  },

  spinnerTextStyle: {
    color: '#fff',
    fontSize: 30
  },

  dismissModal: {
    color: "grey",
    textAlign: "center",
    paddingBottom: 40
  },

  singleHeadEqual: {
    width: "33%",
  },

  singleHead: {
    width: "30%",
  },

  singleHeadSixty: {
    width: "33%"
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
    width: '90%',
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
    // borderRadius: 10
  },
  selectInputSmall: {
    width: '100%',
  },
  selectInputLarge: {
    width: '100%',
    paddingHorizontal: MARGIN_LARGE,
  },


});

const MARGIN_SMALL = 8;
const MARGIN_LARGE = 16;
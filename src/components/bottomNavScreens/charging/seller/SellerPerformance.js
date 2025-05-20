import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert, ImageBackground, Dimensions } from 'react-native';
import { Table, TableWrapper, Cell } from 'react-native-table-component';
import { Icon } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal, { ModalTitle, SlideAnimation, ModalContent } from 'react-native-modals';
import { NavigationActions } from 'react-navigation';
import * as SecureStore from 'expo-secure-store';
import SearchableDropdown from 'react-native-searchable-dropdown';

export default class SellerPerformance extends Component {
  static navigationOptions = {
    header: null,
    title: 'Seller',
  };

  constructor(props) {
    super(props);
    this.state = {
      user: this.props.navigation.getParam('user', null),
      tableHead: [''],
      tableData: [['']],
      title: "",
      modalSubTitle: "",
      showSpinner: false,
      revenueBigStreamTableHead: ['Loading data'],
      revenueBigStreamTableData: [['']],
      modal_revenueBigStreamBreakupVisible: false,
      modalheight: null,
      sellersSourceList: [{ "username": "0", "name": "Loading ..." }],
      accountsSourceList: [{ "id": "0", "name": "Loading ..." }],
      selectedSellerUsername: 0,
      selectedAccountName: 0
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

  getSellersAgainstAccount(myHeaders, account = 0) {
    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa/return_sellers_against_account/' +
      this.state.user.role +
      '/' +
      this.state.user.username +
      '/' +
      account;
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
        //console.warn("\n\nresponse json ::::::::::::::::::: ", responseJson, "\n\n");

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {
          this.setState({ sellersSourceList: responseJson });
          //console.warn('updated state.sellersSourceList: ', this.state.sellersSourceList);
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


  getAccountsAgainstSeller(myHeaders, seller_username = 0) {
    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa/return_accounts_against_seller/' +
      this.state.user.role +
      '/' +
      this.state.user.username +
      '/' +
      seller_username;
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
        // //console.warn("\n\nresponse json ::::::::::::::::::: ", responseJson, "\n\n");

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        else {
          const arrayToClean = responseJson;
          const cleanedArray = [];
          arrayToClean.forEach((val) => {
            if (val.name !== null) {
              cleanedArray.push(val);
            }
          });
          this.setState({ accountsSourceList: cleanedArray });
          // //console.warn('updated state.accountsSourceList: ', this.state.accountsSourceList);
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

  getAccountsCharging_prepare() {
    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getAccountsCharging(myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });
  }

  getAccountsCharging(myHeaders) {
    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost +
      '/soa/get_accounts_charging/' +
      this.state.user.role +
      '/' +
      this.state.user.username +
      '/' +
      this.state.selectedSellerUsername +
      '/' +
      this.state.selectedAccountName;

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
        //console.warn("\n\nhere response json ::::::::::::::::::: ", responseJson, "\n\n");

        if (responseJson.status == 401) {
          this.tokenInvalidResponse("Invalid Token", "Token is not valid anymore, please login again.");
        }

        if (responseJson.status == 404) {
          //console.warn("exception thrown", responseJson.message);
          throw responseJson.message;
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
          this.setState({ tableHead: responseJson.header });
          this.setState({ tableData: responseJson.indicators });

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

  componentDidMount() {

    this.props.navigation.dispatch(
      NavigationActions.init({
        params: { user: user },
      }),
    );

    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getSellersAgainstAccount(myHeaders);
      this.getAccountsAgainstSeller(myHeaders);

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

  componentWillUnmount() {
    this._sub.remove();
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

    const untouchable = (data, index) => (
      <View>
        <Text style={index === 0 ? styles.colText : styles.text}>{data}</Text>
      </View>
    );

    const processCellData = (data, index, rowData) => {

      return (
        untouchable(data, index)
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
      cellIndex === 0 ? styles.singleHead : styles.singleHeadCol
    );

    const cellStyleBottom = (cellIndex) => (
      styles.singleHeadEqual
    );

    return (

      <ImageBackground source={{ uri: this.state.user.punch }} style={{ width: "100%", height: "100%" }} imageStyle={{ height: "1400%", width: "700%", resizeMode: "repeat" }}>

        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
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
                            data={processCellData(cellData, cellIndex, rowData)}
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
                      <Text style={styles.dismissModal}>Click here or swipe up to dismiss</Text>
                    </View>
                  </TouchableOpacity>

                </ScrollView>
              </ImageBackground>

            </ModalContent>
          </Modal>

          <View style={styles.rowSelectInput}>
            <View style={styles.smallInputWrapper}>
              <Text style={styles.label}>Select Account</Text>

              <SearchableDropdown
                onItemSelect={(item) => {
                  //console.warn("selected account ", item);
                  this.setState({ selectedAccountName: item.name });
                  //console.warn("selected account on state", this.state.selectedAccountName);
                  this.getAccountsCharging_prepare();

                }}
                containerStyle={{ padding: 0 }}
                onRemoveItem={(item, index) => {
                  const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
                  this.setState({ selectedItems: items });
                }}
                itemStyle={{
                  padding: 10,
                  marginTop: 2,
                  backgroundColor: '#eee',
                  borderColor: '#8dc540',
                  borderWidth: 1,
                  borderRadius: 5,
                  overflow: 'scroll'
                }}
                itemTextStyle={{ color: '#ed0281' }}
                itemsContainerStyle={{ maxHeight: 500, overflow: 'scroll' }}
                items={this.state.accountsSourceList}
                // defaultIndex={2}
                resetValue={false}
                textInputProps={
                  {
                    placeholder: "Click to search",
                    underlineColorAndroid: "transparent",
                    style: {
                      padding: Platform.OS === 'ios' ? 5 : 6,
                      borderWidth: 1,
                      borderRadius: 0,
                      backgroundColor: "#fff",
                      borderColor: '#eee',       //both
                      borderWidth: 1,               //both
                      borderBottomColor: '#ed0281',       //both
                      borderBottomWidth: 1,               //both

                    },
                    // onTextChange: text => alert(text)
                  }
                }
                listProps={
                  {
                    nestedScrollEnabled: true,
                    overflow: 'scroll'
                  }
                }
              />

            </View>
          </View>


          <View>
            <Text style={styles.title}>Last 3 Days Charging{"\n"}</Text>
          </View>

          <Table style={styles.tableStyle} borderStyle={{ borderColor: 'transparent' }}>
            <TableWrapper
              style={styles.head}>
              {state.tableHead.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={cellData}
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
                    data={processCellData(cellData, cellIndex, rowData)}
                    textStyle={cellIndex === 0 ? styles.colText : styles.text}
                    style={cellStyle(cellIndex)}
                  />
                ))}
              </TableWrapper>
            ))}
          </Table>
          {/* <View>
            <Text style={styles.noteStyle}>Note: MTD Performance for last two (02) months is given in this summary. Delta and Gain Loss (G/L) comparison is drawn for last two (02) months as well</Text>
          </View> */}

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

  singleHead: {
    width: "20%",
  },

  singleHeadCol: {
    width: "16%"
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
    paddingTop: 10,
  },

  smallInputWrapper: {
    paddingTop: 5,
    width: '90%',
    flexDirection: 'column',
  },


});

const MARGIN_SMALL = 8;
const MARGIN_LARGE = 16;

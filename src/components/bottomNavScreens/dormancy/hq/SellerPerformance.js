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

export default class SellerPerformance extends Component {
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
    subTitle: "",
    modalSubTitle: "",
    widthArr: ['100%'],
    switchRM: false,
    switchKAM: false,
    switchBDO: false,
    showSpinner: false,
    modalTableHead: ['Loading data'],
    modalTableData: [['']],
    modal_revenueBigStreamBreakupVisible: false,
    productsDeltaValArray: {},
    modalheight: null
  };

  constructor(props) {
    super(props);
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


  getSellersForRD(value = 0) {
    this.setState({ selectedTLValue: value });
    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    const url =
      apiHost + '/soa/return_sellers_for_rd/' + value + '/0/0/' + this.state.switchRM + '/' + this.state.switchKAM + '/' + this.state.switchBDO + '/0/mtd/1';
    //console.warn('url: ', url);
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
    this.getTLsForRD();
    // //console.warn("DID MOUNT RM: " + this.state.switchRM + " KAM: " + this.state.switchKAM + " BDO: " + this.state.switchBDO);

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
        //console.warn('matched name: ', seller.label);
        return seller.label;
      }
    });
  }

  getSellerDormancy_prepare(value) {
    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getSellerDormancy(value, myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });
  }


  getSellerDormancy(value, myHeaders) {

    this.setState({ showSpinner: true });
    //console.warn(value);
    const apiHost = this.state.user.apiHost;

    const url = apiHost + '/soa/get_dormancy/seller' + '/' + value;
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
              //console.warn('matched name: ', seller.label);
              this.setState({ selectedSellerLabel: seller.label + "'s" });
              this.setState({ selectedSellerValue: value });
              //console.warn(
              // 'UPDATED STATE NAME: ',
              //   this.state.selectedSellerLabel,
              // );
            }
          });

          this.setState({ tableHead: responseJson.header });
          this.setState({ tableData: responseJson.indicators });

          this.setState({ subTitle: "(" + responseJson.mtd_text + ")" });
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
    // //console.warn("RM: " + this.state.switchRM + " KAM: " + this.state.switchKAM + " BDO: " + this.state.switchBDO);
    this.setState({ switchRM: !this.state.switchRM }, () => this.getSellersForRD());


    // if(this.state.switchRM === true) {
    //   this.setState({ switchKAM: false });
    //   this.setState({ switchBDO: false });
    // }


  }

  onPressKAM = () => {
    this.setState({ switchKAM: !this.state.switchKAM }, () => this.getSellersForRD());
    // //console.warn("RM: " + this.state.switchRM + " KAM: " + this.state.switchKAM + " BDO: " + this.state.switchBDO);

  }

  onPressBDO = () => {
    this.setState({ switchBDO: !this.state.switchBDO }, () => this.getSellersForRD());
    // //console.warn("RM: " + this.state.switchRM + " KAM: " + this.state.switchKAM + " BDO: " + this.state.switchBDO);

  }



  getAccountAndProductWiseDormancy_prepare(title) {

    setTimeout(() => {
      this.setState({ modalheight: null });
    }, 1000);


    this._get("jwt").then((jwt) => {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', jwt);

      this.getAccountAndProductWiseDormancy(title, myHeaders);

    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      //console.log('Promise is rejected with error: ' + error);
      this.tokenInvalidResponse("Invalid Not Found", "Token not found, please login again.");
    });

  }
  getAccountAndProductWiseDormancy(title, myHeaders) {
    //console.warn(title + " called");

    this.setState({ showSpinner: true });
    const apiHost = this.state.user.apiHost;

    // let is_positive = (this.state.productsDeltaValArray[title + "_discount_indicator"].indexOf("-") >= 0) ? 0 : 1;
    // //console.warn("IS POSITIVE", is_positive);


    const url =
      apiHost +
      '/soa/get_dormancy_account_and_product_wise_for_slab/seller/' +
      this.state.selectedSellerValue +
      '/0/0/' + title;
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

          this.setState({ modalTableHead: responseJson.header });
          this.setState({ modalTableData: responseJson.indicators });
          this.setState({ modalSubTitle: title + "\nAccounts & Product wise Dormancy " });
          //console.warn('updated state.tableData: ', this.state.modalTableData);
          this.setState({ modal_revenueBigStreamBreakupVisible: true });


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

    const cellStyle = (cellIndex) => (
      cellIndex === 0 ? styles.singleHead : (cellIndex === 4 ? styles.singleHeadLast : styles.singleHeadSixty)
    );

    const cellStyleModal = (cellIndex) => (
      cellIndex === 0 ? { width: "30%" } : { width: "22%" }
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

            modalTitle={<View style={{ textAlign: "center", paddingVertical: 10 }}><Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>{state.modalSubTitle}</Text></View>}

          >
            <ModalContent style={styles.modalContent}>


              <ImageBackground source={{ uri: this.state.user.punch }} style={{}} imageStyle={{ height: "1600%", width: "100%", resizeMode: "repeat" }}>

                <ScrollView onLayout={(ev) => { this.resizeModal(ev) }}>


                  <Table style={styles.tableStyleModal} borderStyle={{ borderColor: 'transparent' }}>
                    <TableWrapper
                      style={styles.head}>
                      {state.modalTableHead.map((cellData, cellIndex) => (
                        <Cell
                          key={cellIndex}
                          data={putIcon(cellData)}
                          textStyle={cellIndex === 0 ? styles.colHeadText : styles.headText}
                          style={cellStyleModal(cellIndex)}
                        />
                      ))}
                    </TableWrapper>
                    {state.modalTableData.map((rowData, index) => (
                      <TableWrapper
                        key={index}
                        style={styles.row}>
                        {rowData.map((cellData, cellIndex, rowData) => (
                          <Cell
                            key={cellIndex}
                            data={processCellData(cellData ? cellData : "", cellIndex, rowData)}
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


          <View style={styles.allSwitchContainerView}>
            <View style={styles.switchContainerView}>
              <SwitchToggle
                buttonText="RMs"
                backTextRight="Show"
                backTextLeft="Hide"
                buttonContainerStyle={{ color: '#ffffff' }}

                type={1}
                buttonStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  borderWidth: 0.5,
                  borderColor: "#ccc"
                }}

                rightContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                leftContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}

                buttonTextStyle={{ fontSize: 12, color: this.state.switchRM ? '#fff' : '#000', fontWeight: 'bold' }}
                textRightStyle={{ fontSize: 12, opacity: this.state.switchRM ? 0 : 1, color: this.state.switchRM ? '#fff' : '#000' }}
                textLeftStyle={{ fontSize: 12, color: this.state.switchRM ? '#fff' : '#000' }}

                containerStyle={{
                  marginTop: 0,
                  marginBottom: 10,
                  width: 105,
                  height: 50,
                  borderRadius: 50,
                  padding: 5,
                  borderWidth: 0.5,
                  borderColor: "#ddd"
                }}
                backgroundColorOn='#8dc540'
                backgroundColorOff='#f1f1f1'
                circleStyle={{
                  textStyle: { color: '#fff', fontColor: '#fff' },
                  color: "#fff",
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  backgroundColor: 'blue', // rgb(102,134,205)
                }}
                switchOn={this.state.switchRM}
                onPress={this.onPressRM}
                circleColorOff='#e5e1e0'
                circleColorOn='#ed0281'
                duration={500}
              />
            </View>
            <View style={styles.switchContainerView}>
              <SwitchToggle
                buttonText="KAMs"
                backTextRight="Show"
                backTextLeft="Hide"
                buttonContainerStyle={{ color: '#ffffff' }}

                type={1}
                buttonStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  borderWidth: 0.5,
                  borderColor: "#ccc"
                }}

                rightContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                leftContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}

                buttonTextStyle={{ fontSize: 12, color: this.state.switchKAM ? '#fff' : '#000', fontWeight: 'bold' }}
                textRightStyle={{ fontSize: 12, opacity: this.state.switchKAM ? 0 : 1, color: this.state.switchKAM ? '#fff' : '#000' }}
                textLeftStyle={{ fontSize: 12, color: this.state.switchKAM ? '#fff' : '#000' }}

                containerStyle={{
                  marginTop: 0,
                  marginBottom: 10,
                  width: 105,
                  height: 50,
                  borderRadius: 50,
                  padding: 5,
                  borderWidth: 0.5,
                  borderColor: "#ddd"
                }}
                backgroundColorOn='#8dc540'
                backgroundColorOff='#f1f1f1'
                circleStyle={{
                  textStyle: { color: '#fff', fontColor: '#fff' },
                  color: "#fff",
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  backgroundColor: 'blue', // rgb(102,134,205)
                }}
                switchOn={this.state.switchKAM}
                onPress={this.onPressKAM}
                circleColorOff='#e5e1e0'
                circleColorOn='#ed0281'
                duration={500}
              />
            </View>
            <View style={styles.switchContainerView}>
              <SwitchToggle
                buttonText="BDOs"
                backTextRight="Show"
                backTextLeft="Hide"
                buttonContainerStyle={{ color: '#ffffff' }}

                type={1}
                buttonStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  borderWidth: 0.5,
                  borderColor: "#ccc"
                }}

                rightContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                leftContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}

                buttonTextStyle={{ fontSize: 12, color: this.state.switchBDO ? '#fff' : '#000', fontWeight: 'bold' }}
                textRightStyle={{ fontSize: 12, opacity: this.state.switchBDO ? 0 : 1, color: this.state.switchBDO ? '#fff' : '#000' }}
                textLeftStyle={{ fontSize: 12, color: this.state.switchBDO ? '#fff' : '#000' }}

                containerStyle={{
                  marginTop: 0,
                  marginBottom: 10,
                  width: 105,
                  height: 50,
                  borderRadius: 50,
                  padding: 5,
                  borderWidth: 0.5,
                  borderColor: "#ddd"
                }}
                backgroundColorOn='#8dc540'
                backgroundColorOff='#f1f1f1'
                circleStyle={{
                  textStyle: { color: '#fff', fontColor: '#fff' },
                  color: "#fff",
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  backgroundColor: 'blue', // rgb(102,134,205)
                }}
                switchOn={this.state.switchBDO}
                onPress={this.onPressBDO}
                circleColorOff='#e5e1e0'
                circleColorOn='#ed0281'
                duration={500}
              />
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
            <View style={styles.rowSelectInput}>
              <View style={styles.smallInputWrapper}>
                <Text style={styles.label}>Select TL</Text>

                <SelectInput
                  value={this.state.selectedTLValue}
                  options={this.state.tls}
                  onCancelEditing={() => { }}
                  onSubmitEditing={this.getSellersForRD.bind(this)}
                  submitKeyText="Done"
                  cancelKeyText="Close"
                  style={[styles.selectInput, styles.selectInputSmall]}
                />
              </View>

              <View style={styles.smallInputWrapper}>
                <Text style={styles.label}>Select Seller</Text>

                <SelectInput
                  value={this.state.selectedSellerValue}
                  options={this.state.sellers}
                  onCancelEditing={() => { }}
                  onSubmitEditing={this.getSellerDormancy_prepare.bind(this)}
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
                  this.getSellerDormancy(itemValue);
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
    width: '45%',
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
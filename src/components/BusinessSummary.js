import React, { Component } from 'react';
import {StyleSheet,View, SafeAreaView, ScrollView} from "react-native" ;
import NumberFormat from 'react-number-format';
import SearchableDropdown from 'react-native-searchable-dropdown';

import {
  Text,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator
} from 'react-native';

import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';

import Icon from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import Modal, {
  ModalTitle,
  SlideAnimation,
  ModalContent,
} from 'react-native-modals';
import { FlatList } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import axios from 'axios';
import { color, log } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';

class BusinessSummary extends Component {

  _get = async (key) => {

    try {

      let result = await SecureStore.getItemAsync(key);

      console.log("GET ITEM: ", result);

      return result;
    } catch (error) {
      console.log(error.message);
    }
    return

  };

  getSummaryData = async () => {
    let jwt = await this._get("jwt");
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeaders.append('Authorization', jwt);

    return fetch('https://gcssbi.zong.com.pk/index.php/businesss/getBusinessSummary', {
      method: 'GET',
      headers: myHeaders
    }).then(response => response.text())
      .then((text) => {
        text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
        return text;
      })
      .then(res => {
        let myData = JSON.parse(res);
        this.setState({ summaryData: myData, nwd: myData['nwd'], isLoading: false });
      })
      .catch(err => { });
  };

  getSummaryDataByRegion = async (region) => {
    let jwt = await this._get("jwt");
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeaders.append('Authorization', jwt);
    return fetch('https://gcssbi.zong.com.pk/index.php/businesss/getBusinessSummaryByRegion/' + region, {
      method: 'GET',
      headers: myHeaders
    }).then(response => response.text())
      .then((text) => {
        text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
        return text;
      })
      .then(res => {
        let myData = JSON.parse(res);
        this.setState({ summaryData: myData, isLoading: false });
        // if (region === 'NWD') {
        //   this.setState({ nwd: res.data, isLoading: false });
        // } else if (region === 'central') {
        //   this.setState({ cd: res.data, isLoading: false });
        // } else if (region === 'north') {
        //   this.setState({ nd: res.data, isLoading: false });
        // } else if (region === 'south') {
        //   this.setState({ sd: res.data, isLoading: false });
        // }
      })
      .catch(err => { });
  }

  getRegionsData = () => {
    let data = [
      {
        value: 'Nation Wide Summary',
      },
      {
        value: 'Central Region Wise Summary',
      },
      {
        value: 'North Region Wise Summary',
      },
      {
        value: 'South Region Wise Summary',
      }
    ];
    this.setState({ regionData: data, isRegionLoading: false });
  };

  numFormatter(num) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    } else if (num < 900) {
      return num; // if value < 1000, nothing to do
    }
  }


  componentDidMount() {
    // this.getSummaryData();
    this.getRegionsData();
    this.getSummaryDataByRegion('NWD');
  }

  constructor(props) {
    super(props);

    this.state = {
      user: this.props.navigation.getParam('user', null),
      summaryData: [],
      regionData: [],
      selectedRegion: 'Nation Wide Summary',
      nwd: [],
      nd: [],
      sd: [],
      cd: [],
      visible: false,
      isRegionLoading: true,
      isLoading: true,
    };

  }

  render() {
    const cellStyle = () => (
      { width: "27%" }
    );
    return (
      <SafeAreaView>
        <ImageBackground
          source={{ uri: this.state.user.punch }}
          style={{ width: '100%', height: '100%' }}
          imageStyle={{ height: '200%', width: '100%', resizeMode: 'repeat' }}>
          <View
            style={{ flexDirection: 'column', width: '100%', height: '100%' }}>

            <View style={{ flexDirection: 'column', width: '100%', height: '100%' }}>

              <Header companyName={"Business Summary"} />
              <View style={styles.pickerWrapper}>
                {this.state.isRegionLoading ? (
                  <ActivityIndicator />
                ) : (
                  <Dropdown
                    data={this.state.regionData}
                    onChangeText={value => {
                      this.setState({ selectedRegion: value }, () => {
                        //console.log(this.state.selectedRegion);
                        if (this.state.selectedRegion === 'Nation Wide Summary') {
                          this.setState({ nwd: null });
                          this.getSummaryDataByRegion('NWD');
                          // this.setState({ nwd: this.state.summaryData['nwd'] });
                          // //console.log('this is region wise data ', this.state.summaryData['nwd'][0]['Accounts']);
                        } else if (this.state.selectedRegion === 'Central Region Wise Summary') {
                          this.setState({ cd: null });
                          this.getSummaryDataByRegion('central');
                          // this.setState({ cd: this.state.summaryData['central'] });
                          // //console.log('this is region wise data ', this.state.summaryData['central']);
                        } else if (this.state.selectedRegion === 'North Region Wise Summary') {
                          this.setState({ nd: null });
                          this.getSummaryDataByRegion('north');
                          // this.setState({ nd: this.state.summaryData['north'] });
                          // //console.log('this is region wise data ', this.state.summaryData['north']);
                        } else if (this.state.selectedRegion === 'South Region Wise Summary') {
                          this.setState({ sd: null });
                          this.getSummaryDataByRegion('south');
                          // this.setState({ sd: this.state.summaryData['south'] });
                          // //console.log('this is region wise data ', this.state.summaryData['south']);
                        }
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
                    itemsContainerStyle={{ maxHeight: 100, overflow: 'scroll' }}
                    // defaultIndex={2}
                    //resetValue={false}
                    placeholder="Select Region"

                    textInputProps={
                      {
                        placeholder: this.state.selectedRegion,
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
                    value={this.state.selectedRegion}

                  />
                )}
              </View>

              {this.state.isLoading ?
                <View
                  style={{
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator
                    size={64}
                    animating={this.state.isLoading}
                    color={'#8dc540'}
                  />
                  <Text style={{
                    color: '#8dc540',
                    fontSize: 22
                  }}>Retrieving Business Summary</Text>
                </View>
                :

                <ScrollView keyboardShouldPersistTaps='always'>

                  <View>
                    <Table style={styles.tableStyle} borderStyle={{ borderColor: 'transparent' }}>
                      <TableWrapper
                        style={styles.head}>
                        <Cell
                          data={"Month"}
                          textStyle={styles.headTextFirst}
                          style={cellStyle()}
                        />
                        <Cell
                          data={"Revenue"}
                          textStyle={styles.headText}
                          style={cellStyle()}
                        />
                        <Cell
                          data={"Accounts"}
                          textStyle={styles.headText}
                          style={cellStyle()}
                        />
                        <Cell
                          data={"Base"}
                          textStyle={styles.headText}
                          style={cellStyle()}
                        />
                      </TableWrapper>
                      {
                        this.state.summaryData['data_first'].map((rowData, index) => (
                          <TableWrapper
                            key={index}
                            style={styles.row}>
                            <Cell
                              data={rowData['mmmyy']}
                              textStyle={styles.colText}
                              style={cellStyle()}
                            />
                            <Cell
                              data={this.numFormatter(rowData['revenue'])}
                              textStyle={styles.text}
                              style={cellStyle()}
                            />
                            <Cell
                              data={this.numFormatter(rowData['accounts'])}
                              textStyle={styles.text}
                              style={cellStyle()}
                            />
                            <Cell
                              data={this.numFormatter(rowData['base'])}
                              textStyle={styles.text}
                              style={cellStyle()}
                            />
                            {/* {rowData.map((cellData, cellIndex) => (
                        <Cell
                          key={cellIndex}
                          data={cellData}
                          textStyle={cellIndex === 0 ? styles.colText : styles.text}
                          style={cellStyle()}
                        />
                      ))} */}
                          </TableWrapper>
                        ))}
                    </Table>


                    <Table style={styles.tableStyle} borderStyle={{ borderColor: 'transparent' }}>
                      <TableWrapper
                        style={styles.head}>
                        <Cell
                          data={"Month"}
                          textStyle={styles.headTextFirst}
                        // style={cellStyle()}
                        />
                        <Cell
                          data={"Churn"}
                          textStyle={styles.headText}
                        // style={cellStyle()}
                        />
                        <Cell
                          data={"Gross Adds"}
                          textStyle={styles.headText}
                        // style={cellStyle()}
                        />
                        <Cell
                          data={"Reconnection"}
                          textStyle={styles.headText}
                        // style={cellStyle()}
                        />
                        <Cell
                          data={"1Line/Fixed"}
                          textStyle={styles.headText}
                        // style={cellStyle()}
                        />
                      </TableWrapper>
                      {this.state.summaryData['data_second'].map((rowData, index) => (
                        <TableWrapper
                          key={index}
                          style={styles.row}>
                          <Cell
                            data={rowData['mmmyy']}
                            textStyle={styles.colText}
                          // style={cellStyle()}
                          />
                          <Cell
                            data={this.numFormatter(rowData['churn'])}
                            textStyle={styles.text}
                          // style={cellStyle()}
                          />
                          <Cell
                            data={this.numFormatter(rowData['gross_adds'])}
                            textStyle={styles.text}
                          // style={cellStyle()}
                          />
                          <Cell
                            data={this.numFormatter(rowData['reconnection'])}
                            textStyle={styles.text}
                          // style={cellStyle()}
                          />
                          <Cell
                            data={this.numFormatter(rowData['one_line_fixed'])}
                            textStyle={styles.text}
                          // style={cellStyle()}
                          />
                          {/* {rowData.map((cellData, cellIndex) => (
                        <Cell
                          key={cellIndex}
                          data={cellData}
                          textStyle={cellIndex === 0 ? styles.colText : styles.text}
                          style={cellStyle()}
                        />
                      ))} */}
                        </TableWrapper>
                      ))}
                    </Table>


                    <Table style={styles.tableStyle} borderStyle={{ borderColor: 'transparent' }}>
                      <TableWrapper
                        style={styles.head}>
                        <Cell
                          data={"Month"}
                          textStyle={styles.headTextFirst}
                        // style={cellStyle()}
                        />
                        <Cell
                          data={"3I"}
                          textStyle={styles.headText}
                        // style={cellStyle()}
                        />
                        <Cell
                          data={"IAAS"}
                          textStyle={styles.headText}
                        // style={cellStyle()}
                        />
                        <Cell
                          data={"GSM+MMB"}
                          textStyle={styles.headText}
                        // style={cellStyle()}
                        />
                      </TableWrapper>
                      {this.state.summaryData['data_third'].map((rowData, index) => (
                        <TableWrapper
                          key={index}
                          style={styles.row}>
                          <Cell
                            data={rowData['mmmyy']}
                            textStyle={styles.colText}
                          // style={cellStyle()}
                          />
                          <Cell
                            data={this.numFormatter(rowData['three_i'])}
                            textStyle={styles.text}
                          // style={cellStyle()}
                          />
                          <Cell
                            data={this.numFormatter(rowData['iaas'])}
                            textStyle={styles.text}
                          // style={cellStyle()}
                          />
                          <Cell
                            data={this.numFormatter(rowData['gsm_mmb_business'])}
                            textStyle={styles.text}
                          // style={cellStyle()}
                          />
                          {/* {rowData.map((cellData, cellIndex) => (
                        <Cell
                          key={cellIndex}
                          data={cellData}
                          textStyle={cellIndex === 0 ? styles.colText : styles.text}
                          style={cellStyle()}
                        />
                      ))} */}
                        </TableWrapper>
                      ))}
                    </Table>
                  </View>

                </ScrollView>
              }
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}


export const Header = ({ companyName }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Business Summary</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flex: 1,
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
    borderColor: 'grey',
    borderWidth: 1,
    justifyContent: 'center',
    margin: 8,
    padding: 8,
  },

  pickerWrapper: {
    borderRadius: 8,
    borderColor: 'grey',
    borderWidth: 1,
    height: 50,
    justifyContent: 'flex-end',
    marginTop: 50,
    marginHorizontal: 12,
    marginBottom: 15,
    paddingTop: 7,
    paddingRight: 12,
    paddingLeft: 12,
  },

  headerTitle: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
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
    width: "31%",
    // width: Platform.OS == 'android' ? 100 : 107,
    //textAlign: 'center' 
  },

  singleHeadSixty: {
    width: "19.5%"
    // width: Platform.OS == 'android' ? (Dimensions.get('window').width > 360 ? 70 : 61) : 60
  },

  singleHeadLast: {
    width: "12%"
    // width: Platform.OS == 'android' ? (Dimensions.get('window').width > 360 ? 70 : 61) : 60
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
    height: 45,
    backgroundColor: '#8dc540',
    color: 'white',
    width: "100%"
  },

  text: {
    //margin: 6,
    // textAlign: 'center',

    fontSize: 14
  },

  colText: {
    // textAlign: 'center',
    paddingVertical: 10,
    marginLeft: 17,
    fontSize: 14,
    color: '#ed0281',
    fontWeight: 'bold',
  },

  headText: {
    //textAlign: 'center',
    paddingVertical: 10,
    fontSize: 14,
    marginRight: 15,
    color: 'white',
    fontWeight: 'bold',
    // textAlign: "center"
  },

  headTextFirst: {
    //textAlign: 'center',
    paddingVertical: 10,
    fontSize: 14,
    marginLeft: 15,
    color: 'white',
    fontWeight: 'bold',
    // textAlign: "center"
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

  modalContent: {
    paddingHorizontal: 2,
  }

});

export default BusinessSummary;

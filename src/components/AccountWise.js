import React, { Component } from 'react';
import {StyleSheet,View} from "react-native" ;
import NumberFormat from 'react-number-format';
import SearchableDropdown from 'react-native-searchable-dropdown';
import * as SecureStore from 'expo-secure-store';

// "irfan", "shayan.safdar", "jibran.afzaal", "salman.yaseen", "shakeel.rehman", "nabiha.iqbal", "farrukh.hassan", "harris.saeed", "hamza.muhammad", "farhan.zakir", "sameer.mughal", "salman.ahmad", "wei.chenggang", "ahmer.hussain", "rizwan.khalil", "saad.anwar", "muzzamil.habib", "osman.sheikh", "tahir.afridi", "jawad.khan.khattak"


import {
  SafeAreaView,
  ScrollView,
  //StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';

import { FlatList } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import axios from 'axios';

class AccountWise extends Component {

  _get = async (key) => {

    try {

      let result = await SecureStore.getItemAsync(key);

      ////console.log("GET ITEM: ", result);

      return result;
    } catch (error) {
      ////console.log(error.message);
    }
    return

  };

  getCompanyData = async () => {

    let jwt = await this._get("jwt");
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeaders.append('Authorization', jwt);


    return fetch('https://gcssbi.zong.com.pk/index.php/summariess/getCompanyNames', {
      method: 'GET',
      headers: myHeaders
    }).then(response => response.text())
      .then((text) => {
        text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
        return text;
      })
      .then(myData => {

        let res = JSON.parse(myData);

        const arrayToClean = res['data'];
        const cleanedArray = [];
        arrayToClean.forEach((val, index) => {
          if (val.value !== null) {
            let obj = {
              id: val.id,
              name: val.value
            }
            cleanedArray.push(obj);
          }
        });
        //console.log(cleanedArray);
        this.setState({ companyData: cleanedArray, isLoading: false });
      })
      .catch(err => { console.log(err) });
  };

  getRegionsData = () => {
    let data = [
      {
        value: 'Central',
      },
      {
        value: 'North',
      },
      {
        value: 'South',
      },
    ];
    this.setState({ regionData: data, isRegionLoading: false });
    // axios.get('http://192.168.100.4:800/bi_dashboard/index.php/summariess/getRegionNames')
    //   .then(res => {
    //     //console.log("Region Data : ", JSON.stringify('Region Data : ', res.data.data));

    //   })
    //   .catch(err => //console.log("Error : ", err));
  };

  getProductsData = async () => {

    let jwt = await this._get("jwt");
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeaders.append('Authorization', jwt);

    return fetch('https://gcssbi.zong.com.pk/index.php/summariess/getProductNames', {
      method: 'GET',
      headers: myHeaders
    }).then(response => response.text())
      .then((text) => {
        text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
        return text;
      })
      .then(myData => {

        let res = JSON.parse(myData);

        const arrayToClean = res.data;
        const cleanedArray = [];
        arrayToClean.forEach((val) => {
          if (val.value !== null) {
            cleanedArray.push(val);
          }
        });
        this.setState({ productData: cleanedArray, isProductLoading: false });
      })
      .catch(err => { });
  };

  getAllData = async () => {

    let jwt = await this._get("jwt");
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeaders.append('Authorization', jwt);

    if (this.state.selectedRegion === 'Select Region' && this.state.selectedProduct === 'Select Product') {

      return fetch('https://gcssbi.zong.com.pk/index.php/summariess/getTabularDataCompany?company_ntn=' + this.state.ntnId, {
        method: 'GET',
        headers: myHeaders
      }).then(response => response.text())
        .then((text) => {
          text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          console.warn(text);
          return text;
        })
        .then(myData => {

          let res = JSON.parse(myData);


          this.setState({ allData: res['data'][0], contractData: res['contract'], isAllDataLoading: false });
        })
        .catch(err => { });
    } else if (this.state.selectedRegion !== 'Select Region' && this.state.selectedProduct === 'Select Product') {
      return fetch('https://gcssbi.zong.com.pk/index.php/summariess/getTabularDataRegions?company_ntn=' + this.state.ntnId + '&region=' + this.state.selectedRegion, {
        method: 'GET',
        headers: myHeaders
      }).then(response => response.text())
        .then((text) => {
          text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          console.warn(text);
          return text;
        })
        .then(myData => {


          let res = JSON.parse(myData);
        
          this.setState({ allData: res['data'][0], isAllDataLoading: false });

        })
        .catch(err => { });
    } else if (this.state.selectedRegion === 'Select Region' && this.state.selectedProduct !== 'Select Product') {
      return fetch('https://gcssbi.zong.com.pk/index.php/summariess/getTabularDataProduct?company_ntn=' + this.state.ntnId + '&product=' + this.state.selectedProduct, {
        method: 'GET',
        headers: myHeaders
      }).then(response => response.text())
        .then((text) => {
          text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          return text;
        })
        .then(myData => {

          let res = JSON.parse(myData);

          this.setState({ allData: res['data'][0], isAllDataLoading: false });
        })
        .catch(err => { });
    } else {
      return fetch('https://gcssbi.zong.com.pk/index.php/summariess/getTabularDataAll?company_ntn=' + this.state.ntnId + '&region=' + this.state.selectedRegion + '&product=' + this.state.selectedProduct, {
        method: 'GET',
        headers: myHeaders
      }).then(response => response.text())
        .then((text) => {
          text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          return text;
        })
        .then(myData => {

          let res = JSON.parse(myData);

          this.setState({ allData: res['data'][0], isAllDataLoading: false });
        })
        .catch(err => { });
    }
  };

  componentDidMount() {
    this.getCompanyData();
    this.getRegionsData();
    this.getProductsData();
  }

  constructor(props) {
    super(props);
    var myData = [
      'Revenue',
      'Subscriber Base',
      'Payments',
      'Discounts',
      'Sales',
      'Churn',
      'Payable',
      'Total On Net Mins',
      'Total Off Net Mins',
      'Total Outgoing Mins',
      'Discounted Mins (On)',
      'Discounted Mins (Off)',
      'Total Discounted Mins',
      'Charged Mins (On)',
      'Charged Mins (Off)',
      'Total Charged Mins',
      'Free Data Vol (MB)',
      'Charged Data Vol (MB)',
      'Total Data Vol (MB)',
      'Account Handler',
      'Outstanding (Bad Debt)',
    ];

    var myData2 = [
      'net_revenue',
      'dsp_active',
      'payment',
      'bd+lrd',
      'sales',
      'churn',
      'payable',
      'OnNet_OG',
      'offnet_OG',
      'offnet_OG OnNet_OG',
      'Free_OG_OnNet_mins',
      'Free_OG_OffNet_mins',
      'Free_OG_OnNet_mins Free_OG_offnet_mins',
      'Charged_OG_OnNet_mins',
      'Charged_OG_offnet_mins',
      'Charged_OG_OnNet_mins Charged_OG_offnet_mins',
      'Data_volume_charged',
      'Data_volume_free',
      'Data_volume',
      'Account Handler',
      'Outstanding (Bad Debt)',
    ];

    this.state = {
      user: this.props.navigation.getParam('user', null),
      ntnId: '0',
      selectedCompany: 'Select Company',
      selectedRegion: 'Select Region',
      selectedProduct: 'Select Product',
      companyData: [],
      regionData: [],
      productData: [],
      visible: false,
      isLoading: true,
      isRegionLoading: true,
      isProductLoading: true,
      isAllDataLoading: true,
      allData: [],
      contractData: [],
      keyData: myData,
      keyData2: myData2
    };

  }



  render() {
    if (this.state.isLoading) {
      return (
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
          }}>Data Loading</Text>
        </View>
      );
    } else {
      return (
        <SafeAreaView>
          <ImageBackground
            source={{ uri: this.state.user.punch }}
            style={{ width: '100%', height: '100%' }}
            imageStyle={{ height: '200%', width: '100%', resizeMode: 'repeat' }}>
            <ScrollView
              keyboardShouldPersistTaps='always'
            >
              <Header companyName={this.state.selectedCompany} />
              <View>

                <View style={styles.pickerWrapperSearch}>
                  <SearchableDropdown

                    items={this.state.companyData}

                    onItemSelect={item => {
                      //console.log('hello', item);
                      this.setState({ selectedCompany: item.name, ntnId: item.id, selectedProduct: 'Select Product', selectedRegion: 'Select Region' }, () => {
                        this.getAllData();
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
                    itemsContainerStyle={{ maxHeight: 500, overflow: 'scroll' }}
                    // defaultIndex={2}
                    //resetValue={false}
                    textInputProps={
                      {
                        placeholder: this.state.selectedCompany,
                        underlineColorAndroid: "transparent",
                        style: {
                          padding: 2,
                          fontSize: 16,
                        },
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


                {/* <View style={styles.pickerWrapper}>
                  <Dropdown
                    data={this.state.companyData}
                    onChangeText={text => {
                      this.setState({ selectedCompany: text });
                      this.getAllData();
                    }}
                    value={this.state.selectedCompany}
                  />
                </View> */}

                {this.state.selectedCompany !== 'Select Company' ? (
                  <View style={styles.pickerWrapper}>
                    {this.state.isRegionLoading ? (
                      <ActivityIndicator />
                    ) : (
                      <Dropdown
                        data={this.state.regionData}
                        onChangeText={value => {
                          this.setState({ selectedRegion: value, selectedProduct: 'Select Product' }, () => {
                            this.getAllData();
                          });

                          // this.getProductsData();
                        }}
                        value={this.state.selectedRegion}
                      />
                    )}
                  </View>
                ) : null}

                {this.state.selectedCompany !== 'Select Company' ? (
                  <View style={styles.pickerWrapper}>
                    {this.state.isProductLoading ? (
                      <ActivityIndicator />
                    ) : (
                      <Dropdown
                        data={this.state.productData}
                        onChangeText={value => {
                          this.setState({ selectedProduct: value }, () => {
                            this.getAllData();
                          });

                        }}
                        value={this.state.selectedProduct}
                      />
                    )}
                  </View>
                ) : null}

                {/* horizontal picker */}

                {/* <View style={styles.pickerWrapper}>
        <RNPickerSelect
            onValueChange={(value) => //console.log(value)}
            items={productsData}
            value={this.state.selectedProduct}
            style={pickerStyle}
        />
        </View>

        <View style={styles.pickerWrapper}>
        <RNPickerSelect
            onValueChange={(value) => //console.log(value)}
            items={productsData}
            value={this.state.selectedProduct}
            style={pickerStyle}
        />
        </View> */}

                {/* body */}

                <View style={styles.stripStyle}>
                  <Text style={styles.dataHeaderText}>Indicator</Text>
                  <Text style={styles.dataHeaderText}>Value</Text>
                  {/* <Text style={styles.dataHeaderText}>Product</Text> */}
                </View>

                {Object.entries(this.state.allData).map(
                  ([key, value], index) => {
                    return (
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            if (index !== 19 && index !== 20) {
                              if (this.state.productData == 'Select Product' && this.state.selectedRegion == 'Select Region') {
                                this.props.navigation.navigate(
                                  'AccountWiseDetails',
                                  {
                                    ntnId: this.state.ntnId,
                                    companyName: this.state.selectedCompany,
                                    productsList: this.state.productData,
                                    regionsList: this.state.regionData,
                                    selectedValue: this.state.keyData[index],
                                    selectedValue2: this.state.keyData2[index],
                                    user: this.props.navigation.getParam(
                                      'user',
                                      null,
                                    ),
                                    selectedRegion: 'Select Region',
                                    selectedProduct: 'Select Product',
                                  },
                                );

                              }
                              else if (this.state.productData !== 'Select Product' && this.state.selectedRegion == 'Select Region') {
                                this.props.navigation.navigate(
                                  'AccountWiseDetails',
                                  {
                                    ntnId: this.state.ntnId,
                                    companyName: this.state.selectedCompany,
                                    productsList: this.state.productData,
                                    regionsList: this.state.regionData,
                                    selectedValue: this.state.keyData[index],
                                    selectedValue2: this.state.keyData2[index],
                                    user: this.props.navigation.getParam(
                                      'user',
                                      null,
                                    ),
                                    selectedRegion: 'Select Region',
                                    selectedProduct: this.state.selectedProduct,
                                  },
                                );
                              }
                              else if (this.state.productData == 'Select Product' && this.state.selectedRegion !== 'Select Region') {
                                this.props.navigation.navigate(
                                  'AccountWiseDetails',
                                  {
                                    ntnId: this.state.ntnId,
                                    companyName: this.state.selectedCompany,
                                    productsList: this.state.productData,
                                    regionsList: this.state.regionData,
                                    selectedValue: this.state.keyData[index],
                                    selectedValue2: this.state.keyData2[index],
                                    user: this.props.navigation.getParam(
                                      'user',
                                      null,
                                    ),
                                    selectedRegion: this.state.selectedRegion,
                                    selectedProduct: 'Select Product',
                                  },
                                );
                              }
                              else {
                                this.props.navigation.navigate(
                                  'AccountWiseDetails',
                                  {
                                    ntnId: this.state.ntnId,
                                    companyName: this.state.selectedCompany,
                                    productsList: this.state.productData,
                                    regionsList: this.state.regionData,
                                    selectedValue: this.state.keyData[index],
                                    selectedValue2: this.state.keyData2[index],
                                    user: this.props.navigation.getParam(
                                      'user',
                                      null,
                                    ),
                                    selectedRegion: this.state.selectedRegion,
                                    selectedProduct: this.state.selectedProduct,
                                  },
                                );
                              }
                            }
                          }}
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            paddingHorizontal: 4,
                            paddingVertical: 5,
                            marginHorizontal: 10,
                            backgroundColor: '#FFF1C14a'
                          }}
                          key={key}>

                          <Text
                            style={[
                              styles.dataHeaderText,
                              { color: '#ed0281', fontWeight: 'bold' },
                            ]}>
                            {this.state.keyData[index]}
                          </Text>
                          {index == 19 ? <Text style={[
                            styles.dataHeaderText,
                            { color: '#444444', fontWeight: 'normal' },
                          ]}>{value}</Text> : <NumberFormat
                            style={[
                              styles.dataHeaderText,
                              { color: '#444444', fontWeight: 'normal' },
                            ]}
                            value={
                              value == null ? '0' : index === 16 || index === 17 || index === 18 ?
                                Math.round(value / 1024).toString()
                                :
                                parseInt(value).toString()
                            }
                            className="foo"
                            displayType={'text'}
                            thousandSeparator={true}
                            renderText={(value, props) => <Text {...props}>{value === null ? '0' : value}</Text>}
                          />}

                          {/* <Text
                            style={[
                              styles.dataHeaderText,
                              { color: '#444444', fontWeight: 'normal' },
                            ]}>
                            {parseInt(value)}
                          </Text> */}
                          {/* <Text style={[styles.dataHeaderText, { color: '#444444', fontWeight: 'normal' }]}>{item.product}</Text> */}
                        </TouchableOpacity>

                        {index === 6 || index === 18 ? (
                          <View style={styles.stripStyle}>
                            <Text style={styles.dataHeaderText}>
                              {index <= 6 ? 'Usage' : 'Account Information'}
                            </Text>
                            <Text style={styles.dataHeaderText}>Value</Text>
                            {/* <Text style={styles.dataHeaderText}>Product</Text> */}
                          </View>
                        ) : null}
                      </View>
                    );
                  },
                )}

                {this.state.selectedCompany === 'Select Company' ? null : <View style={styles.stripStyle}>
                  <Text style={styles.dataHeaderText}>Contract Type</Text>
                  <Text style={styles.dataHeaderText}>Status</Text>
                  {/* <Text style={styles.dataHeaderText}>Product</Text> */}
                </View>}
                {
                  this.state.contractData === null ? null : Object.entries(this.state.contractData).map(
                    ([key, value], index) => {
                      return (
                        <View style={{
                          flexDirection: 'row',
                          flex: 1,
                          paddingHorizontal: 4,
                          paddingVertical: 5,
                          marginHorizontal: 10,
                          backgroundColor: '#FFF1C14a'
                        }}>
                          <Text
                            style={[
                              styles.dataHeaderText,
                              { color: '#ed0281', fontWeight: 'bold' },
                            ]}>
                            {value.contract_type}
                          </Text>
                          <Text
                            style={[
                              styles.dataHeaderText,
                              { color: '#444444', fontWeight: 'normal' },
                            ]}>
                            {value.status}
                          </Text>
                        </View>
                      );
                    })
                }
              </View>
            </ScrollView>
          </ImageBackground>
        </SafeAreaView>
      );
    }
  }
}

export const ModalContents = props => {
  return (
    <ImageBackground
      source={{ uri: '' }}
      style={{ width: '100%', height: '100%' }}
      imageStyle={{ height: '200%', width: '100%', resizeMode: 'repeat' }}>
      <View style={{ height: 300 }}>
        <ScrollView>
          <FlatList
            data={props.data}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  paddingHorizontal: 4,
                }}
                key={index}>
                <Text style={[styles.dataHeaderText, { color: 'deeppink' }]}>
                  Name
                </Text>
                <Text
                  style={[
                    styles.dataHeaderText,
                    { color: '#444444', fontWeight: 'normal' },
                  ]}>
                  adfadf
                </Text>
                <Text
                  style={[
                    styles.dataHeaderText,
                    { color: '#444444', fontWeight: 'normal' },
                  ]}>
                  adsfads
                </Text>
              </View>
            )}
          />
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export const Header = ({ companyName }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Account Wise Summary</Text>
      <Text style={styles.subTitleStyle}>{companyName === 'Select Company' ? '' : companyName}</Text>
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
    justifyContent: 'center',
    margin: 8,
    padding: 8,

  },

  headerTitle: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#ed0281',
  },

  subTitleStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 14,
    color: '#ed0281',
  },

});

export default AccountWise;

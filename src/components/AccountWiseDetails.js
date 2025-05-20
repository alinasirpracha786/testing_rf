import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import {StyleSheet,View} from "react-native" ;
import {
  SafeAreaView,
  ScrollView,
 // StyleSheet,
  Text,
  ImageBackground,
  Alert,
  TouchableHighlight,
  //View,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import Modal, { ModalTitle, SlideAnimation, ModalContent } from 'react-native-modals';
import { FlatList } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import axios from 'axios';
import { color, log } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';


export default class AccountWiseDetails extends Component {

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

  getAllData = async () => {

    let jwt = await this._get("jwt");
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeaders.append('Authorization', jwt);

    if (this.state.selectedRegion === 'Select Region' && this.state.selectedProduct === 'Select Product') {
      // const params = new URLSearchParams();
      // params.append('company_ntn', this.state.selectedCompany);
      // params.append('selected_value', this.state.selectedValue2);

      return fetch('https://gcssbi.zong.com.pk/index.php/summariess/getTabularDataCompanyDetails?company_ntn=' + this.state.ntnId + '&selected_value=' + this.state.selectedValue2, {
        method: 'GET',
        headers: myHeaders
      }).then(response => response.text())
        .then((text) => {
          text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          return text;
        })

        .then(myData => {

          let res = JSON.parse(myData);

          if (res['data'] === null) {
            this.setState({ allData: null, isAllDataLoading: false })
            Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
              {
                text: 'Ok',
              },
            ]);
          }
          else { this.setState({ allData: res['data'], isAllDataLoading: false }) }

        }).catch(err => { })
    } else if (this.state.selectedRegion !== 'Select Region' && this.state.selectedProduct === 'Select Product') {

      return fetch('https://gcssbi.zong.com.pk/index.php/summariess/getTabularDataRegionsDetails?company_ntn=' + this.state.ntnId + '&region=' + this.state.selectedRegion + '&selected_value=' + this.state.selectedValue2, {
        method: 'GET',
        headers: myHeaders
      }).then(response => response.text())
        .then((text) => {
          text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          return text;
        })
        .then(myData => {
          let res = JSON.parse(myData);

          if (res['data'] === null) {
            Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
              {
                text: 'Ok',
              },
            ]);
            this.setState({ allData: null, isAllDataLoading: false })
          }
          else { this.setState({ allData: res['data'], isAllDataLoading: false }) }

        }).catch(err => { })
    }
    else if (this.state.selectedRegion === 'Select Region' && this.state.selectedProduct !== 'Select Product') {

      return fetch('https://gcssbi.zong.com.pk/index.php/summariess/getTabularDataProductDetails?company_ntn=' + this.state.ntnId + '&product=' + this.state.selectedProduct + '&selected_value=' + this.state.selectedValue2, {
        method: 'GET',
        headers: myHeaders
      }).then(response => response.text())
        .then((text) => {
          text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          return text;
        })
        .then(myData => {
          let res = JSON.parse(myData);

          if (res['data'] === null) {
            Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
              {
                text: 'Ok',
              },
            ]);
            this.setState({ allData: null, isAllDataLoading: false })
          }
          else { this.setState({ allData: res['data'], isAllDataLoading: false }) }

        }).catch(err => { })
    } else {
      return fetch('https://gcssbi.zong.com.pk/index.php/summariess/getTabularDataDetails?company_ntn=' + this.state.ntnId + '&region=' + this.state.selectedRegion + '&product=' + this.state.selectedProduct + '&selected_value=' + this.state.selectedValue2, {
        method: 'GET',
        headers: myHeaders
      }).then(response => response.text())
        .then((text) => {
          text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          return text;
        })
        .then(myData => {
          let res = JSON.parse(myData);

          if (res['data'] === null) {
            Alert.alert('Data Not Found', 'No data found for this selection criteria. Please contact GCSS BI Team in case of queries.', [
              {
                text: 'Ok',
              },
            ]);
            this.setState({ allData: null, isAllDataLoading: false })
          }
          else { this.setState({ allData: res['data'], isAllDataLoading: false }) }

        }).catch(err => { })
    }


  }

  componentDidMount() {
    this.getAllData();
  }

  constructor(props) {
    super(props)
    this.state = {
      user: this.props.navigation.getParam('user', null),
      ntnId: props.navigation.getParam('ntnId', ''),
      selectedCompany: props.navigation.getParam('companyName', ''),
      selectedValue: props.navigation.getParam('selectedValue', ''),
      selectedValue2: props.navigation.getParam('selectedValue2', ''),
      selectedRegion: props.navigation.getParam('selectedRegion', ''),
      selectedProduct: props.navigation.getParam('selectedProduct', ''),
      regionData: props.navigation.getParam('regionsList', ''),
      productData: props.navigation.getParam('productsList', ''),
      visible: false,
      isLoading: true,
      isRegionLoading: false,
      isProductLoading: false,
      isAllDataLoading: true,
      allData: [],
    }
  }


  render() {

    //console.log(this.state.selectedCompany);
    return (

      <SafeAreaView>
        <ImageBackground source={{ uri: this.state.user.punch }} style={{ width: "100%", height: "100%" }} imageStyle={{ height: "200%", width: "100%", resizeMode: "repeat" }}>
          <ScrollView>
            <Header companyName={this.state.selectedCompany} selectedValue={this.state.selectedValue} />
            <View>
              <View style={styles.pickerWrapper}>
                {this.state.isRegionLoading ? <ActivityIndicator /> : <Dropdown
                  data={this.state.regionData}
                  onChangeText={value => {
                    this.setState({ selectedRegion: value, selectedProduct: 'Select Product' }, () => {
                      this.getAllData();
                    })
                  }}
                  value={this.state.selectedRegion}
                />
                }
              </View>
              <View style={styles.pickerWrapper}>
                {this.state.isProductLoading ? <ActivityIndicator /> :
                  <Dropdown
                    data={this.state.productData}
                    onChangeText={value => {
                      this.setState({ selectedProduct: value }, () => {
                        this.getAllData();
                      })
                    }}
                    value={this.state.selectedProduct}
                  />
                }
              </View>


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

                <Text style={styles.dataHeaderText}>Month</Text>
                <Text style={styles.dataHeaderText}>{this.state.selectedValue}</Text>
                {/* <Text style={styles.dataHeaderText}>Product</Text> */}


              </View>


              {this.state.isAllDataLoading == false ? this.state.allData === null ? <View /> : this.state.allData.map((item, index) => {
                //console.log(index)
                return (
                  <View style={{
                    flexDirection: 'row',
                    flex: 1,
                    paddingHorizontal: 4,
                    paddingVertical: 5,
                    marginHorizontal: 10,
                    backgroundColor: '#FFF1C14a'
                  }}>


                    <Text style={[styles.dataHeaderText, { color: 'deeppink', fontWeight: 'bold' }]}>{item.fulldate}</Text>
                    <NumberFormat
                      style={[
                        styles.dataHeaderText,
                        { color: '#000000' },
                      ]}
                      value={
                        item.Revenue === null ? '0' : this.state.selectedValue2 === 'Data_volume' || this.state.selectedValue2 === 'Data_volume_charged' || this.state.selectedValue2 === 'Data_volume_free' ?
                          Math.round(parseInt(item.Revenue) / 1024).toString()
                          :
                          Math.round(item.Revenue).toString()
                      }
                      className="foo"
                      displayType={'text'}
                      thousandSeparator={true}
                      renderText={(value, props) => <Text {...props}>{value === null ? '0' : value}</Text>}
                    />
                    {/* <Text style={[styles.dataHeaderText, { color: '#444444', fontWeight: 'normal' }]}>{item.Revenue}</Text> */}
                    {/* <Text style={[styles.dataHeaderText, { color: '#444444', fontWeight: 'normal' }]}>{item.product}</Text> */}


                  </View>
                )
              }) : null}



            </View>


          </ScrollView>

          {
            this.state.selectedProduct === 'Select Product' && this.state.selectedRegion === 'Select Region' ? null :
              <TouchableOpacity onPress={() => {
                this.setState({ selectedRegion: 'Select Region', selectedProduct: 'Select Product' }, () => {
                  this.getAllData();
                });
              }}>
                <View style={[{
                  backgroundColor: '#ed0281', flexDirection: 'row', justifyContent: 'center', textAlign: 'center', alignContent: 'center', alignItems: 'center', paddingVertical: 10,
                  color: "#fff"
                }]}>
                  <Icon name='refresh' size={30} color='#fff' />
                  <Text style={[{ marginLeft: 18, fontSize: 18, color: '#fff', fontWeight: 'bold' }]}>RESET</Text>
                </View>
              </TouchableOpacity>
          }

        </ImageBackground>
      </SafeAreaView>
    );
  }
};

export const ModalContents = (props) => {

  return (
    <View style={{ height: 300 }}>
      <ScrollView>
        <FlatList
          data={props.data}
          renderItem={({ item, index }) => <View
            style={{
              flexDirection: 'row',
              flex: 1,
              paddingHorizontal: 4,
            }} key={index}>

            <Text style={[styles.dataHeaderText, { color: 'deeppink' }]}>Name</Text>
            <Text style={[styles.dataHeaderText, { color: '#444444', fontWeight: 'normal' }]}>adfadf</Text>
            <Text style={[styles.dataHeaderText, { color: '#444444', fontWeight: 'normal' }]}>adsfads</Text>


          </View>}
        />
      </ScrollView>
    </View>
  )
}

export const Header = ({ companyName, selectedValue }) => {
  return (
    <View style={styles.header}>
      {/* <Icon name="home" 
    size={24}
    color="deeppink"
    /> */}
      <Text style={styles.headerTitle}>{companyName + " - " + selectedValue}</Text>

      {/* <Icon name="bars" 
    size={24}
    color='#444444'
    /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
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
    marginHorizontal: 10,
    marginVertical: 5,
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
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#ed0281',
  },
});




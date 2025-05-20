import React from 'react';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createAppContainer} from 'react-navigation';

import TLPerformance from '../../bottomNavScreens/mom_performance/tl/TLPerformanceMOM';
import SellerPerformance from '../../bottomNavScreens/mom_performance/tl/SellerPerformanceMOM';
import Icon from 'react-native-vector-icons/FontAwesome5';


import { View } from 'react-native';

const DashboardTLMTD = createMaterialBottomTabNavigator(
  {
    SellerPerformance: {
      screen: SellerPerformance,
      navigationOptions: {
        tabBarLabel: 'Seller',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon
              name="chess-pawn"
              color="#47700e"
              size={25}
              style={[{color: tintColor}]}

            />
          </View>
        ),
      },
    },
    TLPerformance: {
      screen: TLPerformance,
      navigationOptions: {
        tabBarLabel: 'TL',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon
              name="chess-rook"
              color="#47700e"
              size={25}
              style={[{color: tintColor}]}


            />
          </View>
        ),
      },
    },
  },
  {
    initialRouteName: 'TLPerformance',
    shifting: false,
    labeled: true,
    backBehavior: 'history',
    // activeColor: '#f0edf6',
    // inactiveColor: '#3e2465',
    barStyle: {
      // paddingTop: 0,
      // paddingBottom: 0,
      color: 'white',
      backgroundColor: '#8dc540',
      fontWeight: '900',
      fontSize: 100,
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
);

export default createAppContainer(DashboardTLMTD);

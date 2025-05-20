import React from 'react';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createAppContainer} from 'react-navigation';

import RSMPerformance from '../../bottomNavScreens/mom_performance/rsm/RSMPerformanceMOM';
import TLPerformance from '../../bottomNavScreens/mom_performance/rsm/TLPerformanceMOM';
import SellerPerformance from '../../bottomNavScreens/mom_performance/rsm/SellerPerformanceMOM';
import Icon from 'react-native-vector-icons/FontAwesome5';


import { View } from 'react-native';

const DashboardRSMMOM = createMaterialBottomTabNavigator(
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
    RSMPerformance: {
      screen: RSMPerformance,
      navigationOptions: {
        tabBarLabel: 'RSM',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon
              name="chess-knight"
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
    initialRouteName: 'RSMPerformance',
    shifting: false,
    labeled: true,
    backBehavior: 'history',
    // activeColor: '#f0edf6',
    // inactiveColor: '#3e2465',
    barStyle: {
      paddingTop: 10,
      // paddingBottom: 0,
      fontColor: '#ffffff',
      backgroundColor: '#8dc540',
      fontWeight: '900',
      fontSize: 100,
      paddingLeft: 0,
      paddingRight: 0,
      height: 70
    },
  },
);

export default createAppContainer(DashboardRSMMOM);

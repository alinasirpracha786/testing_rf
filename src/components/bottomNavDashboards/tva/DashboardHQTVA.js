import React, {Component} from 'react';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createAppContainer} from 'react-navigation';

import HQPerformance from '../../bottomNavScreens/tva/hq/HQPerformance';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { View } from 'react-native';


const DashboardHQTVA = createMaterialBottomTabNavigator(
  {
    HQPerformance: {
      screen: HQPerformance,
      navigationOptions: {
        tabBarLabel: 'HQ',
        tabBarIcon: ({tintColor}) => (
          <View >
            <Icon
              name="chess-king"
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
    initialRouteName: 'HQPerformance',
    shifting: false,
    labeled: true,
    backBehavior: 'history',
    // activeColor: '#f0edf6',
    // inactiveColor: '#3e2465',
    barStyle: {
      paddingTop: 0,
      // paddingBottom: 0,
      fontColor: '#ffffff',
      backgroundColor: '#8dc540',
      fontWeight: '900',
      fontSize: 100,
      paddingLeft: 0,
      paddingRight: 0,
      height: 0
    },
  },
);

export default createAppContainer(DashboardHQTVA);

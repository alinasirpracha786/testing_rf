import React from 'react';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createAppContainer} from 'react-navigation';

import RDPerformance from '../../bottomNavScreens/charging/rd/RDPerformance';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { View } from 'react-native';


const DashboardRDCHARGING = createMaterialBottomTabNavigator(
  {
    RDPerformance: {
      screen: RDPerformance,
      navigationOptions: {
        tabBarLabel: 'RD',
        tabBarIcon: ({tintColor}) => (
          <View >
            <Icon
              name="chess-queen"
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
    initialRouteName: 'RDPerformance',
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

export default createAppContainer(DashboardRDCHARGING);

import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator, DrawerItems } from '../../../node_modules/react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import React, { Component } from 'react';

import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import DashboardHQDVR from '../bottomNavDashboards/DVR/DashboardHQDVR';
//import DashboardHQDVRDaily from '../bottomNavDashboards/gen_feedback/DashboardHQDVRSum';
import DashboardHQMTD from '../bottomNavDashboards/mtd/DashboardHQMTD';
import DashboardHQDORMANCY from '../bottomNavDashboards/dormancy/DashboardHQDORMANCY';
import DashboardHQTVA from '../bottomNavDashboards/tva/DashboardHQTVA';
import DashboardHQCHARGING from '../bottomNavDashboards/charging/DashboardHQCHARGING';
import DashboardHQGEN_FEEDBACK from '../bottomNavDashboards/gen_feedback/DashboardHQGEN_FEEDBACK';
import DashboardHQMOM_PERFORMANCE from '../bottomNavDashboards/mom_performance/DashboardHQMOM';


import Icon from 'react-native-vector-icons/FontAwesome5';

class NavigationDrawerStructure extends Component {

  //Structure for the navigatin Drawer
  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer({
      side: 'right',
      animated: true,
      to: 'closed',
    });
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          {/*Donute Button Image */}
          <Image
            source={require('../../../images/drawer.png')}
            style={{ width: 40, height: 40, marginLeft: 0 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const CustomDrawerContentComponent = (props, tintColor) => (
  <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', overflow: 'scroll' }}>
    <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
      <View style={{ height: 350, color: tintColor, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('../../../images/zong-logo.png')} style={{ height: 60, width: 200, marginBottom: 50 }}></Image>
        {/* <Icon raised="true" reverse="true" reverseColor="white" name="user-circle" size={150} style={[{ color: "#8dc540" }]} solid /> */}


        {
          props.navigation.getParam('imageFlag', null)
            ? <Image source={{ uri: props.navigation.getParam('imageURL', null) }} style={{ height: 150, width: 150, alignSelf: 'center', borderRadius: 100, borderColor: '#ed0281', borderWidth: 1 }}></Image>
            : <Icon raised="true" reverse="true" reverseColor="white" name="user-tie" size={150} style={[{ color: "#8dc540" }]} solid />
        }

        <Text style={{ color: "#ed0281", fontWeight: 'bold', fontSize: 20 }}>{props.navigation.getParam('user', null).name}</Text>
        <Text style={{ color: "#aaa" }}>{props.navigation.getParam('user', null).username}</Text>
      </View>
      <DrawerItems {...props} />
    </SafeAreaView>
    <View>
      <Text style={styles.poweredlabel}>Powered by <Text style={{ fontWeight: 'bold' }}>GCSS BI</Text></Text>
      <TouchableOpacity onPress={() => props.navigation.navigate('login',
        {
          redirectCode: 301,
          username: props.navigation.getParam('user', null).username,
          jwt: props.navigation.getParam('user', null).jwt,
          location: "DrawerHQ"
        })
      }>
        <View style={styles.item}>
          <View style={styles.iconContainer}>
            <Icon name="power-off" size={21} style={[{ color: "#bbb" }]} />
          </View>
          <Text style={styles.label}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  </ScrollView>
);


/*const DashboardHQ_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  HQMOM: {
    screen: DashboardHQ,
    navigationOptions: ({ navigation }) => ({
      title: 'Daily Visit Report Form',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerLeft:
        <TouchableOpacity onPress={() => navigation.navigate('home')}>
          <Icon name="home" size={30} style={[{ color: "#ed0281", marginLeft: 10 }]} />
        </TouchableOpacity>,

      headerTitleStyle: { flex: 1, fontWeight: 'bold', color: '#717171', textAlign: 'center' },
    }),
  },
});
*/
const DashboardHQMTD_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  HQMTD: {
    screen: DashboardHQMTD,
    navigationOptions: ({ navigation }) => ({
      title: 'MTD Performance',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerLeft:
        <TouchableOpacity onPress={() => navigation.navigate('home')}>
          <Icon name="home" size={30} style={[{ color: "#ed0281", marginLeft: 10 }]} />
        </TouchableOpacity>,

      headerTitleStyle: { flex: 1, fontWeight: 'bold', color: '#717171', textAlign: 'center' },
    }),
  },
});

const DashboardHQDVR_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  HQDVR: {
    screen: DashboardHQDVR,
    navigationOptions: ({ navigation }) => ({
      title: 'Monthly DVR Summary',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerLeft:
        <TouchableOpacity onPress={() => navigation.navigate('home')}>
          <Icon name="home" size={30} style={[{ color: "#ed0281", marginLeft: 10 }]} />
        </TouchableOpacity>,

      headerTitleStyle: { flex: 1, fontWeight: 'bold', color: '#717171', textAlign: 'center' },
    }),
  },
});

/*const DashboardHQDVRDaily_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  HQDVRDaily: {
    screen: DashboardHQDVRDaily,
    navigationOptions: ({ navigation }) => ({
      title: 'DVR Performace',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerLeft:
        <TouchableOpacity onPress={() => navigation.navigate('home')}>
          <Icon name="home" size={30} style={[{ color: "#ed0281", marginLeft: 10 }]} />
        </TouchableOpacity>,

      headerTitleStyle: { flex: 1, fontWeight: 'bold', color: '#717171', textAlign: 'center' },
    }),
  },
});*/
const DashboardHQDORMANCY_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  HQDORMANCY: {
    screen: DashboardHQDORMANCY,
    navigationOptions: ({ navigation }) => ({
      title: 'Dormancy Stats',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerLeft:
        <TouchableOpacity onPress={() => navigation.navigate('home')}>
          <Icon name="home" size={30} style={[{ color: "#ed0281", marginLeft: 10 }]} />
        </TouchableOpacity>,

      headerTitleStyle: { flex: 1, fontWeight: 'bold', color: '#717171', textAlign: 'center' },
    }),
  },
});


const DashboardHQTVA_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  HQTVA: {
    screen: DashboardHQTVA,
    navigationOptions: ({ navigation }) => ({
      title: 'Target vs Achievement',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerLeft:
        <TouchableOpacity onPress={() => navigation.navigate('home')}>
          <Icon name="home" size={30} style={[{ color: "#ed0281", marginLeft: 10 }]} />
        </TouchableOpacity>,

      headerTitleStyle: { flex: 1, fontWeight: 'bold', color: '#717171', textAlign: 'center' },
    }),
  },
});

const DashboardHQCHARGING_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  HQCHARGING: {
    screen: DashboardHQCHARGING,
    navigationOptions: ({ navigation }) => ({
      title: 'Last 03 Days Charging',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerLeft:
        <TouchableOpacity onPress={() => navigation.navigate('home')}>
          <Icon name="home" size={30} style={[{ color: "#ed0281", marginLeft: 10 }]} />
        </TouchableOpacity>,

      headerTitleStyle: { flex: 1, fontWeight: 'bold', color: '#717171', textAlign: 'center' },
    }),
  },
});

const DashboardHQGEN_FEEDBACK_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  HQGEN_FEEDBACK: {
    screen: DashboardHQGEN_FEEDBACK,
    navigationOptions: ({ navigation }) => ({
      title: 'Daily DVR Summary',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerLeft:
        <TouchableOpacity onPress={() => navigation.navigate('home')}>
          <Icon name="home" size={30} style={[{ color: "#ed0281", marginLeft: 10 }]} />
        </TouchableOpacity>,

      headerTitleStyle: { flex: 1, fontWeight: 'bold', color: '#717171', textAlign: 'center' },
    }),
  },
});

const DashboardHQMOM_Performance_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  HQSeller_Performance: {
    screen: DashboardHQMOM_PERFORMANCE,
    navigationOptions: ({ navigation }) => ({
      title: 'MOM Seller Performance',
      headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
      headerLeft:
        <TouchableOpacity onPress={() => navigation.navigate('home')}>
          <Icon name="home" size={30} style={[{ color: "#ed0281", marginLeft: 10 }]} />
        </TouchableOpacity>,

      headerTitleStyle: { flex: 1, fontWeight: 'bold', color: '#717171', textAlign: 'center' },
    }),
  },
});

const DrawerHQ = createDrawerNavigator(
  {

    DashboardHQMTD: { //Title
      screen: DashboardHQMTD_StackNavigator,
      navigationOptions: ({ navigation }) => ({
        drawerLabel: "MTD Performance",
        drawerIcon: ({ tintColor }) => <Icon name="calendar-day" size={25} style={[{ color: tintColor }]} />,
      }),
    },
    DashboardHQDVR: { //Title
      screen: DashboardHQDVR_StackNavigator,
      navigationOptions: ({ navigation }) => ({
        drawerLabel: "DVR Summary",
        drawerIcon: ({ tintColor }) => <Icon name="calendar-day" size={25} style={[{ color: tintColor }]} />,
      }),
    },
   /* DashboardHQDVRDaily: { //Title
      screen: DashboardHQDVRDaily_StackNavigator,
      navigationOptions: ({ navigation }) => ({
        drawerLabel: "DVR Summary",
        drawerIcon: ({ tintColor }) => <Icon name="calendar-day" size={25} style={[{ color: tintColor }]} />,
      }),
    },*/
   /* DashboardHQ: { //Title
      screen: DashboardHQ_StackNavigator,
      navigationOptions: ({ navigation }) => ({
        drawerLabel: "Daily Vist Report Form",
        drawerIcon: ({ tintColor }) => <Icon name="calendar-alt" size={25} style={[{ color: tintColor }]} />,
      }),
    },*/

    DashboardHQDORMANCY: { //Title
      screen: DashboardHQDORMANCY_StackNavigator,
      navigationOptions: ({ navigation }) => ({
        drawerLabel: "Dormancy Stats",
        drawerIcon: ({ tintColor }) => <Icon name="exclamation-triangle" size={20} style={[{ color: tintColor }]} />,
      }),
    },

    DashboardHQTVA: { //Title
      screen: DashboardHQTVA_StackNavigator,
      navigationOptions: ({ navigation }) => ({
        drawerLabel: "Target vs Achievement",
        drawerIcon: ({ tintColor }) => <Icon name="crosshairs" size={20} style={[{ color: tintColor }]} />,
      }),
    },

    DashboardHQCHARGING: { //Title
      screen: DashboardHQCHARGING_StackNavigator,
      navigationOptions: ({ navigation }) => ({
        drawerLabel: "Last 03 Days Charging",
        drawerIcon: ({ tintColor }) => <Icon name="credit-card" size={20} style={[{ color: tintColor }]} />,
      }),
    },

    DashboardHQGEN_FEEDBACK: { //Title
      screen: DashboardHQGEN_FEEDBACK_StackNavigator,
      navigationOptions: ({ navigation }) => ({
        drawerLabel: "General Feedback",
        drawerIcon: ({ tintColor }) => <Icon name="comment-dots" size={20} style={[{ color: tintColor }]} />,
      }),
    },

    DashboardHQMOM_PERFORMANCE: { //Title
      screen: DashboardHQMOM_Performance_StackNavigator,
      navigationOptions: ({ navigation }) => ({
        drawerLabel: "Seller Performance",
        drawerIcon: ({ tintColor }) => <Icon name="comment-dots" size={20} style={[{ color: tintColor }]} />,
      }),
    },

  },
 /* {
    intialRouteName: 'DashboardHQDVRDaily',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        color: 'white',
      },
    },
    drawerPosition: "left",
    contentComponent: CustomDrawerContentComponent,
    contentOptions: {
      activeTintColor: '#ed0281',
      itemsContainerStyle: {
        marginVertical: 10,
      },
      iconContainerStyle: {
        opacity: 1
      }
    }
  },*/
  {
    intialRouteName: 'DashboardHQGEN_FEEDBACK',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        color: 'white',
      },
    },
    drawerPosition: "left",
    contentComponent: CustomDrawerContentComponent,
    contentOptions: {
      activeTintColor: '#ed0281',
      itemsContainerStyle: {
        marginVertical: 10,
      },
      iconContainerStyle: {
        opacity: 1
      }
    }
  }
);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
    color: "#bbb",
  },
  iconContainer: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  poweredlabel: {
    textAlign: 'center',
    marginBottom: 15,
    color: "#ccc",
  },
});

export default createAppContainer(DrawerHQ);


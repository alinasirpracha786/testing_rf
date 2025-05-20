import React, { useEffect } from 'react'
import PushNotification from 'react-native-push-notification'
import { Platform } from 'react-native';



//console.log("\n\n")
//console.warn("INSIDE RemotePushController");
//console.log("\n\n")

PushNotification.popInitialNotification((notification) => {
    //console.log(notification);
})

const RemotePushController = props => {
    useEffect(() => {
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function (token) {
                //console.log("\n\n")
                //console.log('TOKEN ==> ', token)
                //console.log("\n\n")
            },
            // (required) Called when a remote or local notification is opened or received
            onNotification: function (notification) {
                //console.log("\n\n");
                //console.log('REMOTE NOTIFICATION ==> ', notification);
                //console.log("\n\n");

                //console.warn("inside onNotification");


                if (typeof notification !== 'undefined' && notification !== null) {

                    if (typeof notification.foreground !== 'undefined' && notification.foreground !== null && notification.foreground === true) {

                        if (typeof notification.collapse_key !== 'undefined' && notification.collapse_key !== null) {

                            //console.warn("FOREGROUND");

                            setTimeout(() => {
                                sendLog({
                                    "username": props.paramObj.username,
                                    "event": props.paramObj.event,
                                    "cause": props.paramObj.cause,
                                    "jwt": props.paramObj.jwt,
                                    "location": "foreground",
                                    "apiHost": props.paramObj.apiHost,
                                    "android_version_code": props.paramObj.android_version_code,
                                    "ios_build": props.paramObj.ios_build,


                                });
                            }, 1000);

                        }

                    }

                    else {

                        //console.warn("TAPPED");

                        setTimeout(() => {
                            sendLog({
                                "username": props.paramObj.username,
                                "event": props.paramObj.event,
                                "cause": props.paramObj.cause,
                                "jwt": props.paramObj.jwt,
                                "location": "tapped",
                                "apiHost": props.paramObj.apiHost,
                                "android_version_code": props.paramObj.android_version_code,
                                "ios_build": props.paramObj.ios_build,


                            });
                        }, 1000);


                    }

                }




                // process the notification here
            },
            // Android only: GCM or FCM Sender ID
            senderID: Platform.OS === 'android' ? '841545445713' : null,
            popInitialNotification: true,
            requestPermissions: true,
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

        })
    }, [])
    return null
}

sendLog = (paramObj) => {
    const url = paramObj.apiHost + '/user/write_log';
    // //console.warn("LOG CALL URL: ", url, " and jwt is > > > > > > > > > > : ", paramObj.jwt);

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeaders.append('Authorization', paramObj.jwt);


    return fetch(url, {

        method: 'POST',
        headers: myHeaders,
        body: "username=" + paramObj.username + "&event=" + paramObj.event + "&cause=" + paramObj.cause + "&token=not sent due to security reasons" + "&description=" + paramObj.location + "&platform=" + Platform.OS + "&version=" + (Platform.OS === 'android' ? paramObj.android_version_code : paramObj.ios_build) // <-- Post parameters

    }).then(response => response.json())
        .then(responseJson => {
            //console.warn("NOTIFICATION RESPONSE JSON", responseJson);

            // //console.warn("RESPONSE ::::::::::::::::::::::::", responseJson);


            if (responseJson.status == 200) {
                //console.warn("NOTIFICATION log sent and written with response: ", responseJson.msg);
            } else {

                //console.warn("NOTIFICATION log sent but NOT WRITTEN with response: ", responseJson.msg);
            }

        })
        .catch(error => {
            //console.warn("error occured in sending NOTIFICATION log with details username= '" + paramObj.username + "' & event= '" + paramObj.event + "' & cause= '" + paramObj.cause + "'");

        })
}
export default RemotePushController

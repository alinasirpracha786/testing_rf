package pk.com.zong.business.bi;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Arrays;

public class CalendarModule extends ReactContextBaseJavaModule {

    Context context;

    CalendarModule(ReactApplicationContext context) {
        super(context);
        this.context = context;

    }

    @NonNull
    @Override
    public String getName() {
        return "CalendarModule";
    }

    @ReactMethod
    public void createCalendarEvent(String name, String location, Promise promise) {
       /* try {
            if (ContextCompat.checkSelfPermission(context, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED ) {
                ActivityCompat.requestPermissions((Activity) context, new String[]{android.Manifest.permission.ACCESS_FINE_LOCATION}, 101);

            }


        } catch (Exception e){
            e.printStackTrace();
        }*/
   
        try {

            LocationService locationService = new LocationService(context);
            DeviceLocation deviceLocation = locationService.getCurrentLocation();
            
                 if(deviceLocation == null)
                   {                      
                       promise.resolve("Not found");
                   }
                   else{
                        String latitude = deviceLocation.getLatitude();
                        String  longitude = deviceLocation.getLongitude();
                        String  address = deviceLocation.getAddress();

                            String[] array = new String[3];
                            array[0] = latitude;
                            array[1] = longitude;
                            array[2] = address;
                            promise.resolve(Arrays.toString(array));
                   }
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }





}
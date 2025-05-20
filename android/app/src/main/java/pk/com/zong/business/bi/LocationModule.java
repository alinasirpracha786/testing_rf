package pk.com.zong.business.bi;

import android.content.Context;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import pk.com.zong.business.bi.DeviceLocation;
import pk.com.zong.business.bi.LocationService;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

public class LocationModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public LocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "LocationModule";
    }

    @ReactMethod
    public void getCurrentLocation(Promise promise) {
        Log.d("LocationModule", "getCurrentLocation called");

        if (!isNetworkAvailable()) {
            promise.reject("NETWORK_ERROR", "No network connection available");
            return;
        }
        LocationManager locationManager = (LocationManager) reactContext.getSystemService(ReactApplicationContext.LOCATION_SERVICE);
        LocationListener locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(@NonNull Location location) {
                WritableMap params = Arguments.createMap();
                params.putDouble("latitude", location.getLatitude());
                params.putDouble("longitude", location.getLongitude());
                promise.resolve(params);
                //  promise.resolve(Arguments.createMap().putDouble("latitude", location.getLatitude()).putDouble("longitude", location.getLongitude()));
                locationManager.removeUpdates(this);
            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {
            }

            @Override
            public void onProviderEnabled(@NonNull String provider) {
            }

            @Override
            public void onProviderDisabled(@NonNull String provider) {
            }
        };

        if (ActivityCompat.checkSelfPermission(reactContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(reactContext, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            promise.reject("LOCATION_PERMISSION", "Location permission not granted");
            return;
        }

        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, locationListener);
    }
    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager = (ConnectivityManager) reactContext.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }
    @ReactMethod
    public void getAddressFromCoordinates(double latitude, double longitude, Promise promise) {
        Geocoder geocoder = new Geocoder(reactContext, Locale.getDefault());
        try {
            List<Address> addresses = geocoder.getFromLocation(latitude, longitude, 1);
            if (addresses != null && !addresses.isEmpty()) {
                Address address = addresses.get(0);
                StringBuilder addressString = new StringBuilder();
                for (int i = 0; i <= address.getMaxAddressLineIndex(); i++) {
                    addressString.append(address.getAddressLine(i)).append(", ");
                }
                // Remove the last comma and space
                if (addressString.length() > 0) {
                    addressString.setLength(addressString.length() - 2);
                }
                promise.resolve(addressString.toString());
            } else {
                promise.reject("NO_ADDRESS", "No address found for the coordinates");
            }
        } catch (IOException e) {
            promise.reject("IO_EXCEPTION", "Unable to get address: " + e.getMessage());
        }
    }
}
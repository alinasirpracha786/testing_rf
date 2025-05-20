package pk.com.zong.business.bi;

import static android.os.Looper.getMainLooper;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;


import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;


import com.facebook.react.bridge.ReactApplicationContext;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.Priority;


import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.function.Consumer;


public class LocationService {

    Context context;
    public String latitude, longitude, address;
      private LocationManager locationManager;
   
  
    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1;
   LocationListener locationListener = new LocationListener() {
        public void onLocationChanged(Location location) {
            // Handle location updates here
             // Toast.makeText(context, "Location Changed", Toast.LENGTH_SHORT).show();
        }

        public void onStatusChanged(String provider, int status, Bundle extras) {
             // Toast.makeText(context, "GPS Status Changed", Toast.LENGTH_SHORT).show();
        }

        public void onProviderEnabled(String provider) {
             Toast.makeText(context, "GPS Enable", Toast.LENGTH_SHORT).show();
        }

        public void onProviderDisabled(String provider) {
            Toast.makeText(context, "GPS Disable. Please enable your GPS!", Toast.LENGTH_SHORT).show();
            
        }
    };
    public LocationService(Context context) {
        this.context = context;
      locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
       


       if (ActivityCompat.checkSelfPermission(context, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(context, android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
          //  Toast.makeText(context, "Location Permission not granted", Toast.LENGTH_SHORT).show();

            ActivityCompat.requestPermissions((Activity) context, new String[]{android.Manifest.permission.ACCESS_FINE_LOCATION}, 1);
            return;
        }else{
            // Write you code here if permission already given.
           // Toast.makeText(context, "Location Permission granted", Toast.LENGTH_SHORT).show();

            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, locationListener);
        }
    }


    private String getAddressFromCoordinates(double lat, double lon) {
        Geocoder geocoder;
        List<Address> addresses = null;
        geocoder = new Geocoder(context, Locale.getDefault());
        String address = "no address found";
        try { //n(lat, lon, 4);
            addresses = geocoder.getFromLocation(lat, lon, 1); // Here 1 represent max location result to returned, by documents it recommended 1 to 5
        } catch (IOException e) {
            e.printStackTrace();
            return address;
        }

        assert addresses != null;
        address = addresses.get(0).getAddressLine(0).replace(",", "");
        return address;
    }

    public DeviceLocation getCurrentLocation() {
       
           boolean gps_enabled = false;
        boolean network_enabled = false;
        
        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(context, "device location", Toast.LENGTH_SHORT).show();
          //  if(deviceLocation == 'not valid')

            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
          /*  try {
                gps_enabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
            } catch(Exception ex) {}

            try {
                network_enabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
            } catch(Exception ex) {}

            if(!gps_enabled && !network_enabled) {
                // notify user
                new AlertDialog.Builder(context)
                        .setMessage("gps not enabled")
                        .setPositiveButton("locationsettings", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface paramDialogInterface, int paramInt) {
                                context.startActivity(new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS));
                            }
                        })
                        .setNegativeButton("no",null)
                        .show();
            }*/
           // return null;
        }

     Location location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
      
        if (location != null) {
            if (location.getAccuracy() > 100) {
                return null;
            }
            latitude = String.valueOf(location.getLatitude());
            longitude = String.valueOf(location.getLongitude());
            address = getAddressFromCoordinates(location.getLatitude(), location.getLongitude());
         } else {
        return  null;
         }
        return new DeviceLocation(latitude, longitude, address);
        }




   

}

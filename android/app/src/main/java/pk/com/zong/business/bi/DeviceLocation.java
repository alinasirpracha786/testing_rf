package pk.com.zong.business.bi;

public class DeviceLocation {
    String latitude, longitude, address;

    public DeviceLocation(String lat, String lon, String add) {
        this.latitude = lat;
        this.longitude = lon;
        this.address = add;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}

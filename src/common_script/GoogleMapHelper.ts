import axios, { AxiosError } from "axios";
import { google } from 'googlemaps';
import YamlContent from '../config.yaml';

export class GoogleMapHelper {
    api_key : string;
    current_latitude : number
    current_longitude : number
    current_address : string
    place_name : string
    error_msg : string

    constructor(){
        this.api_key = YamlContent.ApiKey
        this.current_latitude= 43.74821
        this.current_longitude = -79.289458
    }

    async get_user_location() {
        if (this.check_browser_support()) {
        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            this.current_latitude = position.coords.latitude;
            this.current_longitude = position.coords.longitude;
            const timeout = 3000;
            const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + this.current_latitude + "," + this.current_longitude + "&key=" + this.api_key, {
            timeout: timeout
            });
            if (response.data.error_message) {
                this.error_msg = response.data.error_message;
            } else {
                this.current_address = response.data.results[0].formatted_address;
            }
        } catch (error) {
            if (axios.isAxiosError(error) && (error as AxiosError).code === "ECONNABORTED") {
            console.log("Request timed out");
            } else {
                this.error_msg = error.message;
                console.log(this.error_msg);
            }
        }
        }
    }

    set_location(latitude : number,longitude : number){
        this.current_latitude = latitude
        this.current_longitude = longitude
    }
    set_placeName(place_name : string){
        this.place_name = place_name
    }

    check_browser_support(){
        if(navigator.geolocation){
            return true
        }
        console.log("Your browser do not support location function,please use other browser or update your browser")
        return false
    }

}
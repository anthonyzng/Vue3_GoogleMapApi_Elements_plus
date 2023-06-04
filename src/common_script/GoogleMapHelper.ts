import axios from 'axios';
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
        this.current_latitude= 80.093048
        this.current_longitude = 8.84212
    }

    get_user_location() {
        if (this.check_browser_support()){
            navigator.geolocation.getCurrentPosition(
                position=>{
                    this.current_latitude = position.coords.latitude
                    this.current_longitude = position.coords.longitude
                    axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+this.current_latitude+","+this.current_longitude+"&key="+this.api_key)
                    .then(response =>{
                        if (response.data.error_message){
                            this.error_msg = response.data.error_message
                        }else{
                            this.current_address = response.data.results[0].formatted_address
                        }
                    })
                }
                ,error =>{
                    this.error_msg = error.message
                    console.log(this.error_msg)
                }
                
            );
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
interface Position {
    lat: number;
    lng: number;
  }

export class Record {
    placeName : string
    latitude : number
    longitude : number
    timezone : string
    datetime : Date
    datetime_str : string
    datetime_local_timezone_id : string
    datetime_local_timezone_str : string
    position : Position


    constructor(
        place_name : string,
        latitude:number,
        longitude:number,
        timezone : string,
        dateTime : Date,
        datetime_str:string,
        datetime_local_time_zone_id:string,
        datetime_local_time_zone_str:string){
        this.placeName = place_name
        this.timezone = timezone
        this.datetime = dateTime
        this.latitude = latitude
        this.longitude = longitude
        this.datetime_str = datetime_str
        this.position = {
            lat:this.latitude,
            lng:this.longitude
        }
        this.datetime_local_timezone_id = datetime_local_time_zone_id
        this.datetime_local_timezone_str = datetime_local_time_zone_str
    }

    //setter
    setPlaceName(place_name:string){
        this.placeName = place_name
    }

    setLatitude(latitude:number){
        this.latitude = latitude
    }
    
    setLongitude(longitude:number){
        this.longitude = longitude
    }

    setTimeZone(timezone:string){
        this.timezone = timezone
    }

    setDateTime(dateTime:Date){
        this.datetime = dateTime
    }

    setDateTime_Str(dateTime_str : string){
        this.datetime_str = dateTime_str
    }

    setDateTimeLocalTimeZoneId(dateTime_str : string){
        this.datetime_local_timezone_id = dateTime_str
    }

    setDateTimeLocalTimeZoneStr(dateTime_str : string){
        this.datetime_local_timezone_str = dateTime_str
    }

    // getter
    getPlaceName(){
        return this.placeName
    }

    getLatitude(){
        return this.latitude 
    }
    
    getLongitude(){
        return this.longitude 
    }

    getTimeZone(){
        return this.timezone
    }

    getDateTime(){
        return this.datetime 
    }

    getDateTimeStr(){
        return this.datetime_str
    }

    getPosition(){
        return this.position
    }

    getDateTimeLocalTimeZoneId(){
        return this.datetime_local_timezone_id
    }

    getDateTimeLocalTimeZoneStr(){
        return this.datetime_local_timezone_str
    }
}
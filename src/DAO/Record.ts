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
    position : Position


    constructor(place_name : string,latitude:number,longitude:number,timezone : string ,dateTime : Date,datetime_str:string){
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
    }

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
}
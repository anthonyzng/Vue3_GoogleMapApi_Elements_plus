<script setup lang="ts">
  import { toRefs, ref , computed } from 'vue'
  import {MapLocation,Search,Location,Timer,Coordinate, Memo} from '@element-plus/icons-vue'
  import { GoogleMapHelper } from '../common_script/GoogleMapHelper';
  import {Record} from '../DAO/Record'
  interface Props {
  mapHelper: GoogleMapHelper
  records: Map<string, Record>
  }
  
//var 
const props = defineProps<Props>()
const { mapHelper } = toRefs(props)
const {records} = toRefs(props)

let tmp_lat : number
let tmp_lng : number
let tmp_placeName : string
let btn_loading = ref(false)
let error_msg = ref('')
let bol_error = ref(false)

//function 
function setTmpLocation(e: Event) {
  console.log(e)
  console.log("asd")
  tmp_lat = e.geometry.location.lat()
  tmp_lng = e.geometry.location.lng()
  tmp_placeName = e.formatted_address
}

async function btn_locate_event(mapHelper: GoogleMapHelper){
  this.btn_loading = true;
  try{
    await mapHelper.get_user_location();
    this.btn_loading = false;
  }catch(error){
    throw new Error("Can't get data from google map api query by location lat & lng");
  }
}

async function setTargetLocation(){
  if (tmp_lat == null || tmp_lng == null || tmp_placeName == null){
    error_msg.value = "Can't find this place from google map api call,please enter a correct place"
    bol_error.value = true
    console.log(bol_error.value)
    throw new Error("Can't find this place from google map api call,please enter a correct place");
  }
  let current_time = new Date()
  let current_time_str = new Date().toLocaleString();
  let current_zone = new Intl.DateTimeFormat().resolvedOptions().timeZone
  let current_timestamp = current_time.getTime()/1000
  try{
    let result = await mapHelper.value.get_location_datatime(tmp_lat,tmp_lng,current_timestamp)
    let timeZone = result?.timeZoneId
    const currentDate = current_time.toLocaleString('en-US', {timeZone});
    mapHelper.value.set_placeName(tmp_placeName)
    mapHelper.value.set_location(tmp_lat,tmp_lng)
    let tmp_record = new Record(
      mapHelper.value.place_name,
      mapHelper.value.current_latitude,
      mapHelper.value.current_longitude,
      current_zone,
      current_time,
      current_time_str,
      timeZone,
      currentDate
      )
    records.value.set(mapHelper.value.place_name,tmp_record)
    error_msg.value = null
    bol_error.value = false
    tmp_lat = null
    tmp_lng = null
    tmp_placeName = null
  }catch(e){
    error_msg.value = "Can't get the location timezone"
    bol_error.value = true
    console.log("Can't get the location timezone")
  }
}
// expose this component's value and methods to let the parent can access these.
defineExpose({
  btn_locate_event,
  btn_loading
})
</script>
<template>
        <el-tooltip content="Locate Me" placement="top">
        <el-button :type="btn_loading ? 'warning' : 'success'" :icon="MapLocation" :loading="btn_loading" @click="btn_locate_event(mapHelper)" class="btn_locate" ></el-button>
        </el-tooltip>
        <el-alert
          title="Error Alert"
          type="error"
          :description="error_msg"
          show-icon
          effect="dark"
          :closable="false"
          :class="bol_error ? 'err_show' : 'err_hidden'"
        />
          <GMapAutocomplete
            class="auto_complete_input"
            placeholder="Enter target place"
            @place_changed="(e: Event) => setTmpLocation(e)"
            @keyup.enter.native="setTargetLocation"
          >
          </GMapAutocomplete>
        <el-button type="primary" :icon="Search" placeholder="Enter target location" @click="setTargetLocation" class="btn_locate"></el-button>
</template>
<style scoped lang="scss">
  .search-bar {
    @apply p-5 flex justify-center;
  }
  .btn_locate{
  height: 40px;
  font-size: 25px;
}

.err_hidden{
  display: none;
}

.err_show{
  display: inline-flex;
  position: absolute;
  height: 45px;
  width: 500px;
  top: 100px;
}
.auto_complete_input{
  @apply mx-1 border rounded-lg border-red-500;
  width: 50%;
  height: 40px;
}

.auto_complete_input:focus{
  @apply border-white
}
</style>

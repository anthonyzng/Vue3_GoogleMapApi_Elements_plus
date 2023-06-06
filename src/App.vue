<script setup lang="ts">
import { ref} from 'vue'
import Map_page from './components/map_page.vue' 
import Search_table from './components/Search_table.vue';
import { GoogleMapHelper } from './common_script/GoogleMapHelper';
import {Record} from './DAO/Record'
import {MapLocation,Search,Location,Timer,Coordinate} from '@element-plus/icons-vue'

const mapHelper = ref(new GoogleMapHelper())
const records = ref(new Map<string,Record>())

let tmp_lat : number
let tmp_lng : number
let tmp_placeName : string
let btn_loading = ref(false)
let error_msg = ref('')
let bol_error = ref(false)


function setTmpLocation(e: Event) {
  tmp_lat = e.geometry.location.lat()
  tmp_lng = e.geometry.location.lng()
  tmp_placeName = e.formatted_address
}

async function setTargetLocation(){
  console.log(error_msg.value)
  if (tmp_lat == null || tmp_lng == null || tmp_placeName == null){
    error_msg.value = "Can't find this place from google map api call,please enter a correct place"
    bol_error.value = true
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
    //---
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

async function btn_locate_event(mapHelper: GoogleMapHelper){
  this.btn_loading = true;
  try{
    await mapHelper.get_user_location();
    this.btn_loading = false;
  }catch(error){
    throw new Error("Can't get data from google map api query by location lat & lng");
  }
}
</script>

<template>
  <div class="p-5">
  <div class="display_box">
      <div class="lastest_record">
        <div class="content">
          <el-icon :size="20" color="red" class="icon"><Location /></el-icon>
        </div>
        <div>
          <el-icon :size="20" color="red" ><Location /></el-icon>
          <h3>
            Latest Searched Location : {{ records.get(mapHelper.place_name)?.getPlaceName() ?? ''}}
          </h3>
        </div>
        <div>
          <el-icon :size="20" color="green"><Timer /></el-icon>
          <h3>
            DateTime : {{ records.get(mapHelper.place_name)?.getDateTimeLocalTimeZoneStr() ?? '' }}
          </h3>
        </div>
        <div>
          <el-icon :size="20" color="blue"><Coordinate /></el-icon>
          <h3>
          TimeZone : {{ records.get(mapHelper.place_name)?.getDateTimeLocalTimeZoneId() ?? '' }}
          </h3>
        </div>
      </div>
      <div class="control_panel">
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
      </div>
        <div class="lastest_record">
          <el-icon :size="20" color="blue"><Coordinate /></el-icon>
          <h3>
          Your TimeZone : {{ records.get(mapHelper.place_name)?.getTimeZone() ?? '' }}
          </h3>
          <el-icon :size="20" color="green"><Timer /></el-icon>
          <h3>
          Your DateTime : {{ records.get(mapHelper.place_name)?.getDateTimeStr() ?? '' }}
          </h3>
        </div>
  </div>
  <div class="container">
  <div>
    <Search_table v-bind:map-helper="mapHelper" v-bind:records="records"></Search_table>
  </div>
  <div style="position: relative;">
    <Map_page v-bind:map-helper="mapHelper" v-bind:records="records" >
    </Map_page>
    <div class="btn_in_map">
        <el-tooltip content="Locate Me" placement="top">
        <el-button :type="btn_loading ? 'warning' : 'success'" :icon="MapLocation" :loading="btn_loading" @click="btn_locate_event(mapHelper)" class="btn_locate" ></el-button>
        </el-tooltip>
    </div>
  </div>
</div>
</div>
</template>

<style scoped>
.btn_in_map{
  position: absolute;
  top: 710px;
  left: 80px;
}
.container{
  @apply p-3 border rounded-lg border-blue-500;
  display: flex;
  max-width: 100%;
}
.container > div:first-child {
  flex-basis: 40%;
  padding: 5px;
}
.container > div:last-child {
  flex-basis: 60%;
  padding: 5px
}

.btn_locate{
  height: 40px;
  font-size: 25px;
}

.control_panel{
  @apply p-5 flex justify-center;
}

.control_panel > el-button{
  @apply p-5;
}

.lastest_record{
  @apply p-3 flex justify-center;
  width: 100%;
}

.lastest_record > div {
  @apply p-3;
  display: flex;
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

.display_box{
  @apply p-5 border rounded-lg border-blue-500 my-5;
}

/* max-width  */
@media (max-width: 900px) {
.container {
    flex-direction: column;
}

.btn_in_map{
  position: absolute;
  top: 710px;
  left: 77px;
}

}
@media (max-width: 800px) {
  .btn_in_map{
  position: absolute;
  top: 410px;
  left: 77px;
  }
}

/* animation */
.display_box:hover .icon {
  animation: moveIcon 8s linear infinite;
}

.icon {
  position: absolute;
  top: -52px;
  left: 10px;
  transition: transform 1s linear;
}

.content {
  position: absolute;
  width: 100%;
  height: 0%;
}

@keyframes moveIcon {
  0% {
    transform: translateX(0) translateY(0);
  }
  100% {
    transform: translateX(6000%) translateY(0);
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
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
let error_msg = ref("")

function setTmpLocation(e: Event) {
  console.log(e)
  if (e == null){
    tmp_lat = null
    tmp_lng = null
    tmp_placeName = null
  }
  tmp_lat = e.geometry.location.lat()
  tmp_lng = e.geometry.location.lng()
  tmp_placeName = e.formatted_address
}

function setTargetLocation(){
  if (tmp_lat == null || tmp_lng == null || tmp_placeName == null){
    this.error_msg = "can't find this place from google map api call,please check your place name"
    throw new Error("can't find this place from google map api call,please check your place name");
  }
  let current_time = new Date()
  let current_time_str = new Date().toLocaleString();
  let current_zone = new Intl.DateTimeFormat().resolvedOptions().timeZone
  mapHelper.value.set_placeName(tmp_placeName)
  mapHelper.value.set_location(tmp_lat,tmp_lng)
  let tmp_record = new Record(mapHelper.value.place_name,mapHelper.value.current_latitude,mapHelper.value.current_longitude,current_zone,current_time,current_time_str)
  records.value.set(mapHelper.value.place_name,tmp_record)
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
            DateTime : {{ records.get(mapHelper.place_name)?.getDateTimeStr() ?? '' }}
          </h3>
        </div>
        <div>
          <el-icon :size="20" color="blue"><Coordinate /></el-icon>
          <h3>
          TimeZone : {{ records.get(mapHelper.place_name)?.getTimeZone() ?? '' }}
          </h3>
        </div>
      </div>
      <div class="control_panel">
        <el-tooltip content="Locate Me" placement="top">
        <el-button :type="btn_loading ? 'warning' : 'success'" :icon="MapLocation" :loading="btn_loading" @click="btn_locate_event(mapHelper)" class="btn_locate" ></el-button>
        </el-tooltip>
          <GMapAutocomplete
            class="auto_complete_input"
            placeholder="Enter target place"
            @place_changed="(e: Event) => setTmpLocation(e)"
            @keyup.enter.native="setTargetLocation"
          >
          </GMapAutocomplete>
        <el-button type="primary" :icon="Search" placeholder="Enter target location" @click="setTargetLocation" class="btn_locate">Search</el-button>
      </div>
  </div>
  <div class="container">
  <div>
    <Search_table v-bind:map-helper="mapHelper" v-bind:records="records"></Search_table>
  </div>
  <div>
    <Map_page v-bind:map-helper="mapHelper" v-bind:records="records" ></Map_page>
  </div>
</div>
</div>
</template>

<style scoped>
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

@media (max-width: 850px) {
  .container {
    flex-direction: column;
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

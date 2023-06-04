<script setup lang="ts">
import { ref } from 'vue'
import Map_page from './components/map_page.vue' 
import Search_table from './components/Search_table.vue';
import { GoogleMapHelper } from './common_script/GoogleMapHelper';
import {Record} from './DAO/Record'
import {Location} from '@element-plus/icons-vue'
const mapHelper = ref(new GoogleMapHelper())
const records = ref(new Map<string,Record>())
let lastest_record = ref({})

var tmp_lat : number
var tmp_lng : number
var tmp_placeName : string

function setTmpLocation(e: Event) {
  tmp_lat = e.geometry.location.lat()
  tmp_lng = e.geometry.location.lng()
  tmp_placeName = e.formatted_address
}

function setTargetLocation(){
  let current_time = new Date()
  let current_time_str = new Date().toLocaleString();
  let current_zone = new Intl.DateTimeFormat().resolvedOptions().timeZone
  mapHelper.value.set_placeName(tmp_placeName)
  mapHelper.value.set_location(tmp_lat,tmp_lng)
  let tmp_record = new Record(mapHelper.value.place_name,mapHelper.value.current_latitude,mapHelper.value.current_longitude,current_zone,current_time,current_time_str)
  records.value.set(mapHelper.value.place_name,tmp_record)
}



</script>

<template>
  <div>
    <h3>
      Latest Searched Location : {{ records.get(mapHelper.place_name)?.getPlaceName() ?? 'Null'}}
    </h3>
    <h3>
      DateTime : {{ records.get(mapHelper.place_name)?.getDateTime() ?? 'Null' }}
    </h3>
    <h3>0
      TimeZone : {{ records.get(mapHelper.place_name)?.getTimeZone() ?? 'Null' }}
    </h3>
  </div>
  <div>
    <el-button type="success" :icon="Location" @click="mapHelper.get_user_location()">Locate me</el-button>
    <GMapAutocomplete
      id = "auto_completed"  
      placeholder="Enter target place"
      @place_changed="(e: Event) => setTmpLocation(e)"
      @keyup.enter.native="setTargetLocation"
    >
    <!-- @place_changed="(e: Event) => setPlace(e)" -->
    </GMapAutocomplete>
    <button class="btn_search" placeholder="Enter target location" @click="setTargetLocation" >Search</button>
  </div>
  <div class="container">
  <div>
    <Search_table v-bind:map-helper="mapHelper" v-bind:records="records"></Search_table>
  </div>
  <div>
    <Map_page v-bind:map-helper="mapHelper" v-bind:records="records" ></Map_page>
  </div>
</div>
</template>

<style scoped>
.container{
  display: flex;
  max-width: 100%;
}
.container > div:first-child {
    flex-basis: 40%;
  }

  .container > div:last-child {
    flex-basis: 60%;
  }

  .btn_search {
  @apply p-3 border rounded-lg border-purple-600;
}

.input_box{
  @apply p-3 border rounded-lg border-purple-600;
}


@media (max-width: 450px) {
  .container {
    display: flex;
    flex-direction: row;
  }
  }
</style>

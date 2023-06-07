<script setup lang="ts">
import { ref,onMounted} from 'vue'
import Map_page from './components/map_page.vue' 
import Search_table from './components/Search_table.vue';
import Search_bar from './components/Search_bar.vue';
import { GoogleMapHelper } from './common_script/GoogleMapHelper';
import {Record} from './DAO/Record'
import {MapLocation,Search,Location,Timer,Coordinate, Memo,CircleClose} from '@element-plus/icons-vue'

const mapHelper = ref(new GoogleMapHelper())
const records = ref(new Map<string,Record>())
const search_bar = ref<HTMLElement | null>(null)

let btn_loading = ref(false)
// onMounted(() => { // for mount to child component value
//   btn_loading.value = search_bar.value.btn_loading
//   console.log(btn_loading.value)
// })
const callChildMethod = async () => {
  btn_loading.value = true
  await search_bar.value.btn_locate_event(mapHelper.value)
  btn_loading.value = false
}

</script>

<template>
  <div class="p-5">
    <div class="btn_search_and_table_container">
      <el-tooltip content="Open Search Bar" placement="top">
        <el-button :icon="Search" circle class="btn_search_and_table" type="primary" onclick="search_box.showModal()"></el-button>
      </el-tooltip>

      <dialog id="search_box">
        <Search_bar v-bind:map-helper="mapHelper" v-bind:records="records"></Search_bar>
        <el-tooltip content="Close" placement="top">
        <el-button :icon="CircleClose"  class="btn_close_dialog" type="danger" onclick="search_box.close()"></el-button>
        </el-tooltip>
      </dialog>

      <el-tooltip content="Open Records Table" placement="top">
        <el-button :icon="Memo" circle class="btn_search_and_table" type="success" onclick="search_table.showModal()"></el-button>
      </el-tooltip>

      <dialog id="search_table">
        <Search_table v-bind:map-helper="mapHelper" v-bind:records="records"></Search_table>
        <el-tooltip content="Close" placement="top">
        <el-button :icon="CircleClose"  class="btn_close_dialog" type="danger" onclick="search_table.close()"></el-button>
        </el-tooltip>
      </dialog>
    </div>
  <div class="display_box" ref="show_content">
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
        <Search_bar ref="search_bar" v-bind:map-helper="mapHelper" v-bind:records="records"></Search_bar>
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
        <el-button :type="btn_loading ? 'warning' : 'success'" :icon="MapLocation" :loading="btn_loading" @click="callChildMethod" class="btn_locate" ></el-button>
        </el-tooltip>
    </div>
  </div>
  </div>
</div>
</template>

<style scoped>

#search_box{
  background-color: floralwhite;
}

.btn_close_dialog{
  font-size: 30px;
  height: 40px;
  width: 40px;
  margin-left: 0px;
}

.btn_search_and_table_container{
display: none;
position: fixed;
top: 50%;
left: 0px;
z-index: 99;
flex-direction: column;
}

.btn_search_and_table{
  @apply my-1;
  height: 50px;
  width: 50px;
  margin-left: 10px;
}
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

.display_box{
  @apply p-5 border rounded-lg border-blue-500 my-5;
}

/* max-width  */
@media (max-width: 900px) {
.container {
    flex-direction: column;
}

.btn_search_and_table_container{
  display: flex;
}
.btn_in_map{
  position: absolute;
  top: 710px;
  left: 77px;
}

.el-button + .el-button{
  margin-left: 0px;
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

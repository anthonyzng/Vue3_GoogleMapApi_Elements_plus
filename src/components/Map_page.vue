<script setup lang="ts">
import { toRefs , computed } from 'vue'
import { GoogleMapHelper } from '../common_script/GoogleMapHelper';

const props = defineProps({
mapHelper: {
  type: GoogleMapHelper,
  required: true
},
records :{
  type: Map,
  required: true
}
})
//init var
const { mapHelper } = toRefs(props)
const {records} = toRefs(props)
let center = computed(() => {
    return { lat: mapHelper.value.current_latitude, lng: mapHelper.value.current_longitude }
})
</script>

<template>
  <GMapMap :center="center"
  :zoom="5"
  map-type-id="terrain"
  class="map_style">
  <GMapMarker
  :key="place_name"
  v-for="[place_name, record] in records"
  :position="record.position"
  :clickable="true"
  :draggable="true"
  />
  </GMapMap>
</template>

<style scoped>
.map_style{
  width: 100%;
  height: 750px;
}

@media (max-width: 800px) {
  .map_style {
    height : 450px
  }
}
</style>

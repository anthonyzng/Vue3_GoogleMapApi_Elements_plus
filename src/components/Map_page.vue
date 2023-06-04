<script setup lang="ts">
import { toRefs, ref , computed, reactive } from 'vue'
import { GoogleMapHelper } from '../common_script/GoogleMapHelper';
import { stringifyExpression } from '@vue/compiler-core';
import {Record} from './DAO/Record'

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
    style="width: 100%; height: 600px">
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
</style>

<script setup lang="ts">
import { toRefs, ref , computed} from 'vue'
import { ElTable,ElInput  } from 'element-plus'
import { GoogleMapHelper } from '../common_script/GoogleMapHelper';
import {MapLocation} from '@element-plus/icons-vue'
interface Props {
  mapHelper: GoogleMapHelper
  records: Map<string, Record>
}
// init var
const props = defineProps<Props>()
const { mapHelper } = toRefs(props)
const {records} = toRefs(props)
const currentPage = ref(1);
const pageSize = 10;
const selectedPlaces = ref([]);
const totalRecords = computed(() => records.value.size);
const search = ref('')
//function
const tableDataToShow = computed(() => {
      const startIndex = (currentPage.value - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const keys = Array.from(records.value.keys());
      const slicedKeys = keys.slice(startIndex, endIndex);
      const filteredRecords = slicedKeys.filter((key) => {
      const record = records.value.get(key);
      return record.placeName.includes(search.value);
      });
      return filteredRecords.map((key) => records.value.get(key));
    });

const handlePageChange = (newPage) => {
      currentPage.value = newPage;
};

const handleSelectionChange = (selection) => {
      selectedPlaces.value = selection.map((item) => item.placeName)
};

const deletePlaceFromRecords =() => {
      for(let i = 0; i < selectedPlaces.value.length;i++){
        if(records.value.has(selectedPlaces.value[i])){
          records.value.delete(selectedPlaces.value[i])
        }
      }
      let latest_search_time = new Date(0)
      let lastest_record : Record = null
      records.value.forEach((record, place_name) => {
        if(record.getDateTime() > latest_search_time){
          latest_search_time = record.getDateTime()
          lastest_record = record
        }
      })
      if (lastest_record != null){
        mapHelper.value.set_placeName(lastest_record.getPlaceName())
        mapHelper.value.set_location(lastest_record.getLatitude(),lastest_record.getLongitude())
      }
}

function go_to_target_place(target_lat : number,target_lng : number){
  mapHelper.value.set_location(target_lat,target_lng)
}
</script>
<template>
  <el-table
    :data="tableDataToShow"
    :default-sort="{ prop: 'id', order: 'ascending' }"
    @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="30" />
    <el-table-column label="PlaceName">
      <template #header>
        <div class="table_header">
          <el-tooltip content="Search by Place Name" placement="top">
          <el-input v-model="search" size="small" placeholder="PlaceName" />
          </el-tooltip>
          <el-tooltip content="Delete Selected Records" placement="top">
          <el-button size="small" type="danger" @click="deletePlaceFromRecords" >Delete</el-button>
          </el-tooltip>
        </div>
      </template>
      <template #default="scope">
        <p>{{ scope.row.placeName }}</p>
      <el-tooltip content="To this place" placement="top">
      <el-button type="success" :icon="MapLocation" @click="go_to_target_place(scope.row.latitude,scope.row.longitude)"></el-button>
      </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="timezone" label="Timezone"></el-table-column>
    <el-table-column prop="datetime_str" label="Last Time"></el-table-column>
  </el-table>
  <el-pagination
    :total="totalRecords"
    :page-size="pageSize"
    @current-change="handlePageChange"
  />
</template>
<style scoped>
.table_header{
  display: grid;
}

</style>

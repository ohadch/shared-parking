<template>
  <div class="card">
    <div class="card-content">
      {{ errorStr }}
      <vl-map v-if="!errorStr" :load-tiles-while-animating="true" :load-tiles-while-interacting="true"
              data-projection="EPSG:4326" style="height:700px">
        <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

        <vl-geoloc @update:position="geolocPosition = $event">
          <template v-if="currentPosition">
            <MapIcon id="current" :icon="require(`../../assets/location-icon.png`)" :coordinates="currentPosition" :scale="0.05"/>
          </template>
        </vl-geoloc>

        <MapIcon :id ="parkingSpot._id" :icon="require(`../../assets/parking-icon.png`)" v-for="parkingSpot in parkingSpots"
                 :coordinates="parkingSpot.coordinates" :key="parkingSpot._id"/>

        <vl-layer-tile id="osm">
          <vl-source-osm></vl-source-osm>
        </vl-layer-tile>
      </vl-map>
    </div>
  </div>
</template>

<script>

import {COORDINATES} from "@/consts";
import MapIcon from "@/components/map/MapIcon";
import {M_SET_LOCATION} from "@/store/mutations/location.mutations";
import { mapState } from "vuex";

export default {
  name: "Map",
  components: {
    MapIcon
  },
  props: {
    parkingSpots: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      gettingLocation: false,
      errorStr: null,
      zoom: COORDINATES.HOVEVEY_TSIYON.zoom,
      center: COORDINATES.HOVEVEY_TSIYON.coordinates,
      rotation: 0,
      geolocPosition: undefined,
    }
  },
  mounted() {
    //do we support geolocation
    if(!("geolocation" in navigator)) {
      this.errorStr = 'Geolocation is not available.';
      return;
    }

    this.gettingLocation = true;
    // get position
    navigator.geolocation.getCurrentPosition(pos => {
      this.gettingLocation = false;
      this.geolocPosition = [pos.coords.longitude, pos.coords.latitude];
      this.center = this.geolocPosition
      // this.geolocPosition = [pos.coords.latitude, pos.coords.longitude];
    }, err => {
      this.gettingLocation = false;
      this.errorStr = err.message;
    })
  },
  computed: {
    ...mapState("location", {
      currentPosition: "coordinates"
    })
  },
  methods: {
    onPointerMoved() {
      alert("moved")
    }
  },
  watch: {
    geolocPosition(oldCoordinates, newCoordinates) {
      this.$store.commit(`location/${M_SET_LOCATION}`, newCoordinates);
    }
  }
}
</script>
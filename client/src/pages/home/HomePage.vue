<template>
  <div id="home">
    <h1 class="header">Find Free Parking Spots In Your Area</h1>
    <v-facebook-login @login="onFacebookLogin" @logout="onLogout" app-id="225159979212918"></v-facebook-login>
    <b-button :loading="isLoading" v-if="canVacateParking" class="action-button" size="is-large" @click="onParkingVacated">Vacate Parking</b-button>
    <Map :parking-spots="freeParkingSpots"/>
  </div>
</template>

<script>
import Map from '@/components/map/Map.vue'
import VFacebookLogin from 'vue-facebook-login-component'

import { mapState } from "vuex";
import ApiService from "@/api";
import {M_ADD_PARKING_SPOT} from "@/store/mutations/parkingSpot.mutations";
import {A_FACEBOOK_LOG_IN, A_LOG_OUT} from "@/store/actions/user.actions";

export default {
  name: 'Home',
  components: {
    Map,
    VFacebookLogin
  },
  data() {
    return {
      isLoading: false
    }
  },
  async mounted() {
    const parkingSpots = await ApiService.parkingSpot.getAll();
    for (const parkingSpot of parkingSpots) {
      this.$store.commit(`parkingSpot/${M_ADD_PARKING_SPOT}`, parkingSpot)
    }
  },
  computed: {
    ...mapState("user", ["user"]),
    ...mapState("location", {
      currentLocationCoordinates: "coordinates",
    }),
    ...mapState("parkingSpot", {
      freeParkingSpots: "freeSpots",
    }),
    canVacateParking() {
      return this.user && this.currentLocationCoordinates && this.currentLocationCoordinates.length
    }
  },
  methods: {
    async onParkingVacated() {
      this.isLoading = true
      await ApiService.parkingSpot.create(this.currentLocationCoordinates)
      this.isLoading = false
    },
    onFacebookLogin(e) {
      this.$store.dispatch(`user/${A_FACEBOOK_LOG_IN}`, e.authResponse)
    },
    onLogout() {
      this.$store.dispatch(`user/${A_LOG_OUT}`)
    },
  }
}
</script>

<style scoped>
#home {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
h1 {
  font-size: 2em;
  font-weight: bold;
}
.action-button {
  margin: 10px;
}
</style>
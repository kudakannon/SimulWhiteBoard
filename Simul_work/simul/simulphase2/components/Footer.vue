<template>
  <b-navbar type="dark" variant="dark" fixed>
    <b-navbar-nav right>
      <b-nav-item to="/privacypolicy">Privacy Policy</b-nav-item>
      <b-nav-item to="/terms">Terms &amp; Conditions</b-nav-item>
      <b-nav-item to="/directorlogin" v-if="!isAuthenticated">Director Login</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: "Footer",
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
}
</script>

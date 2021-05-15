<template>
  <b-navbar type="dark" variant="dark" fixed>
    <b-navbar-nav right>
      <b-nav-item to="/">Home</b-nav-item>
      <b-nav-item to="/projects" v-if="isAuthenticated">Projects</b-nav-item>

      <b-nav-item-dropdown v-if="isAuthenticated" lazy>
        <b-dropdown-item to="/about">About</b-dropdown-item>
        <b-dropdown-item to="/profile" v-if="loggedInUser.userType != 'readAccess'">Profile</b-dropdown-item>
        <b-dropdown-item @click="logout">Logout</b-dropdown-item>
      </b-nav-item-dropdown>
      <template v-else>
        <b-nav-item to="/register">Register</b-nav-item>
        <b-nav-item to="/login">Login</b-nav-item>
        <b-nav-item-dropdown lazy>
        <b-dropdown-item to="/about">About</b-dropdown-item>
      </b-nav-item-dropdown>
      </template>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  methods: {
  async logout() {
    await this.$auth.logout();
  },
}
}
</script>
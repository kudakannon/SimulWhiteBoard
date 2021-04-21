<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Welcome back!</h2>
          <Login :accountType="user"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Notification from "~/components/Notification";
import Login from "~/components/Login";

export default {
  components: {
    Notification,
    Login
  },

  data() {
    return {
      user: "user",
    };
  },

  methods: {
    async login() {
      try {
        await this.$auth.loginWith("local", {
          data: {
            email: this.email,
            password: this.password
          }
        });

        this.$router.push("/");
      } catch (e) {
        this.error = e.response.data.message;
      }
    }
  }
};
</script>

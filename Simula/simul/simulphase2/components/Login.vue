<template>
  <div>
    <div v-if="loading"><Loading /></div>
    <div v-else>
      <Notification :message="error" v-if="error" />

      <form method="post" @submit.prevent="login">
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input type="email" class="input" name="email" v-model="email" required/>
          </div>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input
              type="password"
              class="input"
              name="password"
              v-model="password"
              required
            />
          </div>
        </div>
        <div class="control">
          <button type="submit" class="button is-dark is-fullwidth">
            Log In
          </button>
        </div>
      </form>

      <div
        v-if="accountType == 'user'"
        class="has-text-centered"
        style="margin-top: 20px"
      >
        <p>
          <nuxt-link to="/forgotpass">Forgot your password?</nuxt-link>
        </p>
        <!-- <p>
          Don't have an account? <nuxt-link to="/register">Register</nuxt-link>
        </p> -->
      </div>
      <div v-else class="has-text-centered" style="margin-top: 20px">
        <p>
          <nuxt-link to="/directorforgotpass">Forgot your password?</nuxt-link>
        </p>
        <!-- <p>
          Don't have a Director Account?
          <nuxt-link to="/directorregister">Register</nuxt-link>
        </p> -->
      </div>
    </div>
  </div>
</template>

<script>
import Notification from "~/components/Notification";
import Loading from "~/components/Loading";

export default {
  components: {
    Notification,
    Loading
  },

  data() {
    return {
      email: "",
      password: "",
      error: null,
      loading: false
    };
  },

  methods: {
    login() {
      this.loading = true;
      this.$auth
        .loginWith("local", {
          data: {
            email: this.email,
            password: this.password,
            userType: this.accountType
          }
          
        })
        .then(res => {
          this.$router.push("/");
        })
        .catch(err => {
          this.loading = false;
          this.error = err.message;
          
        });
    }
  },
  props: ["accountType"]
};
</script>

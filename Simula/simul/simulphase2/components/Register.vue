<template>
  <div>
    <div v-if="loading"><Loading /></div>
    <div v-else>
      <Notification :message="error" v-if="error" />

      <form method="post" @submit.prevent="register">
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input
              type="text"
              class="input"
              name="username"
              v-model="name"
              required
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Phone</label>
          <div class="control">
            <vue-tel-input v-model="phone" required></vue-tel-input>
          </div>
        </div>
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input
              type="email"
              class="input"
              name="email"
              v-model="email"
              required
            />
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
        <div class="field" v-if="accountType != 'director'">
          <label class="label">Director Email</label>
          <div class="control">
            <input
              type="text"
              class="input"
              name="directorEmail"
              v-model="directorEmail"
              required
            />
          </div>
        </div>
        <div class="control">
          <button type="submit" class="button is-dark is-fullwidth">
            Register
          </button>
        </div>
      </form>
      <div
        v-if="accountType == 'user'"
        class="has-text-centered"
        style="margin-top: 20px"
      >
        <p>
          Already have an account?
          <nuxt-link to="/login">Login</nuxt-link>
        </p>
      </div>
      <div v-else class="has-text-centered" style="margin-top: 20px">
        <p>
          Already have a Director Account?
          <nuxt-link to="/directorlogin">Login</nuxt-link>
        </p>
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
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      directorEmail: "",
      loading: false,
      error: null
    };
  },
  methods: {
    register() {
      this.loading = true;
      var userType = "";
      if (this.accountType == "director") {
        userType = "director";
      }
      this.$axios
        .post(`${userType}register`, {
          name: this.name,
          phone: this.phone,
          email: this.email,
          password: this.password,
          directorEmail: this.directorEmail
        })
        .then(res => {
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
              this.error = err.response.data.message;
            });
        })
        .catch(err => {
          this.loading = false;
          this.error = err.response.data.message;
        });
    }
  },
  props: ["accountType"]
};
</script>

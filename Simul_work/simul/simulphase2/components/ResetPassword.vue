<template>
  <div>
    <Notification :message="error" v-if="error" />

    <form method="post" @submit.prevent="login">
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input
            type="text"
            class="input"
            name="email"
            v-model="email"
            required
          />
        </div>
      </div>
      <div class="field">
        <label class="label">Temporary Password</label>
        <div class="control">
          <input
            type="password"
            class="input"
            name="password"
            v-model="oldPassword"
            required
          />
        </div>
      </div>
      <div class="field">
        <label class="label">New Password</label>
        <div class="control">
          <input
            type="password"
            class="input"
            name="password"
            v-model="newPassword"
            required
          />
        </div>
      </div>
      <div class="field">
        <label class="label">Confirm Password</label>
        <div class="control">
          <input
            type="password"
            class="input"
            name="password"
            v-model="confirmPassword"
            required
          />
        </div>
      </div>
      <div class="control">
        <button type="submit" class="button is-dark is-fullwidth">
          Reset Password
        </button>
        <div class="has-text-centered" style="margin-top: 20px">
          <p>
            <nuxt-link to="/terms">Terms &amp; Conditions</nuxt-link>
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Notification from "~/components/Notification";

export default {
  components: {
    Notification
  },
  data() {
    return {
      email: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      error: null
    };
  },

  methods: {
    async login() {
      if (this.newPassword !== this.confirmPassword) {
        this.error =
          "Please ensure your new password matches the confirmed password.";
      } else {
        var account = "";
        if (this.accountType == "director") {
          account = this.accountType;
        }
        this.$axios
          .post(`${account}resetpassword`, {
            email: this.email,
            oldPassword: this.oldPassword,
            password: this.confirmPassword
          })
          .then(res => {
            this.$auth
              .loginWith("local", {
                data: {
                  email: this.email,
                  password: this.confirmPassword,
                  userType: this.accountType
                }
              })
              .then(res => {
                this.$router.push("/");
              })
              .catch(err => {
                this.error = err.response.data.message;
              });
          })
          .catch(err => {
            this.error = err.response.data.message;
          });
      }
    }
  },
  props: ["accountType"]
};
</script>

<style></style>

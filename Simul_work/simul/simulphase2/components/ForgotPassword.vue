<template>
  <div>
    <Notification :message="error" v-if="error" />
    <h4 v-if="isSent" style="text-align: center;">
      Please check your email to reset your password
    </h4>
    <form method="post" @submit.prevent="submitForgot" v-if="!isSent">
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input type="email" class="input" name="email" v-model="email" required />
        </div>
      </div>
      <div class="control">
        <button type="submit" class="button is-dark is-fullwidth">
          Submit
        </button>
      </div>
    </form>
    <div class="has-text-centered" style="margin-top: 20px" v-if="!isSent">
      <p>
        Don't have an account? <nuxt-link to="/register">Register</nuxt-link>
      </p>
    </div>
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
      error: null,
      isSent: false
    };
  },

  methods: {
    async submitForgot() {
      try {
        var randomstring = Math.random()
          .toString(36)
          .slice(-8);
        this.error = null;
        if (this.accountType == "user") {
          this.$axios.post("forgotpassword", {
            email: this.email,
            password: randomstring
          })
          .then(res => {
              this.isSent = true;
          })
          .catch(err => {
              this.error = err.response.data.message;
          })
        } else {
          this.$axios.post("directorforgotpassword", {
            email: this.email,
            password: randomstring
          })
          .then(res => {
              this.isSent = true;
          })
          .catch(err => {
              this.error = err.response.data.message;
          })
        }
      } catch (e) {
        this.isSent = false;
        this.error = err.response.data.message;
      }
    }
  },
  props: ["accountType"]
};
</script>

<style></style>

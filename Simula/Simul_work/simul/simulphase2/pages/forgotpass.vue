<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Reset your Password!</h2>
          <ForgotPassword :accountType="user" />
          
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ForgotPassword from '~/components/ForgotPassword'

export default {
  components: {
    ForgotPassword
  },

  data() {
    return {
      user: 'user',
    }
  },

  methods: {
    async submitForgot() {
      try {
        var randomstring = Math.random()
          .toString(36)
          .slice(-8);
          this.error= null
          await this.$axios.post("forgotpassword", {
            email: this.email,
            password: randomstring
          });
          this.isSent = false;

        } catch (e) {
          this.isSent = true;
          this.error = e.response.data.message;
        }
    }
  }
}
</script>
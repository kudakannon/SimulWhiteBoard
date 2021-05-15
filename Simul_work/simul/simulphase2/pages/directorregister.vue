<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Register for a Director Account!</h2>
          <Register :accountType="user" />
          
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Register from '~/components/Register'

export default {
  components: {
    Register,
  },

  data() {
    return {
            name: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
            error: null,
            user: "director"
    }
  },

  methods: {
    async register() {
      try {
        await this.$axios.post('directorregister', {
          name: this.name,
          phone: this.phone,
          email: this.email,
          password: this.password,
        })

        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password,
            userType: "director"
          },
        })

        this.$router.push('/')
      } catch (e) {
        this.error = e.response.data.message
      }
    }
  }
}
</script>
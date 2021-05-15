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
      user: 'director',
    }
  },
}
</script>
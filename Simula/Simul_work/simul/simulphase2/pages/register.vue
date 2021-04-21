<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
        <h2 class="title has-text-centered">Register!</h2>
        <Register :accountType="user" />
      </div>
    </div>
    </div>
  </section>
</template>

<script>
import Register from "~/components/Register";

export default {
  components: {
    Register
  },
  data() {
    return {
      user: "user"
    };
  }
};
</script>

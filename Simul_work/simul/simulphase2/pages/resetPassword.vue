<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Create a New Password!</h2>
          <ResetPassword :accountType="user" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ResetPassword from "~/components/ResetPassword";

export default {
  components: {
    ResetPassword
  },
  data() {
    return {
      user: "user"
    };
  },
};
</script>

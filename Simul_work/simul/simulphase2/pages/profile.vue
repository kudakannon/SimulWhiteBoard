<template>
  <section class="section">
    <Profile />
  </section>
</template>

<script>
import Profile from "~/components/Profile";

export default {
  middleware: "auth",
  components: {
    Profile
  }
};
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Create Project</h2>
          <CreateProject />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CreateProject from "~/components/CreateProject";

export default {
  middleware: "auth",
  components: {
    CreateProject
  }
};
</script>

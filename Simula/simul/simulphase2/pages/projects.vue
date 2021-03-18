<template>
  <div class="projects">
    <h1>Projects</h1>
    <Projects />
  </div>
</template>

<script>
import Projects from "~/components/Projects";
export default {
  components: {
    Projects
  }
};
</script>
<style scoped>
.projects {
  margin: 40px;
}
</style>
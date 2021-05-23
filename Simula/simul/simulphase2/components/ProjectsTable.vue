<template>
  <div>
    <h4 class="project-title" v-if="projects.length > 0">{{ projectStatus }}</h4>
    <b-table
      :items="projects"
      :busy="isBusy"
      class="mt-3"
      outlined
      hover
      selectable
      @row-clicked="selected"
    >
      <template v-slot:table-busy>
        <Loading />
      </template>
    </b-table>
  </div>
</template>

<script>
import Loading from "~/components/Loading";

export default {
  components: {
    Loading
  },
  methods: {
    selected(item) {
      var newAddress = item.projectAddress;
      newAddress = newAddress.replace(/\s+/g, "-");
      const newRoute =
        "/whiteboard?project=" +
        item.projectID +
        "&address=" +
        newAddress;
      this.$router.push({ path: newRoute });
    }
  },
  props: ["projectStatus", "projects", "isBusy"]
};
</script>

<style>
.project-title {
    margin: 20px;
}</style>

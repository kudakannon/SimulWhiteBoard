<template>
  <div>
    <div class="projects-table">
      <div class="createProject">
        <nuxt-link
          to="/createproject"
          class="button is-dark is-fullwidth"
          v-if="loggedInUser.userType == 'director'"
          >Create Project</nuxt-link
        >
      </div>
      <h4 v-if="loggedInUser.userType != 'director' && currentProjects.length == 0">
        Projects will appear here when your architects have created projects.
      </h4>
      <h2
        v-if="loggedInUser.userType == 'director' && currentProjects.length == 0"
        class="h4 has-text-centered" id="no-projects"
      >
        No Projects!
      </h2>
      <ProjectsTable projectStatus="Current Projects" v-if="currentProjects.length > 0" :projects="currentProjects" :isBusy="isBusy" />
      <ProjectsTable projectStatus="Completed Projects" v-if="completedProjects.length > 0" :projects="completedProjects" :isBusy="isBusy" />
      <ProjectsTable projectStatus="Cancelled Projects" v-if="cancelledProjects.length > 0" :projects="cancelledProjects" :isBusy="isBusy" />
      <ProjectsTable projectStatus="Paused Projects" v-if="pausedProjects.length > 0" :projects="pausedProjects" :isBusy="isBusy" />
      
    </div>
  </div>
</template>

<script>
import Loading from "~/components/Loading";
import ProjectsTable from "~/components/ProjectsTable";
import { mapGetters } from "vuex";
export default {
  middleware: "auth",
  computed: {
    ...mapGetters(["loggedInUser"])
  },
  data() {
    return {
      isBusy: true,
      completedProjects: [],
      cancelledProjects: [],
      pausedProjects: [],
      currentProjects: [],
    };
  },
  components: {
    Loading,
    ProjectsTable
  },
  methods: {
    toggleBusy() {
      this.isBusy = !this.isBusy;
    }
  },
  created() {
    return this.$axios
      .get("projects")
      .then(res => {
        this.currentProjects = res.data.response.currentProjects;
        this.completedProjects = res.data.response.completedProjects;
        this.pausedProjects = res.data.response.pausedProjects;
        this.cancelledProjects = res.data.response.cancelledProjects;
        this.isBusy = false;
      })
      .catch(err => {
        this.error = err.response.data.message;
      });
  }
};
</script>

<style scoped>
.projects-table {
  display: inline-block;
  position: relative;
  height: 100%;
  width: 80%;
}
table.b-table[aria-busy="true"] {
  opacity: 0.6;
}
.btn {
  background-color: #de4442;
  border: none;
  color: white;
  padding: 12px 16px;
  font-size: 16px;
  cursor: pointer;
}
/* Darker background on mouse-over */
.btn:hover {
  background-color: #b62825;
}
.buttonClass {
  float: right;
}
#no-projects {
    margin: 20px;
}
</style>
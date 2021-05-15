<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2>Enter your address to access this project</h2>
          <form method="post" @submit.prevent="getAccess">
            <div class="field">
              <label class="label">Client Email</label>
              <div class="control">
                <input
                  type="email"
                  class="input"
                  name="email"
                  v-model="email"
                  required
                />
              </div>
            </div>

            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">
                Get Access
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      email: ""
    };
  },
  methods: {
    getAccess() {
      var searchTerms = window.location.search.split("?")[1];
      searchTerms = searchTerms.split("&");
      var projID = searchTerms[0].replace("project=", "");
      this.$auth.loginWith("local", {
        data: {
          projectID: projID,
          email: this.email,
          userType: "readAccess"
        }
      });
      this.$router.push("/projects");
    }
  }
};
</script>

<style></style>

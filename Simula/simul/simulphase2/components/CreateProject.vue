<template>
  <div>
    <Notification :message="error" v-if="error" />
    <template v-if="isBusy">
      <Loading />
    </template>
    <template v-else>
      <form method="post" @submit.prevent="createProject">
        <h4 class="headings">Client Information</h4>
        <!-- <div class="field">
          <label class="label">QUOD Director: {{loggedInUser.userName}}</label>
          <div class="control">
            <input
              type="text"
              class="input"
              name="director"
              placeholder="please fill if different"
              v-model="directorName"
            />
            
          </div>
          
        </div> -->
        <div class="field">
          <label class="label">Company Name</label>
          <div class="control">
            <input
              type="text"
              class="input"
              name="companyName"
              placeholder="Client Company Name"
              v-model="companyName"
              required
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Project Address</label>
          <div class="control">
            <input
              type="text"
              class="input"
              name="address"
              placeholder="Project Address"
              v-model="projectAddress"
              required
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Projected Completion Date</label>
          <div class="control">
            <input
              type="date"
              class="input"
              name="date"
              v-model="completionDate"
              required
            />
          </div>
        </div>
        <!-- add roles -->
       
        <div class="field">
          <label class="label"
            >Please add/edit roles of development to suit your project</label
          >
          <b-button
            class="addRoleBtn"
            @click="addRoleFn()"
            variant="outline-success"
            >+</b-button
          >
           <table>
             <tr>
                <div class="stages" v-for="(item, idx) in roles" :key="(item, idx)">
                  <th>
                  <div class="flex">
                    <input
                      type="text"
                      class="input"
                      name="roleName"
                      :id="idx"
                      v-model="item.name"
                      required
                    />
                  </div>
                  </th>
                  <th>
                  <div class="flex">
                    <input
                      type="number"
                      class="input"
                      name="roleWeight"
                      :id="idx"
                      v-model="item.weight"
                      required
                    />
                  </div>
                  </th>
                  <th>
                  <b-button
                  class="addRoleBtn"
                  @click="removeRoleFn(item.roleNo)"
                  variant="outline-danger"
                  >-</b-button>
                  </th>
              </div>
             </tr>
            </table>
        </div>
        <!-- add stages -->
        <div class="field">
          <label class="label"
            >Please add/edit stages of development to suit your project</label
          >
          <b-button
            class="addStageBtn"
            @click="addStageFn()"
            v-if="stages.length < 8"
            variant="outline-success"
            >+</b-button
          >
          <b-button
            class="addStageBtn"
            @click="removeStageFn()"
            v-if="stages.length > 1"
            variant="outline-danger"
            >-</b-button
          >
          <div class="stages" v-for="(item, idx) in stages" :key="(item, idx)">
            <div class="flex">
              <input
                type="text"
                class="input"
                name="stageName"
                :id="idx"
                v-model="item.name"
                required
              />
            </div>
          </div>
        </div>


        <div class="control">
          <button type="submit" class="button is-dark is-fullwidth">
            Create Project
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import Notification from "~/components/Notification";
import Loading from "~/components/Loading";
import { mapGetters } from "vuex";



export default {
  components: {
    Notification,
    Loading,
  },
  computed: {
    ...mapGetters(["loggedInUser"])
  },
  data() {
    
    return {
      directorName: "",
      projectAddress: "",
      companyName: "",
      completionDate: "",
      error: null,
      isBusy: false,
      
      placeholders: [
        "PHASE 2: CONCEPTUAL SKETCH DESIGN",
        "PHASE 3: DESIGN DEVELOPMENT",
        "PHASE 4: DEVELOPMENT APPLICATION",
        "PHASE 5: BUILDING APPROVAL",
        "PHASE 6: CONSTRUCTION DETAILING",
        "PHASE 7: CONTRACT SELECTION",
        "PHASE 8: CONTRACT ADMINISTRATION"
      ],
      stages: [{ name: "PHASE 1: PRE-DESIGN" }],
      numRoles: 0,
      roles: [{ name: "Role 0", weight: "1", roleNo: "1"}],
      
    };
  },
  
  methods: {
    async createProject() {
      this.isBusy = true;
      var clientAccount;
      var project;
      var randomstring = Math.random()
        .toString(36)
        .slice(-8);
      project = await this.$axios.post("createproject", {
        projectAddress: this.projectAddress,
        completionDate: this.completionDate,
        companyName: this.companyName,
        email: this.loggedInUser.email,
        password: this.loggedInUser.password,
        userID: this.loggedInUser.userID
      });
      // ADD STAGES OF DEVELOPMENT
      for(var i = 0; i<this.stages.length; i++){
        for(var j = 0; j<this.stages.length; j++){
          if((this.stages[i].name == this.stages[j].name)&&(i!=j)){
            this.stages.splice(j,1);
          }
        }
      }
        try {
          
          await this.$axios.post("addStages", {
            projectID: project.data.projectID,
            stages: this.stages
          });
          this.$router.push("/projects");
        } catch (e) {
          this.error = e.response.data.message;
        }
    
    //  ADD ROLES OF DEVELOPMENT
      for(var i = 0; i<this.roles.length; i++){
        for(var j = 0; j<this.roles.length; j++){
          if((this.roles[i].name == this.roles[j].name)&&(i!=j)){
            this.roles.splice(j,1);
          }

        }
      }
      for(var i = 0; i<this.roles.length;i++){
            try {
          await this.$axios.post("addRoles", {
            projectID: project.data.projectID,
            roleName: this.roles[i].name,
            roleWeight: this.roles[i].weight
          });
          this.$router.push("/projects");
        } catch (e) {
          this.error = e.response.data.message;
        }
      }
      
        
      
      
      
    },
    addStageFn() {
      this.stages.push({ name: this.placeholders[this.stages.length - 1] });
    },
    removeStageFn() {
      this.stages.splice(this.stages.length - 1, 1);
    },
    addRoleFn() {
      this.numRoles++;
      this.roles.push({ name: "Role " + this.numRoles , weight: "1",  roleNo: this.roles.length-1});
    },
    removeRoleFn(r) {
      var rn = -1;
      console.log(r);
      for(var j = 0; j<this.roles.length; j++){
        if(this.roles[j].roleNo == r)
        rn = j
        
      }
      this.roles.splice(rn, 1);
    }

   
  }
};
</script>

<style scoped>
.flex {
  display: flex;
  padding-top: 5px;
}
.addStageBtn {
  font-weight: bold;
  width: 49%;
}

.headings {
  padding: 20px 0px 20px 0px;
}
</style>

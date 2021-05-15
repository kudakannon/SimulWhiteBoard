<template>
  <div>

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
        <!-- addcolabs -->
   <!-- <div class="field">
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
                      name="userName"
                      :id="idx"
                      v-model="item.userEmail"
                      required
                    />
                  </div>
                  </th>
                  <th>
                  <div class="flex">
                    <input
                      type="text"
                      class="input"
                      name="roleAssignment"
                      :id="idx"
                      v-model="item.roleAssignment"
                      required
                    />
                  </div>
                  </th>
                  <th>
                  <b-button
                  class="addRoleBtn"
                  @click="removeUserFn(item.userNo)"
                  variant="outline-danger"
                  >-</b-button>
                  </th>
              </div>
             </tr>
            </table>
        </div> -->

        <!-- add stages -->
        <!-- <div class="field">
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
        </div> -->
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
  computed:{
    ...mapGetters(["loggedInUser"])
  },
  data(){
    return{
      directorID: "",
      projectID: "",
      error: null,
      isBusy: false,
      roles: [{name: "", weight: "", rolNo: ""}],
      colabs: [{email: "", role: "", id: ""}],
      stages: [{name: ""}],
      placeholders: [
        "PHASE 2: CONCEPTUAL SKETCH DESIGN",
        "PHASE 3: DESIGN DEVELOPMENT",
        "PHASE 4: DEVELOPMENT APPLICATION",
        "PHASE 5: BUILDING APPROVAL",
        "PHASE 6: CONSTRUCTION DETAILING",
        "PHASE 7: CONTRACT SELECTION",
        "PHASE 8: CONTRACT ADMINISTRATION"
        ]
      
    };
  },
  methods:{
    async updateProject(){

    },
    addRoleFn(){

    },
    removeRoleFn(){

    },
    addColab(){

    },
    removeColab(){

    },
    addStage(){

    },
    removeStage(){

    },
    completeProj() {
      this.$axios
        .post("completeproject", {
          projectID: this.items.projectID
        })
        .then(res => {
          this.$router.push("/projects");
        })
        .catch(err => {
          console.log(err);
        });
    },
    closeProj() {
      this.$axios
        .post("closeproject", {
          projectID: this.items.projectID
        })
        .then(res => {
          this.$router.push("/projects");
        })
        .catch(err => {
          console.log(err);
        });
    },
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

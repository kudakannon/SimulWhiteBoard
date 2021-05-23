<template>
<form method="post" @submit.prevent="updateProject">
<section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Project Settings</h2>

        <!-- ADD ROLES -->
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
                <div class="stages"  v-for="(item, idx) in roles" :key="(item, idx)"  >
                  <div  v-if="item.name!=null">
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
                  
              </div>
             </tr>
            </table>
        </div>

        <!-- ADD Colaborators -->
         <div class="field">
          <label class="label"
            >Assign users to roles or add users</label
          >
          <b-button
            class="addUserBtn"
            @click="addUserFn()"
            variant="outline-success"
            >+</b-button
          >
           <table>
             <tr>
                <div class="stages" v-for="(item, idx) in colabs" :key="(item, idx)">
                  <th>
                  <div class="flex">
                    <input
                      type="email"
                      class="input"
                      name="colabName"
                      :id="idx"
                      v-model="item.email"
                      required
                    />
                  </div>
                  </th>
                  <th>
                  <div class="flex">
                    <select id="rolesList" name = "roleList" list = "roleList" >
                        <option value="role"  :id="idx" v-for ="(itm,idx) in roles" :key="(itm,idx)" >{{itm.name}}</option>
                    </select>
                  </div>
                  </th>
                  <th>
                  <b-button
                  class="addUserBtn"
                  @click="removeUserFn(item.colabNo)"
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
            Save
          </button>
        </div>
        </div>
      </div>
    </div>
  </section>


</form>
  
</template>

<script>
import ViewProject from "~/components/ViewProject";
import { mapGetters } from "vuex";
import { ButtonGroupPlugin } from "bootstrap-vue";
import { ButtonPlugin } from "bootstrap-vue";
import { LinkPlugin } from "bootstrap-vue";
import Loading from "~/components/Loading";
import Pinterest from "~/components/Pinterest";
import S3FileUpload from "~/components/S3FileUpload";
import ContactInformation from "~/components/ContactInformation";
import MutateProject from "~/components/MutateProject";
import Stages from "~/components/Stages";
import ForgotPassword from '../components/ForgotPassword.vue';




export default {
  middleware: "auth",
  components: {  
    ViewProject,
    ButtonGroupPlugin,
    ButtonPlugin,
    Pinterest,
    S3FileUpload,
    ContactInformation,
    LinkPlugin,
    MutateProject,
    Stages,
    ForgotPassword
  },
    data() {
    return {
      isBusy: true,
      items: {},
      stageInfo: [],
      users: [],
      Commentable: false,
      Editable: false,
      UploadBoards: false,
      StagesBoolean: true,
      directorID: "",     
      projectID: "",
      roles: [{name: "", weight: "", rolNo: ""}],
      numRoles:0,
      colabs: [{email: "exampleuser@email.com", role: "", weight: "", id: ""}],
      numColabs:0,
      stages: [{ name: "PHASE 1: PRE-DESIGN" }],
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
  computed:{
           ...mapGetters(["loggedInUser"]),
    btnStates() {
      return this.buttons.map(btn => btn.state );
    }
  },
  methods:{
   addRoleFn(){
      this.numRoles++;
      this.roles.push({ name: "Role " + this.numRoles , weight: "1",  roleNo: this.roles.length-1});
    },
    ///remove roles
   removeRoleFn(r) {
      var rn = -1;

      for(var j = 0; j<this.roles.length; j++){
        if(this.roles[j].roleNo == r)
        rn = j
        
      }
      this.roles[rn].name = null;
    },
    addUserFn(){
      this.numColabs++;
      this.colabs.push({ email: "User " + this.numColabs , roles: "1",  colabNo: this.colabs.length-1});
    },
    ///remove Users
    removeUserFn(r) {
      var rn = -1;

      for(var j = 0; j<this.colabs.length; j++){
        if(this.colabs[j].colabNo == r)
        this.colabs[rn].email =null;
        
      }
      this.colabs.splice(rn, 1);
    },
    addStageFn() {
      this.stages.push({ name: this.placeholders[this.stages.length - 1] });
    },
    removeStageFn() {
      this.stages.splice(this.stages.length - 1, 1);
    },
    async updateProject(){
      this.updateRole();
      this.updateColabs()
    },

    async updateRole(){
      const updateRoles = await this.$axios.get("getroles", {projectID: this.$route.query.project});
        if(!updateRoles.error){
          for(var i  = 0; i < this.roles.length;i++){
            for(var j = 0; j< this.roles.length; j++){
              if(this.roles[i].name==this.roles[j].name && i != j){
                this.roles[j].name=null;
              }
            }
          }
          for(var i = 0; i< this.roles.length;i++){
            if(this.roles[i].name == null && updateRoles.data[i] != undefined){
              this.$axios.delete("removeRoles", {
                projectID: this.$route.query.project,
                oldName: updateRoles.data[i].userRole,
                oldWeight: updateRoles.data[i].roleWeight
              })
            }
            else if(this.roles[i].name != null && updateRoles.data[i] == undefined){
              this.$axios.post("addRoles", {
                projectID: this.$route.query.project,
                  roleName: this.roles[i].name,
                  roleWeight: this.roles[i].weight
                });
            }
              else if(this.roles[i].name != null && updateRoles.data[i] != undefined && this.roles[i].name != updateRoles.data[i].userRole){
                this.$axios.post("updateroles", {
                  projectID: this.$route.query.project,
                    oldName: updateRoles.data[i].userRole, 
                    newName: this.roles[i].name, 
                    oldWeight: updateRoles.data[i].roleWeight, 
                    newWeight: this.roles[i].weight
                })
                .catch(err => {
                  this.error = err.response.data.message;
                });
        }
                 
      }        
     }
            
  
    },
    async updateColabs(){
      const updateColabs = await this.$axios.get("getcolabs", {projectID: 1});
        if(!updateColabs.error){
          console.log(updateColabs.data);
          console.log(this.colabs);
          for(var i  = 0; i < this.colabs.length;i++){
            for(var j = 0; j< this.colabs.length; j++){
              if((this.colabs[i].email==this.colabs[j].email&& this.colabs[i].role==this.colabs[j].role) && i != j){
                this.colabs[j].email=null;
              }
            }
          }
          for(var i = 0; i< this.colabs.length;i++){
            if(this.colabs[i].email == null && updateColabs.data[i] != undefined){
              this.$axios.delete("removeColabs", {
                projectID: this.$route.query.project,
                oldEmail: updateColabs.data[i].userEmail,
                oldRole: updateColabs.data[i].userRole
              })
            }
            else if(this.colabs[i].email != null && updateColabs.data[i] == undefined){
              
              var username = this.colabs[i].email.toString();
              var idxusername = username.indexOf("@");
              
              this.$axios.post("addcolabs", {
                projectID: this.$route.query.project,
                userName: username.slice(0, idxusername),
                  userEmail: this.colabs[i].email,
                  userRole: this.roles[0].name
                  // roleWeight: this.colabs[i].role
                });
            }
            else if(this.colabs[i].email != null && updateColabs.data[i] != undefined && this.colabs[i].email != updateColabs.data[i].userEmail){
              
              this.$axios.post("updateColabs", {
                projectID: 1,
                  oldEmail: updateColabs.data[i].userEmail, 
                  newEmail: this.colabs[i].email, 
                  oldRole: updateColabs.data[i].userRole, 
                  newRole: this.colabs[i].role
              })
              .catch(err => {
                this.error = err.response.data.message;
              });
            }
                 
          }        
        }
            
  
    },    
   
  },
  async created(){
     // LOAD IN PROJECT ROLES///
    const resRole = await this.$axios.get("getroles", {projectID: 1});
    if (!resRole.error) {

      if (resRole.data.length>0){
        var projRole = resRole.data[0];
       this.roles.splice(0, 1);
      for(var i = 0; i<resRole.data.length;i++){
          this.roles.push({name: resRole.data[i].userRole, weight: resRole.data[i].roleWeight, roleNo: this.roles.length-1});
      }
      }
      
    }
    const resUser = await this.$axios.get("getcolabs", {projectID: this.projectID});
   
      if(!resUser.error){
          if(resUser.data.length>0){
            this.colabs.splice(0, 1);
            for(var i = 0; i<resUser.data.length;i++){
              
              this.colabs.push({email: resUser.data[i].userEmail, role: resUser.data[i].userRole, weight: resUser.data[i].roleWeight});
            }
          }
        
      }

    const resStage = await this.$axios.get("getstages", {projectAddress: 1});
    if(!resStage.error){
      if(resStage.data.length>0){
        for(var i = 1; i < resStage.data.length;i++){
          this.stages.push({name: resStage.data[i].stageName});
        }
      }
    }
  }
  
  
};
</script>

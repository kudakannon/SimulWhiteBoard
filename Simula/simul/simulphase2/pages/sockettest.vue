<template>
    <div>
        <button v-on:click="startSocket">test socket</button>
        <p id='message'>{{ message }}</p>
        <p>{{ sessionID }}</p>
    </div>
</template>

<script>
import { io } from 'socket.io-client'
import { mapGetters } from 'vuex'

export default ({
    middleware: "auth",
    computed: {
        ...mapGetters(["loggedInUser"])
    },
    components: {
        io
    },
    data() {
        return {
            message: "testing socket",
            sessionID: ""
        }
    },
    methods: {
        startSocket(sessionID) {
            var socket = io("http://localhost:10011", {query: {user: this.$auth.strategy.token.get(), projectID: 0}});
            socket.on("connect", () => {
                document.getElementById('message').innerHTML = "test complete";
            });
        },
        getSessionID() {
            this.$axios.post("socket", {projectID: 0}).then(res => {
                this.sessionID = res.data.sessionID;
                //app.startSocket(this.sessionID);
            }).catch(err => {
                //this.message = "failure";
            });
        }
    },
    created() {
        this.getSessionID();
        this.message = this.$auth.$storage.getCookies();
    }
})
</script>

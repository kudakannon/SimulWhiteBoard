<template>
    <div>
        <button v-on:click="startSocket">test socket</button>
        <p id='message'>{{ message }}</p>
        <p>{{ sessionID }}</p>
        <textarea id='info'></textarea>
        <button id='updateButton' v-on:click="updateInfo" disabled>update</button>
    </div>
</template>

<script>
import { io, Socket } from 'socket.io-client'
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
            sessionID: "",
            sock: null
        }
    },
    methods: {
        startSocket() {
            var socket = io("http://localhost:10011", {auth: {token: this.$auth.$storage.getUniversal("_token.local")}, query: {projectID: 0}});
            this.sock = socket;
            socket.on("connect", () => {
                this.message = "connected";
            });

            socket.on("loginSuccess", (sessionID) => {
                this.sessionID = sessionID;
                document.getElementById('updateButton').disabled = false;
            });

            socket.on("loginFailure", () => {
                this.sessionID = "no ID";
            });

            socket.on("update", (target, type, data) => {
                if (document.getElementById(target) != null) {
                    if (type == 'value') {
                        document.getElementById(target).value = data;
                    }
                }
            });

            socket.on("updateFail", () => {
                this.message = "update failed";
            });
        },
        updateInfo() {
            this.sock.emit("update", "info", "value", document.getElementById('info').value);
        }
    },
    created() {
        this.message = this.$auth.$storage.getUniversal("_token.local");
    }
})
</script>

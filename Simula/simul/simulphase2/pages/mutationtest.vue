<template>
    <div id="box" v-observer:subtree.attributes="handler"></div>
</template>
<script>
import {observer} from 'vue-mutation-observer'
export default {
    directives: {
        observer
    },
    methods: {
        handler(mutations) {
            console.log(mutations);
        }
    }
}
</script>
<style scoped>
    #box {
        height: 200px;
        width: 200px;
        resize: both;
        border-style: solid;
        overflow: scroll;
    }
</style>
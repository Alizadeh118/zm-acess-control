<template>
    <div>
        <!-- <keep-alive> -->
        <component :is="getThemeMode.layout"></component>
        <!-- </keep-alive> -->
    </div>
</template>

<script>
    import {mapGetters, mapActions} from "vuex";

    export default {
        components: {},
        data() {
            return {};
        },
        computed: {
            ...mapGetters(["getThemeMode"])
        },
        methods: {}
    };
</script>
<style lang="scss">
    .spinner-modal {
        margin: 0 20px 0 auto !important;

        .spinner-bubble {
            font-size: 4px;
        }
    }
</style>
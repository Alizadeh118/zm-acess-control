<template>
    <div>
        <router-view></router-view>

        <!-- <customizer></customizer> -->
    </div>
</template>


<script>
    import {mapGetters} from "vuex";

    export default {
        data() {
            return {};
        },
        computed: {
            ...mapGetters(["getThemeMode"]),
            themeName() {
                return this.getThemeMode.dark ? "dark-theme" : " ";
            },
            rtl() {
                return this.getThemeMode.rtl ? "rtl" : " ";
            }
        },
        metaInfo() {
            return {
                // if no subcomponents specify a metaInfo.title, this title will be used
                // title: "",
                // all titles will be injected into this template
                titleTemplate: "%s | " + this.$store.state.api.settings.company_name,
                bodyAttrs: {
                    class: [this.themeName, "text-left"]
                },
                htmlAttrs: {
                    dir: this.rtl
                }
            };
        },
        created() {
            this.$store.dispatch('getLogo')
            this.$store.dispatch('getBackground')
            this.$store.dispatch('getNames')
            // if (!this.$store.getters.isAdmin)
            //     this.$router.replace("/security")
        }
    };
</script>

<style>
</style>



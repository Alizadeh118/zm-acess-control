<template>
    <div class="main-header">
        <div>
            <div class="logo d-inline-block align-middle mx-36 w-auto">
                <img :src="$store.state.api.settings.logo" class="w-auto"/>
            </div>
            <span class="font-weight-bold text-primary">{{ $store.state.api.settings.company_name }}</span>
        </div>

        <div @click="sideBarToggle" class="menu-toggle" v-if="0">
            <div></div>
            <div></div>
            <div></div>
        </div>


        <div class="header-part-right pr-3">

            <template v-if="0">
                <span v-if="$store.state.api.user">{{$store.state.api.user.userName}}</span>
                <router-link tag="i" class="i-Business-Man header-icon" to="/profile"></router-link>
            </template>


            <i
                    class="i-Full-Screen header-icon d-none d-sm-inline-block"
                    @click="handleFullScreen"
                    v-b-tooltip
                    title="بزرگنمایی صفحه"
            ></i>

            <i class="i-Power-2 header-icon" @click="logoutUser" title="خروج" v-b-tooltip></i>

        </div>
        <!--    <search-component-->
        <!--      :isSearchOpen.sync="isSearchOpen"-->
        <!--      @closeSearch="toggleSearch"-->
        <!--    ></search-component>-->
    </div>

    <!-- header top menu entoLowerCased -->
</template>
<script>
    import Util from "@/utils";
    import Sidebar from "./Sidebar";
    // import searchComponent from "../common/search";
    import {isMobile} from "mobile-device-detect";
    import {mapGetters, mapActions} from "vuex";
    import {mixin as clickaway} from "vue-clickaway";

    export default {
        mixins: [clickaway],
        components: {
            Sidebar,
            // searchComponent
        },

        data() {
            return {
                isDisplay: true,

                isStyle: true,
                isSearchOpen: false,
                isMouseOnMegaMenu: true,
                isMegaMenuOpen: false
            };
        },
        mounted() {
            // document.addEventListener("click", this.closeMegaMenu);
        },
        computed: {
            ...mapGetters(["getSideBarToggleProperties"])
        },

        methods: {
            ...mapActions([
                "changeSecondarySidebarProperties",

                "changeSidebarProperties",
                "changeThemeMode",
                "logout"
            ]),

            // megaMenuToggle() {
            //   this.isMegaMenuOpen = false;

            //   console.log("work");
            // },

            handleFullScreen() {
                Util.toggleFullScreen();
            },
            logoutUser() {
                this.logout();

                this.$router.push("/login");
            },

            closeMegaMenu() {
                this.isMegaMenuOpen = false;
                // console.log(this.isMouseOnMegaMenu);
                // if (!this.isMouseOnMegaMenu) {
                //   this.isMegaMenuOpen = !this.isMegaMenuOpen;
                // }
            },
            toggleMegaMenu() {
                this.isMegaMenuOpen = !this.isMegaMenuOpen;
            },
            toggleSearch() {
                this.isSearchOpen = !this.isSearchOpen;
            },

            sideBarToggle(el) {
                if (
                    this.getSideBarToggleProperties.isSideNavOpen &&
                    this.getSideBarToggleProperties.isSecondarySideNavOpen &&
                    isMobile
                ) {
                    this.changeSidebarProperties();
                    this.changeSecondarySidebarProperties();
                } else if (
                    this.getSideBarToggleProperties.isSideNavOpen &&
                    this.getSideBarToggleProperties.isSecondarySideNavOpen
                ) {
                    this.changeSecondarySidebarProperties();
                } else if (this.getSideBarToggleProperties.isSideNavOpen) {
                    this.changeSidebarProperties();
                } else if (
                    !this.getSideBarToggleProperties.isSideNavOpen &&
                    !this.getSideBarToggleProperties.isSecondarySideNavOpen &&
                    !this.getSideBarToggleProperties.isActiveSecondarySideNav
                ) {
                    this.changeSidebarProperties();
                } else if (
                    !this.getSideBarToggleProperties.isSideNavOpen &&
                    !this.getSideBarToggleProperties.isSecondarySideNavOpen
                ) {
                    // console.log("4");

                    this.changeSidebarProperties();
                    this.changeSecondarySidebarProperties();
                    // console.log("4");
                }
            }
        }
    };
</script>
<style>
    .w-auto {
        width: auto !important;
    }
</style>



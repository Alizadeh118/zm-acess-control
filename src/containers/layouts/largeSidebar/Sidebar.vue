<template>
    <div
            class="side-content-wrap"
            @mouseenter="isMenuOver = true"
            @mouseleave="isMenuOver = false"
            @touchstart="isMenuOver = true"
    >
        <vue-perfect-scrollbar
                :settings="{ suppressScrollX: true, wheelPropagation: false }"
                :class="{ open: getSideBarToggleProperties.isSideNavOpen }"
                ref="myData"
                class="sidebar-left rtl-ps-none ps scroll"
        >
            <div>
                <ul class="navigation-left">
                    <li
                            @mouseenter="toggleSubMenu" @mouseleave="selectedParentMenu = null"
                            :class="{ active: selectedParentMenu == 'devices' }"
                            class="nav-item"
                            data-item="devices"
                    >
                        <router-link tag="a" class="nav-item-hold" to="/devices" active-class="text-primary">
                            <i class="nav-icon i-Double-Tap"></i>
                            <span class="nav-text">دستگاه‌ها</span>
                        </router-link>
                        <div class="triangle"></div>
                    </li>
                    <li
                            @mouseenter="toggleSubMenu" @mouseleave="selectedParentMenu = null"
                            :class="{ active: selectedParentMenu == 'employees' }"
                            class="nav-item"
                            data-item="employees"
                    >
                        <router-link tag="a" class="nav-item-hold" to="/employees" active-class="text-primary">
                            <i class="nav-icon i-Business-ManWoman"></i>
                            <span class="nav-text">کارمندان</span>
                        </router-link>
                        <div class="triangle"></div>
                    </li>
                    <li
                            @mouseenter="toggleSubMenu" @mouseleave="selectedParentMenu = null"
                            :class="{ active: selectedParentMenu == 'departments' }"
                            class="nav-item"
                            data-item="departments"
                    >
                        <router-link tag="a" class="nav-item-hold" to="/departments" active-class="text-primary">
                            <i class="nav-icon i-Building"></i>
                            <span class="nav-text">دپارتمان‌ها</span>
                        </router-link>
                        <div class="triangle"></div>
                    </li>
                    <li
                            @mouseenter="toggleSubMenu" @mouseleave="selectedParentMenu = null"
                            :class="{ active: selectedParentMenu == 'time-zones' }"
                            class="nav-item"
                            data-item="time-zones"
                    >
                        <router-link tag="a" class="nav-item-hold" to="/time-zones" active-class="text-primary">
                            <i class="nav-icon i-Over-Time"></i>
                            <span class="nav-text">مناطق زمانی</span>
                        </router-link>
                        <div class="triangle"></div>
                    </li>
                    <li
                            @mouseenter="toggleSubMenu" @mouseleave="selectedParentMenu = null"
                            :class="{ active: selectedParentMenu == 'access-levels' }"
                            class="nav-item"
                            data-item="access-levels"
                    >
                        <router-link tag="a" class="nav-item-hold" to="/access-levels" active-class="text-primary">
                            <i class="nav-icon i-Laptop-Secure"></i>
                            <span class="nav-text">دسترسی‌ها</span>
                        </router-link>
                        <div class="triangle"></div>
                    </li>
                    <li
                            @mouseenter="toggleSubMenu" @mouseleave="selectedParentMenu = null"
                            :class="{ active: selectedParentMenu == 'users' }"
                            class="nav-item"
                            data-item="users"
                    >
                        <router-link tag="a" class="nav-item-hold" to="/users" active-class="text-primary">
                            <i class="nav-icon i-Mens"></i>
                            <span class="nav-text">کاربران</span>
                        </router-link>
                        <div class="triangle"></div>
                    </li>
                </ul>
            </div>
        </vue-perfect-scrollbar>

        <div
                @click="removeOverlay()"
                class="sidebar-overlay"
                :class="{ open: getSideBarToggleProperties.isSecondarySideNavOpen }"
        ></div>
    </div>
    <!--=============== Left side End ================-->
</template>

<script>
    import Topnav from "./TopNav";
    import {isMobile} from "mobile-device-detect";

    import {mapGetters, mapActions} from "vuex";

    export default {
        components: {
            Topnav
        },

        data() {
            return {
                isDisplay: true,
                isMenuOver: false,
                isStyle: true,
                selectedParentMenu: "",
                isMobile
            };
        },
        mounted() {
            this.toggleSelectedParentMenu();
            window.addEventListener("resize", this.handleWindowResize);
            document.addEventListener("click", this.returnSelectedParentMenu);
            this.handleWindowResize();
        },

        beforeDestroy() {
            document.removeEventListener("click", this.returnSelectedParentMenu);
            window.removeEventListener("resize", this.handleWindowResize);
        },
        computed: {
            ...mapGetters(["getSideBarToggleProperties"])
        },

        methods: {
            ...mapActions([
                "changeSecondarySidebarProperties",
                "changeSecondarySidebarPropertiesViaMenuItem",
                "changeSecondarySidebarPropertiesViaOverlay",
                "changeSidebarProperties"
            ]),

            handleWindowResize() {
                //  console.log('not working is Mobile');
                if (window.innerWidth <= 1200) {
                    if (this.getSideBarToggleProperties.isSideNavOpen) {
                        this.changeSidebarProperties();
                    }
                    if (this.getSideBarToggleProperties.isSecondarySideNavOpen) {
                        this.changeSecondarySidebarProperties();
                    }
                } else {
                    if (!this.getSideBarToggleProperties.isSideNavOpen) {
                        this.changeSidebarProperties();
                    }
                }
            },
            toggleSelectedParentMenu() {
                const currentParentUrl = this.$route.path
                    .split("/")
                    .filter(x => x !== "")[1];

                if (currentParentUrl !== undefined && currentParentUrl !== null) {
                    this.selectedParentMenu = currentParentUrl.toLowerCase();
                } else {
                    this.selectedParentMenu = "dashboards";
                }
            },
            toggleSubMenu(e) {
                // let childrens = this.$refs.sidebarChild.children;
                let parent = e.target.dataset.item;

                this.selectedParentMenu = parent;

                // this.changeSecondarySidebarPropertiesViaMenuItem(true);
            },

            removeOverlay() {
                this.changeSecondarySidebarPropertiesViaOverlay();
                if (window.innerWidth <= 1200) {
                    this.changeSidebarProperties();
                }
                this.toggleSelectedParentMenu();
            },
            returnSelectedParentMenu() {
                if (!this.isMenuOver) {
                    this.toggleSelectedParentMenu();
                }
            },

            toggleSidebarDropdwon(event) {
                let dropdownMenus = this.$el.querySelectorAll(".dropdown-sidemenu.open");

                event.currentTarget.classList.toggle("open");

                dropdownMenus.forEach(dropdown => {
                    dropdown.classList.remove("open");
                });
            }
        }
    };
</script>

<style lang="" scoped>
</style>

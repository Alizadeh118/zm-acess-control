<template>
    <div
            class="side-content-wrap"
            @mouseenter="isMenuOver = true"
            @mouseleave="isMenuOver = false"
            @touchstart="isMenuOver = true"
    >
        <vue-perfect-scrollbar
                v-if="!$store.getters.isSecurity"
                :settings="{ suppressScrollX: true, wheelPropagation: false }"
                ref="myData"
                class="sidebar-left rtl-ps-none ps scroll open"
        >
            <div>
                <ul class="navigation-left">
                    <li
                            v-if="can('devices')"
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
                            v-if="can('employees')"
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
                            v-if="can('departments')"
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
                            v-if="can('accesslevels')"
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
                            v-if="can('timezones')"
                            @mouseenter="toggleSubMenu" @mouseleave="selectedParentMenu = null"
                            :class="{ active: selectedParentMenu == 'time-zones' }"
                            class="nav-item"
                            data-item="time-zones"
                    >
                        <router-link tag="a" class="nav-item-hold" to="/time-zones" active-class="text-primary">
                            <i class="nav-icon i-Over-Time"></i>
                            <span class="nav-text">محدوده زمانی</span>
                        </router-link>
                        <div class="triangle"></div>
                    </li>
                    <li
                            v-if="can('users')"
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
                    <li
                            v-if="can('report')"
                            @mouseenter="toggleSubMenu" @mouseleave="selectedParentMenu = null"
                            :class="{ active: selectedParentMenu == 'report' }"
                            class="nav-item"
                            data-item="report"
                    >
                        <router-link tag="a" class="nav-item-hold" to="/report" active-class="text-primary">
                            <i class="nav-icon i-File-Horizontal-Text"></i>
                            <span class="nav-text">گزارش</span>
                        </router-link>
                        <div class="triangle"></div>
                    </li>
                    <li
                            v-if="can('events')"
                            @mouseenter="toggleSubMenu" @mouseleave="selectedParentMenu = null"
                            :class="{ active: selectedParentMenu == 'events' }"
                            class="nav-item"
                            data-item="events"
                    >
                        <router-link tag="a" class="nav-item-hold" to="/events" active-class="text-primary">
                            <i class="nav-icon i-Receipt-3"></i>
                            <span class="nav-text">رخدادها</span>
                        </router-link>
                        <div class="triangle"></div>
                    </li>
                    <li
                            v-if="can('settings')"
                            @mouseenter="toggleSubMenu" @mouseleave="selectedParentMenu = null"
                            :class="{ active: selectedParentMenu == 'settings' }"
                            class="nav-item"
                            data-item="settings"
                    >
                        <router-link tag="a" class="nav-item-hold" to="/settings" active-class="text-primary">
                            <i class="nav-icon i-Gears"></i>
                            <span class="nav-text">تنظیمات</span>
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

    import Roles from '@/roles'

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
            },

            can(page){
                return this.$store.state.api.user && (this.$store.state.api.user.roles.includes(Roles.admin) || this.$store.state.api.user.roles.includes(Roles[page]))
            }
        }
    };
</script>

<style lang="" scoped>
</style>

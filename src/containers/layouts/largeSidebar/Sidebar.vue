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
                            @mouseenter="toggleSubMenu"
                            :class="{ active: selectedParentMenu == 'devices' }"
                            class="nav-item"
                            data-item="devices"
                    >
                        <a class="nav-item-hold" href="#">
                            <i class="nav-icon i-Double-Tap"></i>
                            <span class="nav-text">دستگاه‌ها</span>
                        </a>
                        <div class="triangle"></div>
                    </li>
                    <li
                            @mouseenter="toggleSubMenu"
                            :class="{ active: selectedParentMenu == 'personnel' }"
                            class="nav-item"
                            data-item="personnel"
                    >
                        <a class="nav-item-hold" href="#">
                            <i class="nav-icon i-Business-ManWoman"></i>
                            <span class="nav-text">کارمندان</span>
                        </a>
                        <div class="triangle"></div>
                    </li>
                    <li
                            @mouseenter="toggleSubMenu"
                            :class="{ active: selectedParentMenu == 'access-control' }"
                            class="nav-item"
                            data-item="access-control"
                    >
                        <a class="nav-item-hold" href="#">
                            <i class="nav-icon i-Laptop-Secure"></i>
                            <span class="nav-text">کنترل دسترسی</span>
                        </a>
                        <div class="triangle"></div>
                    </li>
                </ul>
            </div>
        </vue-perfect-scrollbar>

        <vue-perfect-scrollbar
                :class="{ open: getSideBarToggleProperties.isSecondarySideNavOpen }"
                :settings="{ suppressScrollX: true, wheelPropagation: false }"
                class="sidebar-left-secondary ps rtl-ps-none"
        >
            <div ref="sidebarChild">
                <!-- Submenu Dashboards -->

                <ul
                        class="childNav d-none"
                        data-parent="sessions"
                        :class="{ 'd-block': selectedParentMenu == 'devices' }"
                >
                    <li class="nav-item">
                        <router-link tag="a" class to="/devices">
                            <i class="nav-icon i-Double-Tap"></i>
                            <span class="item-name">دستگاه‌ها</span>
                        </router-link>
                    </li>
                </ul>
                <ul
                        class="childNav d-none"
                        data-parent="personnel"
                        :class="{ 'd-block': selectedParentMenu == 'personnel' }"
                >
                    <li class="nav-item">
                        <router-link tag="a" class to="/app/sessions/signIn">
                            <i class="nav-icon i-Building"></i>
                            <span class="item-name">دپارتمان</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link tag="a" class to="/employees">
                            <i class="nav-icon i-Business-ManWoman"></i>
                            <span class="item-name">کارمندان</span>
                        </router-link>
                    </li>
                </ul>
                <ul
                        class="childNav d-none"
                        data-parent="personnel"
                        :class="{ 'd-block': selectedParentMenu == 'access-control' }"
                >
                    <li class="nav-item">
                        <router-link tag="a" class to="/app/sessions/signIn">
                            <i class="nav-icon i-Over-Time"></i>
                            <span class="item-name">منطقه زمانی</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link tag="a" class to="/app/sessions/signUp">
                            <i class="nav-icon i-Jeep-2"></i>
                            <span class="item-name">تعطیلات</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link tag="a" class to="/app/sessions/signUp">
                            <i class="nav-icon i-Door"></i>
                            <span class="item-name">تنظیمات درب‌ها</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link tag="a" class to="/app/sessions/signUp">
                            <i class="nav-icon i-Duplicate-Layer"></i>
                            <span class="item-name">سطوح دسترسی</span>
                        </router-link>
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
                let childrens = this.$refs.sidebarChild.children;
                let parent = e.target.dataset.item;

                this.selectedParentMenu = parent;

                this.changeSecondarySidebarPropertiesViaMenuItem(true);
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

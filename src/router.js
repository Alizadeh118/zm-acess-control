import Vue from "vue";
import store from "./store";
// import {isMobile} from "mobile-device-detect";
import Router from "vue-router";
import NProgress from "nprogress";
import authenticate from "./auth/authenticate";

Vue.use(Router);

// create new router

const routes = [
    {
        path: "/",
        component: () => import("./views/app"), //webpackChunkName app
        beforeEnter: authenticate,
        redirect: "/devices",

        children: [
            {
                path: "/devices",
                component: () => import("./views/app/devices"),
            },
            {
                path: "/employees",
                component: () => import("./views/app/employees"),
            },
            {
                path: "/departments",
                component: () => import("./views/app/departments"),
            },
            {
                path: "/time-zones",
                component: () => import("./views/app/time-zones"),
            },
            {
                path: "/access-levels",
                component: () => import("./views/app/access-levels"),
            },
            {
                path: "/report",
                component: () => import("./views/app/report"),
            },
            {
                path: "/users",
                component: () => import("./views/app/users"),
            },
            {
                path: "/events",
                component: () => import("./views/app/events"),
            },
            {
                path: "/security",
                component: () => import("./views/app/security"),
            },
        ]
    },
    {
        path: "/login",
        component: () => import("./views/app/sessions/login"), //webpackChunkName app
        beforeEnter: function (to, from, next) {
            if (
                localStorage.getItem("user") != null &&
                localStorage.getItem("user").length > 0
            )
                next('/devices');
            else
                next();

        },
    },
    {
        path: "*",
        component: () => import("./views/app/notFound")
    }
];

const router = new Router({
    mode: "history",
    linkActiveClass: "open",
    routes,
    scrollBehavior(to, from, savedPosition) {
        return {x: 0, y: 0};
    }
});

// router.beforeEach((to, from, next) => {
//     // If this isn't an initial page load.
//     if (to.path) {
//         // Start the route progress bar.
//
//         NProgress.start();
//         NProgress.set(0.1);
//     }
//     next();
// });

router.afterEach(() => {
    // Remove initial loading
    const gullPreLoading = document.getElementById("loading_wrap");
    if (gullPreLoading) {
        gullPreLoading.style.display = "none";
    }
    // Complete the animation of the route progress bar.
    setTimeout(() => NProgress.done(), 500);
    // NProgress.done();
    // if (isMobile) {
    if (window.innerWidth <= 1200) {
        // console.log("mobile");
        store.dispatch("changeSidebarProperties");
        if (store.getters.getSideBarToggleProperties.isSecondarySideNavOpen) {
            store.dispatch("changeSecondarySidebarProperties");
        }

        if (store.getters.getCompactSideBarToggleProperties.isSideNavOpen) {
            store.dispatch("changeCompactSidebarProperties");
        }
    } else {
        if (store.getters.getSideBarToggleProperties.isSecondarySideNavOpen) {
            store.dispatch("changeSecondarySidebarProperties");
        }

        // store.state.sidebarToggleProperties.isSecondarySideNavOpen = false;
    }
});

export default router;

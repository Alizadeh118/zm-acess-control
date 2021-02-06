import Vue from "vue";
import store from "./store";
// import {isMobile} from "mobile-device-detect";
import Role from './roles';
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
                name: 'devices',
                path: "/devices",
                meta: { authorize: [Role.admin, Role.devices] },
                component: () => import("./views/app/devices"),
            },
            {
                name: 'employees',
                path: "/employees",
                meta: { authorize: [Role.admin, Role.employees] },
                component: () => import("./views/app/employees"),
            },
            {
                name: 'departments',
                path: "/departments",
                meta: { authorize: [Role.admin, Role.departments] },
                component: () => import("./views/app/departments"),
            },
            {
                name: 'timezones',
                path: "/time-zones",
                meta: { authorize: [Role.admin, Role.timezones] },
                component: () => import("./views/app/time-zones"),
            },
            {
                name: 'accesslevels',
                path: "/access-levels",
                meta: { authorize: [Role.admin, Role.accesslevels] },
                component: () => import("./views/app/access-levels"),
            },
            {
                name: 'report',
                path: "/report",
                meta: { authorize: [Role.admin, Role.report] },
                component: () => import("./views/app/report"),
            },
            {
                name: 'guests',
                path: "/guests",
                meta: { authorize: [Role.admin, Role.report, Role.security] },
                component: () => import("./views/app/guests"),
            },
            {
                name: 'admin',
                path: "/users",
                meta: { authorize: [Role.admin] },
                component: () => import("./views/app/users"),
            },
            {
                name: 'events',
                path: "/events",
                meta: { authorize: [Role.admin, Role.events] },
                component: () => import("./views/app/events"),
            },
            {
                name: 'security',
                path: "/security",
                meta: { authorize: [Role.admin, Role.security] },
                component: () => import("./views/app/security"),
            },
            {
                name: 'settings',
                path: "/settings",
                meta: { authorize: [Role.admin] },
                component: () => import("./views/app/settings"),
            },
            {
                name: 'icons',
                path: "/icons",
                component: () => import("./views/app/icons"),
            },
        ]
    },
    {
        path: "/login",
        component: () => import("./views/app/sessions/login"),
        beforeEnter: function (to, from, next) {
            if (store.state.api.user) {
                return next({path: '/devices'});
            }
            next()

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

import store from "../store";

export default (to, from, next) => {
    if (
        localStorage.getItem("user") != null &&
        localStorage.getItem("user").length > 0
    ) {
        if (store.getters.isAdmin && to.path === '/security')
            next('/devices');
        else if (!store.getters.isAdmin && to.path !== '/security')
            next('/security');
        next();
    } else {
        localStorage.removeItem("user");
        next("/login");
    }
};

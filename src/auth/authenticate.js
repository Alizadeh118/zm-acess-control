import store from "../store";
import Roles from "../roles";

export default (to, from, next) => {

    const {authorize} = to.meta;

    if (authorize) {
        if (!store.state.api.user) {
            // not logged in so redirect to login page with the return url
            return next({path: '/login'});
        }

        // check if route is restricted by role
        if (authorize.length && !authorize.filter(role => store.state.api.user.roles.includes(role)).length) {
            // role not authorised so redirect to home page
            const role = Object.entries(Roles).find(role => role[1] === store.state.api.user.roles[0])
            return next({name: role[0]});
        }
    }
    next();
};

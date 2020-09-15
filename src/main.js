// import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import VueRouter from "vue-router";
import GullKit from "./plugins/gull.kit";
// import "babel-polyfill";
// import es6Promise from "es6-promise";
// es6Promise.polyfill();
import store from "./store";
import Breadcumb from "./components/breadcumb";
// import firebase from "firebase/app";
// import "firebase/auth";
// import {firebaseSettings} from "@/data/config";
import i18n from "./lang/lang";

// import axios from 'axios';




Vue.component("breadcumb", Breadcumb);
// Vue.use(VueRouter);

Vue.use(GullKit);
// firebase.initializeApp(firebaseSettings);

Vue.config.productionTip = false;

Vue.mixin({
    methods: {
        capitalizeFirstLetter: str => str.charAt(0).toUpperCase() + str.slice(1),
        persian2english: s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)),
        english2persian: s => s.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]),
    }
});

new Vue({
    store,
    router,
    i18n,
    render: h => h(App)
}).$mount("#app");

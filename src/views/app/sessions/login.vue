<template>
    <div
            class="auth-layout-wrap"
            :style="{ backgroundImage: 'url(' + bgImage + ')' }"
    >
        <div class="auth-content">
            <div class="card o-hidden">
                <div class="row">
                    <div class="col-md-12">
                        <div class="p-4">
                            <div class="auth-logo text-center mb-20">
                                <img :src="logo"/>
                                <div class="text-primary">سامانه جامع مدیریت و کنترل تردد حافظ</div>
                            </div>
                            <b-form @submit.prevent="formSubmit" class="mt-5">
                                <b-form-group :label="$t('session.username')" class="text-12">
                                    <b-form-input
                                            class="form-control-rounded dir-ltr"
                                            type="text"
                                            v-model="username"
                                            email
                                            required
                                    ></b-form-input>
                                </b-form-group>

                                <b-form-group :label="$t('session.password')" class="text-12">
                                    <b-form-input
                                            class="form-control-rounded dir-ltr"
                                            type="password"
                                            v-model="password"
                                    ></b-form-input>
                                </b-form-group>

                                <div class="typo__p float-left" :class="{invisible: !loading}">
                                    <div class="spinner sm spinner-primary mt-1"></div>
                                </div>
                                <div class="text-danger mt-3" :class="{invisible: !error}">
                                    <small>نام کاربری یا کلمه عبور اشتباه است</small>
                                </div>
                                <b-button
                                        type="submit"
                                        tag="button"
                                        class="btn-rounded btn-block"
                                        variant="primary mt-2"
                                        :disabled="loading"
                                >
                                    {{ $t('session.signIn') }}
                                </b-button>

                            </b-form>

                            <div class="mt-3 text-center" v-if="0">
                                <router-link to="forgot" tag="a" class="text-muted">
                                    <u>{{ $t('session.forgot') }}</u>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        metaInfo: {
            // if no subcomponents specify a metaInfo.title, this title will be used
            title: "ورود"
        },
        data() {
            return {
                username: "",
                password: "",
                loading: false,
                error: false,
                bgImage: require("@/assets/images/bg.jpg"),
                logo: require("@/assets/images/logo.png"),
                signInImage: require("@/assets/images/photo-long-3.jpg")
            };
        },


        methods: {

            formSubmit() {
                this.loading = true;
                this.error = false;
                this.$store.dispatch('login', {
                    username: this.username,
                    password: this.password,
                })
                    .then(() => {
                        this.$router.push("/devices")
                    })
                    .catch(err => {
                        console.log(err);
                        this.error = true
                    })
                    .finally(() => this.loading = false)
            }

        },

    };
</script>

<style>
    .spinner.sm {
        height: 2em;
        width: 2em;
    }
</style>

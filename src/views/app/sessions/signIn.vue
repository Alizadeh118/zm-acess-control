<template>
  <div
    class="auth-layout-wrap"
    :style="{ backgroundImage: 'url(' + bgImage + ')' }"
  >
    <div class="auth-content">
      <div class="card o-hidden">
        <div class="row">
          <div class="col-md-6">
            <div class="p-4">
              <div class="auth-logo text-center mb-30">
                <img :src="logo" />
              </div>
              <h1 class="mb-3 text-18">{{ $t("session.signIn") }}</h1>
              <b-form @submit.prevent="formSubmit">
                <b-form-group :label="$t('session.username')" class="text-12">
                  <b-form-input
                    class="form-control-rounded"
                    type="text"
                    v-model="email"
                    email
                    required
                  ></b-form-input>
                </b-form-group>

                <b-form-group :label="$t('session.password')" class="text-12">
                  <b-form-input
                    class="form-control-rounded"
                    type="password"
                    v-model="password"
                  ></b-form-input>
                </b-form-group>

                <!-- <b-button block to="/" variant="primary btn-rounded mt-2"
                  >Sign In</b-button
                > -->
                <b-button
                  type="submit"
                  tag="button"
                  class="btn-rounded btn-block mt-2"
                  variant="primary mt-2"
                  :disabled="loading"
                >
                  {{ $t('session.signIn') }}
                </b-button>
                <div v-once class="typo__p" v-if="loading">
                  <div class="spinner sm spinner-primary mt-3"></div>
                </div>
                <b-button
                  to="signUp"
                  block
                  variant="primary mt-2"
                  class="btn-rounded"
                  >{{ $t('session.register') }}</b-button
                >
              </b-form>

              <div class="mt-3 text-center">
                <router-link to="forgot" tag="a" class="text-muted">
                  <u>{{ $t('session.forgot') }}</u>
                </router-link>
              </div>
            </div>
          </div>


            <b-col
            md="6"
            class="text-center"
            style="backgroundSize: cover;"
            :style="{ backgroundImage: 'url(' + signInImage + ')' }"
          >
              <div class="pr-3 auth-right">
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, alias dicta eligendi ex laborum magni rerum! Aliquam amet, exercitationem illo incidunt ipsa laboriosam libero molestias nam nisi quia quisquam, voluptate!</p>
              </div>
            </b-col>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "SignIn"
  },
  data() {
    return {
     email:"",
     password:"",
      bgImage: require("@/assets/images/bg.jpg"),
      logo: require("@/assets/images/logo.png"),
      signInImage: require("@/assets/images/photo-long-3.jpg")
    };
  },


  methods: {

    formSubmit() {

      console.log( "email :" + this.email + "password :" + this.password );
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

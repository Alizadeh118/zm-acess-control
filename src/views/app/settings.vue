<template>
    <div class="main-content">
        <breadcumb page="تنظیمات"/>
        <!-- <div class="wrapper"> -->
        <b-card class="mb-30">
            <b-form>
                <b-row>
                    <b-col cols="12" lg="6">
                        <b-form-group label="عنوان در منوی بالای صفحه">
                            <b-form-input
                                    type="text"
                                    required
                                    v-model="settings.company_name"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" lg="6">
                        <b-form-group label="عنوان فرم ورود">
                            <b-form-input
                                    type="text"
                                    required
                                    v-model="settings.app_name"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" lg="6">
                        <b-form-group label="تصویر لوگو">
                            <b-form-file v-model="logo" placeholder="تصویر لوگو را انتخاب کنید"
                                         accept="image/*"></b-form-file>
                        </b-form-group>
                        <b-img thumbnail fluid class="w-25" center
                               :src="logo ? logoURL : $store.state.api.settings.logo"></b-img>
                    </b-col>
                    <b-col cols="12" lg="6">
                        <b-form-group label="تصویر پس زمینه صفحه ورود">
                            <b-form-file v-model="background" placeholder="تصویر پس زمینه را انتخاب کنید"
                                         accept="image/*"></b-form-file>
                        </b-form-group>
                        <b-img thumbnail fluid class="w-25" center
                               :src="background ? backgroundURL : $store.state.api.settings.background"></b-img>
                    </b-col>
                    <b-col cols="12" class="text-center mt-4">
                        <div class="mb-3">
                            <div class="spinner-bubble spinner-bubble-sm spinner-bubble-primary spinner-modal ml-0"
                                 v-show="loading"></div>
                        </div>
                        <b-button variant="primary" @click="submit" :disabled="loading">
                            ذخیره تنظیمات
                        </b-button>
                    </b-col>
                </b-row>
            </b-form>
        </b-card>
    </div>
</template>

<script>
    export default {
        metaInfo() {
            return {
                title: "تنظیمات",
            }
        },
        data() {
            return {
                settings: {
                    app_name: '',
                    company_name: '',
                },
                logo: null,
                background: null,
                loading: false,
            };
        },
        computed: {
            backgroundURL() {
                return URL.createObjectURL(this.background)
            },
            logoURL() {
                return URL.createObjectURL(this.logo)
            }
        },
        methods: {
            submit() {
                this.loading = true
                let a, b, c;

                a = this.$store.dispatch('setNames', this.settings)

                if (this.logo) {
                    const formData = new FormData();
                    formData.append('file', this.logo);
                    b = this.$store.dispatch('setLogo', formData)
                }

                if (this.background) {
                    const formData = new FormData();
                    formData.append('file', this.background);
                    c = this.$store.dispatch('setBackground', formData)
                }

                Promise.all([a, b, c])
                    .then(() => {
                        this.background = null
                        this.logo = null
                        this.$bvToast.toast(`تنظیمات با موفقیت اعمال شد`, {
                            title: `تنظیمات`,
                            variant: 'success',
                            toaster: 'b-toaster-top-left'
                        });
                    })
                    .catch(() => {
                        this.$bvToast.toast(`خطایی در اعمال تنظیمات رخ داده است.`, {
                            title: `تنظیمات`,
                            variant: 'danger',
                            toaster: 'b-toaster-top-left'
                        });
                    })
                    .finally(() => this.loading = false)
            }
        },
        created() {
            this.$store.dispatch('getLogo')
            this.$store.dispatch('getBackground')
            this.$store.dispatch('getNames')
                .then(() => {
                    this.settings.app_name = this.$store.state.api.settings.app_name
                    this.settings.company_name = this.$store.state.api.settings.company_name
                })
        }
    };
</script>
<style>
    .custom-file-label {
        line-height: 2;
    }

    .custom-file-input ~ .custom-file-label::after {
        content: 'انتخاب';
        left: 0;
        right: auto;
        border-left: none;
        border-right: 1px solid #ced4da;
        border-radius: 0.25rem 0 0 0.25rem;
        line-height: 2;
        cursor: pointer;
    }
</style>

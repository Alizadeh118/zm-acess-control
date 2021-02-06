<template>
    <div class="main-content">
        <b-row>
            <b-col>
                <b-card>
                    <b-row>
                        <b-col class="box">
                            <h4 class="card-title">مهمان‌های در دسترس</h4>
                            <b-form-radio-group stacked v-model="employee"
                                                :options="employeeOptions"></b-form-radio-group>
                        </b-col>
                        <b-col cols="12" class="text-center mt-3">
                            <b-button variant="primary" class="px-5" v-b-modal.addGuest
                                      :disabled="!employee.ID">ورود مهمان
                            </b-button>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>

            <b-col>
                <b-card>
                    <b-row>
                        <b-col cols="12" class="box">
                            <h4 class="card-title">مهمان‌های وارد شده</h4>
                            <b-form-radio-group stacked v-model="guest"
                                                :options="guestOptions"></b-form-radio-group>
                        </b-col>
                        <b-col cols="12" class="text-center mt-3">
                            <b-button variant="danger" class="px-5" :disabled="loading.exitGuest || !guest" @click="exitGuest">
                                خروج مهمان
                            </b-button>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
        </b-row>

        <b-modal id="addGuest" title="ورود مهمان" size="xl" @ok.prevent="enterGuest">
            <ol>
                <li>
                    <div class="mb-1">{{ employee.Name + ' ' + employee.LastName }}</div>
                    <b-form>
                        <b-form-row class="mb-2" ref="form">
                            <b-col cols="4" xl>
                                <b-form-group>
                                    <b-form-input placeholder="نام" type="text"
                                                  v-model="guestsToAdd.Name"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col cols="4" xl>
                                <b-form-group>
                                    <b-form-input placeholder="نام خانوادگی" type="text"
                                                  v-model="guestsToAdd.FName"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col cols="4" xl>
                                <b-form-group>
                                    <b-form-input placeholder="کد ملی" type="text"
                                                  v-model="guestsToAdd.PassportID"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col cols="5" xl="3">
                                <b-form-group>
                                    <b-form-input placeholder="وسایل همراه" type="text"
                                                  v-model="guestsToAdd.Accessories"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col cols="7" xl="4">
                                <b-form-group>
                                    <b-form-input placeholder="علت مراجعه" type="text"
                                                  v-model="guestsToAdd.Reason"></b-form-input>
                                </b-form-group>
                            </b-col>

                        </b-form-row>
                    </b-form>
                </li>
            </ol>


            <template v-slot:modal-footer="{ ok, cancel }">
                <div class="spinner-modal d-flex align-items-center">
                    <div class="spinner-bubble spinner-bubble-primary m-0"
                         v-show="loading.enterGuest"></div>
                    <span class="ml-4 text-primary" v-show="loading.enterGuest">در حال بروزرسانی...</span>
                </div>
                <b-button variant="secondary" @click="cancel()" :disabled="loading.enterGuest">
                    انصراف
                </b-button>
                <b-button variant="primary" @click="ok()" :disabled="loading.enterGuest">
                    افزودن و ورود مهمان
                </b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>

    export default {
        metaInfo () {
            return {
                title: "سامانه حافظ",
            }
        },
        data () {
            return {
                loading: {
                    getEmployees: true,
                    enterGuest: false,
                    exitGuest: false,
                },
                employee: {},
                guest: null,
            }
        },
        computed: {
            employeeOptions () {
                return this.$store.state.api.employees.filter(employee =>
                    employee.Is_Guest && employee.Is_Available
                ).map(employee => ({
                    ...employee,
                    value: employee,
                    text: employee.Name + ' ' + employee.LastName,
                }))
            },
            guestOptions () {
                return this.$store.state.api.employees.filter(employee =>
                    employee.Is_Guest && !employee.Is_Available
                ).map(employee => ({
                    ...employee,
                    value: employee.ID,
                    text: employee.Name + ' ' + employee.LastName,
                }))
            },
            guestsToAdd () {
                return {
                    Employee_ID: this.employee.ID,
                    Name: '',
                    FName: '',
                    PassportID: '',
                    Accessories: '',
                    Reason: ''
                }
            },
        },
        methods: {
            async enterGuest () {
                this.loading.enterGuest = true

                await this.$store.dispatch('addGuest', {
                    ...this.guestsToAdd,
                    PassportID: this.persian2english(this.guestsToAdd.PassportID)
                })
                this.employee = {}
                this.$bvModal.hide('addGuest');
                this.loading.enterGuest = false
            },
            exitGuest () {
                this.loading.exitGuest = true
                this.$store.dispatch('exitGuest', this.guest)
                    .then(() => this.guest = null)
                    .finally(() => this.loading.exitGuest = false)
            },
        },
        created () {

            if ( !this.$store.state.api.employees.length )
                this.$store.dispatch('getEmployees')
                    .catch(e => {
                        console.log('Could not get employees', e);
                        this.$bvToast.toast(`دریافت لیست کارمندان با خطا همراه بود`, {
                            title: `لیست کارمندان`,
                            variant: 'danger',
                            toaster: 'b-toaster-top-left',
                            noAutoHide: true,
                        });
                    })
                    .finally(() => this.loading.getEmployees = false);


        }
    }
</script>
<style>
    .box {
        min-height: 30em;
    }

    .custom-control.custom-checkbox {
        margin-bottom: .7em;
    }
</style>

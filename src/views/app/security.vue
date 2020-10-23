<template>
    <div class="main-content">
        <b-row>
            <b-col>
                <b-card>
                    <b-row>
                        <b-col class="box">
                            <h4 class="card-title">کارت‌های موجود</h4>
                            <b-form-checkbox-group stacked v-model="employees"
                                                   :options="employeeOptions"></b-form-checkbox-group>
                        </b-col>
                        <b-col cols="auto">
                            <div class="border-left position-absolute h-100"></div>
                        </b-col>
                        <b-col class="box">
                            <h4 class="card-title">دسترسی‌های مهمان</h4>
                            <b-form-checkbox-group stacked v-model="accessLevels"
                                                   :options="accessLevelOptions"></b-form-checkbox-group>
                        </b-col>
                        <b-col cols="12" class="text-center mt-3">
                            <b-button variant="primary" class="px-5" v-b-modal.addGuest
                                      :disabled="!(employees.length && accessLevels.length)">ورود مهمان
                            </b-button>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>

            <b-col cols="4">
                <b-card>
                    <b-row>
                        <b-col cols="12" class="box">
                            <h4 class="card-title">دسترسی‌های مهمان</h4>
                            <b-form-checkbox-group stacked v-model="guests"
                                                   :options="guestOptions"></b-form-checkbox-group>
                        </b-col>
                        <b-col cols="12" class="text-center mt-3">
                            <b-button variant="danger" class="px-5" :disabled="!guests.length" @click="exitGuest">خروج
                                مهمان
                            </b-button>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
        </b-row>


        <b-modal id="addGuest" title="ورود مهمان" size="xl" @ok.prevent="enterGuest">
            <ol>
                <li v-for="(employee, i) in employees">
                    <div class="mb-1">{{ employee.Name + ' ' + employee.LastName }}</div>
                    <b-form>
                        <b-form-row class="mb-2" ref="form">
                            <b-col cols="4" xl>
                                <b-form-group>
                                    <b-form-input placeholder="نام" type="text"
                                                  v-model="guestsToAdd[i].Name"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col cols="4" xl>
                                <b-form-group>
                                    <b-form-input placeholder="نام خانوادگی" type="text"
                                                  v-model="guestsToAdd[i].FName"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col cols="4" xl>
                                <b-form-group>
                                    <b-form-input placeholder="کد ملی" type="text"
                                                  v-model="guestsToAdd[i].PassportID"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col cols="5" xl="3">
                                <b-form-group>
                                    <b-form-input placeholder="وسایل همراه" type="text"
                                                  v-model="guestsToAdd[i].Accessories"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col cols="7" xl="4">
                                <b-form-group>
                                    <b-form-input placeholder="علت مراجعه" type="text"
                                                  v-model="guestsToAdd[i].Reason"></b-form-input>
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
        metaInfo() {
            return {
                title: "سامانه حافظ",
            }
        },
        data() {
            return {
                guestsToAdd: [],
                loading: {
                    getAccessLevels: true,
                    getEmployees: true,
                    enterGuest: false,
                },
                employees: [],
                accessLevels: [],
                guests: [],
            };
        },
        computed: {
            employeeOptions() {
                return this.$store.state.api.employees.filter(employee =>
                    employee.Is_Guest && employee.Is_Available
                ).map(employee => ({
                    ...employee,
                    value: employee,
                    text: employee.Name + ' ' + employee.LastName,
                }))
            },
            accessLevelOptions() {
                return this.$store.state.api.accessLevels.filter(al =>
                    al.Is_Guest
                ).map(al => ({
                    ...al,
                    value: al.ID,
                    text: al.Name,
                }))
            },
            guestOptions() {
                return this.$store.state.api.employees.filter(employee =>
                    employee.Is_Guest && !employee.Is_Available
                ).map(employee => ({
                    ...employee,
                    value: employee.ID,
                    text: employee.Name + ' ' + employee.LastName,
                }))
            },
        },
        methods: {
            async enterGuest() {
                this.loading.enterGuest = true
                for (const guest of this.guestsToAdd)
                    await this.$store.dispatch('addGuest', {
                        ...guest,
                        PassportID: this.persian2english(guest.PassportID)
                    })

                await this.$store.dispatch('enterGuest', {
                    employee: this.employees.map(e => e.ID),
                    access: this.accessLevels,
                })
                this.$bvModal.hide('addEmployee');
                this.guestsToAdd = []
                this.loading.enterGuest = false
            },
            exitGuest() {
                this.$store.dispatch('exitGuest', {
                    employee: this.guests,
                })
            },
        },
        watch: {
            employees() {
                this.guestsToAdd = []
                for (let i = 0; i < this.employees.length; i++)
                    this.guestsToAdd.push({
                        Employee_ID: this.employees[i].ID,
                        Name: '',
                        FName: '',
                        PassportID: '',
                        Accessories: '',
                        Reason: '',
                    })
            }
        },
        created() {

            if (!this.$store.state.api.accessLevels.length)
                this.$store.dispatch('getAccessLevels')
                    .catch(e => {
                        console.log('Could not get accessLevels', e);
                        this.$bvToast.toast(`دریافت لیست سطوح دسترسی با خطا همراه بود`, {
                            title: `لیست سطوح دسترسی`,
                            variant: 'danger',
                            toaster: 'b-toaster-top-left',
                            noAutoHide: true,
                        });
                    })
                    .finally(() => this.loading.getAccessLevels = false);


            if (!this.$store.state.api.employees.length)
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
    };
</script>
<style>
    .box {
        min-height: 30em;
    }

    .custom-control.custom-checkbox {
        margin-bottom: .7em;
    }
</style>

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
                            <b-button variant="primary" class="px-5"
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
                            <b-button variant="danger" class="px-5" :disabled="!guests.length">خروج مهمان</b-button>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
        </b-row>
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
                loading: {
                    getAccessLevels: true,
                    getEmployees: true,
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
                    value: employee.ID,
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
                )
            },
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

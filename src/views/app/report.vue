<template>
    <div class="main-content">
        <breadcumb page="گزارش"/>
        <!-- <div class="wrapper"> -->
        <b-card class="mb-30">
            <vue-good-table
                    :columns="columns"
                    :line-numbers="false"
                    :rtl="true"
                    :search-options="{
                      enabled: true,
                      placeholder: 'جستجو'
                    }"
                    :sort-options="{
                      enabled: true,
                      initialSortBy: {field: 'ID', type: 'desc'}
                    }"
                    :pagination-options="{
                      enabled: false,
                      mode: 'records',
                      nextLabel: 'بعدی',
                      prevLabel: 'قبلی',
                      rowsPerPageLabel: 'ردیف در هر صفحه',
                      ofLabel: 'از',
                      pageLabel: 'صفحه', // for 'pages' mode
                      allLabel: 'همه',
                    }"
                    styleClass="tableOne vgt-table"
                    :rows="$store.state.api.report"
            >
                <div slot="emptystate" class="text-center py-2">
                    <span v-if="loading.getReport">در حال دریافت گزارش...</span>
                    <span v-else>گزارشی برای نمایش وجود ندارد</span>
                </div>

            </vue-good-table>
        </b-card>
    </div>
</template>

<script>

    export default {
        metaInfo(){
            return {
                title: "گزارش",
            }
        },
        data() {
            return {
                report: [],
                loading: {
                    removeReport: false,
                    getReport: true,
                },
                columns: [
                    {
                        label: 'ID',
                        field: 'ID',
                        type: 'number',
                        hidden: true,
                    },
                    {
                        label: "نوع",
                        field: "type",
                        formatFn: this.getPersianType
                    },
                    {
                        label: "کاربر",
                        field: "Employee_ID",
                        formatFn: this.getEmployee
                    },
                    {
                        label: "دستگاه",
                        field: "Device_ID",
                        formatFn: this.getDevice
                    },
                    {
                        label: "زمان",
                        field: "Time"
                    },
                ],
            };
        },
        methods: {
            getDevice(id){
                const device =  this.$store.state.api.devices.find(device=>device.ID === +id)
                if (device)
                    return device.Name
                return '-'
            },
            getEmployee(id){
                const employee = this.$store.state.api.employees.find(employee=>employee.ID === +id)
                if (employee)
                    return employee.Name + ' ' + employee.LastName
                return '-'
            },
            getPersianType(type){
                switch (type) {
                    case 'Fingerprint':
                        return 'اثر انگشت'
                    case 'Card':
                        return 'کارت'
                    case 'Password':
                        return 'رمز عبور'
                    default:
                        return type
                }
            },
            removeReport(report) {
                this.loading.removeReport = true;
                this.$store.dispatch('removeReport', report.ID)
                    .then(() => {
                        this.$bvToast.toast(`گزارش با موفقیت حذف شد`, {
                            title: `حذف گزارش`,
                            variant: 'success',
                            toaster: 'b-toaster-top-left'
                        });
                    })
                    .catch(() => {
                        this.$bvToast.toast(`حذف گزارش با خطا همراه بود`, {
                            title: `حذف گزارش`,
                            variant: 'danger',
                            toaster: 'b-toaster-top-left'
                        });
                    })
                    .finally(() => this.loading.removeReport = false)
            },
        },
        created() {
            this.$store.dispatch('getReport')
                .catch(e => {
                    console.log('Could not get report', e);
                    this.$bvToast.toast(`دریافت گزارش با خطا همراه بود`, {
                        title: `گزارش`,
                        variant: 'danger',
                        toaster: 'b-toaster-top-left',
                        noAutoHide: true,
                    });
                })
                .then(()=>{
                    if (!this.$store.state.api.devices.length)
                        this.$store.dispatch('getDevices')
                            .catch(e => {
                                console.log('Could not get devices', e);
                                this.$bvToast.toast(`دریافت لیست دستگاه‌ها با خطا همراه بود`, {
                                    title: `لیست دستگاه‌ها`,
                                    variant: 'danger',
                                    toaster: 'b-toaster-top-left',
                                    noAutoHide: true,
                                });
                            });

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
                            });
                })
                .finally(() => this.loading.getReport = false);
        }
    };
</script>

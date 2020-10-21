<template>
    <div class="main-content">
        <breadcumb page="گزارش"/>
        <!-- <div class="wrapper"> -->
        <b-card class="mb-30">
            <vue-good-table
                    mode="remote"
                    @on-page-change="onPageChange"
                    @on-per-page-change="onPerPageChange"
                    :totalRows="totalRecords"
                    :totalRecords="totalRecords"
                    :line-numbers="false"
                    :rtl="true"
                    :sort-options="{
                      enabled: false,
                    }"

                    :pagination-options="{
                      enabled: true,
                      dropdownAllowAll: false,
                      mode: 'records',
                      nextLabel: 'بعدی',
                      prevLabel: 'قبلی',
                      rowsPerPageLabel: 'ردیف در هر صفحه',
                      ofLabel: 'از',
                      pageLabel: 'صفحه', // for 'pages' mode
                      allLabel: 'همه',
                    }"
                    styleClass="tableOne vgt-table"
                    :columns="columns"
                    :rows="rows"
            >
                <div slot="table-actions" class="mb-4">
                    <b-button variant="primary" class="btn-rounded" v-b-modal.search
                    ><i class="i-Magnifi-Glass1 align-middle text-white mr-2"> </i>جستجو
                    </b-button>

                    <b-modal id="search" title="جستجو"
                             size="lg"
                             @ok.prevent="search" @hidden="onModalHidden">

                        <b-form>
                            <b-row>
                                <b-col cols="3">
                                    <b-form-group label="نوع">
                                        <treeselect :options="types" v-model="search.TypeID"
                                                    value-consists-of="LEAF_PRIORITY"
                                                    noOptionsText="گزینه‌ای وجود ندارد"
                                                    placeholder=""
                                                    :limit="6" :limitText="count => `+${count}`"
                                                    clearAllText="حذف همه گزینه‌ها"/>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="3">
                                    <b-form-group label="شناسه کاربر">
                                        <b-form-input v-model="search.BadgeNumber"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <b-form-group label="کاربر">
                                        <treeselect :options="employees"
                                                    value-consists-of="LEAF_PRIORITY"
                                                    noOptionsText="گزینه‌ای وجود ندارد"
                                                    placeholder=""
                                                    :limit="6" :limitText="count => `+${count}`"
                                                    clearAllText="حذف همه گزینه‌ها"/>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col>
                                    <b-form-group label="از تاریخ">
                                        <b-form-input readonly id="date_from" v-model="search.MinTime"></b-form-input>
                                        <date-picker element="date_from" v-model="search.MinTime"></date-picker>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <b-form-group label="تا تاریخ">
                                        <b-form-input readonly id="date_to" v-model="search.MaxTime"></b-form-input>
                                        <date-picker element="date_to" v-model="search.MaxTime"></date-picker>
                                    </b-form-group>
                                </b-col>
                            </b-row>


                        </b-form>
                        <template v-slot:modal-footer="{ ok, cancel }">
                            <div class="spinner-modal d-flex align-items-center">
                                <div class="spinner-bubble spinner-bubble-primary"
                                     v-show="loading.search"></div>
                                <span class="ml-4 text-primary" v-show="loading.search">دریافت داده‌ها...</span>
                            </div>
                            <b-button variant="secondary" @click="cancel()" :disabled="loading.search">
                                انصراف
                            </b-button>
                            <b-button variant="primary" @click="ok()" :disabled="loading.search">
                                جستجو
                            </b-button>
                        </template>
                    </b-modal>
                </div>
                <div slot="emptystate" class="text-center py-2">
                    <span v-if="isLoading">در حال دریافت گزارش...</span>
                    <span v-else>گزارشی برای نمایش وجود ندارد</span>
                </div>

            </vue-good-table>
        </b-card>
    </div>
</template>

<script>
    import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    export default {
        components: {
            datePicker: VuePersianDatetimePicker,
            Treeselect
        },
        metaInfo() {
            return {
                title: "گزارش",
            }
        },
        data() {
            return {
                search: {
                    BadgeNumber: '',
                    MinTime: '',
                    MaxTime: '',
                    TypeID: '',
                    deviceID: '',
                },
                report: [],
                loading: {
                    removeReport: false,
                    getReport: true,
                    search: false,
                },


                isLoading: false,
                columns: [
                    {
                        label: 'ID',
                        field: 'ID',
                        type: 'number',
                        // hidden: true,
                    },
                    {
                        label: "نوع",
                        field: "type",
                        formatFn: this.getPersianType,
                    },
                    {
                        label: "کاربر",
                        field: "Employee_ID",
                        formatFn: this.getEmployee,
                    },
                    {
                        label: "دستگاه",
                        field: "Device_ID",
                        formatFn: this.getDevice,
                    },
                    {
                        label: "زمان",
                        field: "Time_Persian",
                        tdClass: "dir-ltr",
                        formatFn: value => this.english2persian(value).replace('T', ' '),
                    },
                ],
                rows: [],
                totalRecords: 0,
                serverParams: {
                    page: 1,
                    perPage: 10
                }
            };
        },
        computed: {
            employees() {
                const departments = []
                for (const employee of this.$store.state.api.employees)
                    if (!departments.find(d => d.id === employee.Department_ID))
                        departments.push({
                            id: employee.Department_ID,
                            label: employee.Department_Name,
                            children: [],
                        });

                for (const employee of this.$store.state.api.employees) {
                    const department = departments.find(d => d.id === employee.Department_ID)
                    department.children.push({
                        id: employee.ID,
                        label: (employee.Name || '') + ' ' + (employee.LastName || ''),
                    })
                }

                return departments


                // return this.$store.state.api.employees.map(employee => {
                //     return {
                //         ...employee,
                //         id: employee.ID,
                //         label: (employee.Name || '') + ' ' + (employee.LastName || '')
                //     }
                // })
            },
            devices() {
                return this.$store.state.api.devices.map(device => {
                    return {
                        ...device,
                        id: device.ID,
                        label: device.Name
                    }
                })
            },
            types() {
                const r = []
                for (const [id, label] of Object.entries(this.$store.state.api.types))
                    r.push({
                        id,
                        label: this.getPersianType(label)
                    })
                return r
            }
        },
        methods: {
            getDevice(id) {
                const device = this.$store.state.api.devices.find(device => device.ID === +id)
                if (device)
                    return device.Name
                return '-'
            },
            getEmployee(id) {
                const employee = this.$store.state.api.employees.find(employee => employee.ID === +id)
                if (employee)
                    return employee.Name + ' ' + employee.LastName
                return '-'
            },
            getPersianType(type) {
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
            // search() {

            // },
            onModalHidden() {
            },

            updateParams(newProps) {
                this.serverParams = Object.assign({}, this.serverParams, newProps);
            },

            onPageChange(params) {
                this.updateParams({page: params.currentPage});
                this.loadItems();
            },

            onPerPageChange(params) {
                this.updateParams({perPage: params.currentPerPage});
                this.loadItems();
            },

            // load items is what brings back the rows from server
            loadItems() {
                this.$store.dispatch('getReport', this.serverParams)
                    .then(response => {
                        this.totalRecords = response.totalRecords;
                        this.rows = response.rows;
                    });
            }
        },
        created() {
            this.loadItems()
            // setTimeout(()=>this.loadItems(), 5000)
            return true;
            this.$store.dispatch('getReport', {
                perPage: this.perPage,
                pageNumber: this.pageNumber
            })
                .catch(e => {
                    console.log('Could not get report', e);
                    this.$bvToast.toast(`دریافت گزارش با خطا همراه بود`, {
                        title: `گزارش`,
                        variant: 'danger',
                        toaster: 'b-toaster-top-left',
                        noAutoHide: true,
                    });
                })
                .then(() => {
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

                    if (!this.$store.state.api.types.length)
                        this.$store.dispatch('getTypes')
                            .catch(e => {
                                console.log('Could not get types', e);
                                this.$bvToast.toast(`دریافت گونه‌های گزارش با خطا همراه بود`, {
                                    title: `لیست گونه‌های گزارش`,
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
<style>
    .vgt-global-search__actions {
        order: -1;
    }
</style>

<template>
    <div class="main-content">
        <breadcumb page="گزارش"/>
        <!-- <div class="wrapper"> -->
        <b-card class="mb-30">
            <vue-good-table
                    ref="report-table"
                    mode="remote"
                    @on-page-change="onPageChange"
                    @on-per-page-change="onPerPageChange"
                    :totalRows="totalRecords"
                    :isLoading.sync="isLoading"
                    :pagination-options="paginationOptions"
                    :sort-options="{
                      enabled: false,
                    }"
                    :rtl="true"
                    styleClass="tableOne vgt-table"
                    :rows="rows"
                    :columns="columns">
                <div slot="table-actions" class="mb-4">
                    <b-button variant="primary" class="btn-rounded" v-b-modal.search
                    ><i class="i-Magnifi-Glass1 align-middle text-white mr-2"> </i>جستجو
                    </b-button>

                    <b-modal id="search" title="جستجو" size="lg">
                        <b-form>
                            <b-row>
                                <b-col cols="6" xl="3">
                                    <b-form-group label="نام">
                                        <b-form-input v-model="filter.Name"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="6" xl="3">
                                    <b-form-group label="نام خانوادگی">
                                        <b-form-input v-model="filter.LastName"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="6" xl="3">
                                    <b-form-group label="شناسه کاربر">
                                        <b-form-input v-model="filter.BadgeNumber"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="6" xl="3">
                                    <b-form-group label="شناسه کارت">
                                        <b-form-input v-model="filter.CardNumber"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col cols="6" xl="3">
                                    <b-form-group label="نوع">
                                        <treeselect :options="types" v-model="filter.TypeID"
                                                    value-consists-of="LEAF_PRIORITY"
                                                    noOptionsText="گزینه‌ای وجود ندارد"
                                                    placeholder=""
                                                    :limit="6" :limitText="count => `+${count}`"
                                                    clearAllText="حذف همه گزینه‌ها"/>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="6" xl="3">
                                    <b-form-group label="دستگاه">
                                        <treeselect :options="devices" v-model="filter.deviceID"
                                                    value-consists-of="LEAF_PRIORITY"
                                                    noOptionsText="گزینه‌ای وجود ندارد"
                                                    placeholder=""
                                                    :limit="6" :limitText="count => `+${count}`"
                                                    clearAllText="حذف همه گزینه‌ها"/>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="6" xl="3">
                                    <b-form-group label="از تاریخ">
                                        <span class="date-picker-close-button" @click="filter.MinTime = ''" v-show="filter.MinTime">&#10005;</span>
                                        <b-form-input readonly id="date_from" v-model="filter.MinTime"
                                                      class="dir-ltr"></b-form-input>
                                        <date-picker element="date_from" v-model="filter.MinTime"
                                                     type="datetime"></date-picker>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="6" xl="3">
                                    <b-form-group label="تا تاریخ">
                                        <span class="date-picker-close-button" @click="filter.MaxTime = ''" v-show="filter.MaxTime">&#10005;</span>
                                        <b-form-input readonly id="date_to" v-model="filter.MaxTime"
                                                      class="dir-ltr"></b-form-input>
                                        <date-picker element="date_to" v-model="filter.MaxTime"
                                                     type="datetime"></date-picker>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </b-form>
                        <template v-slot:modal-footer="{ cancel }">
                            <div class="spinner-modal d-flex align-items-center">
                                <div class="spinner-bubble spinner-bubble-primary m-0"
                                     v-show="loading.search"></div>
                                <span class="ml-4 text-primary" v-show="loading.search">دریافت داده‌ها...</span>
                            </div>
                            <b-button variant="secondary" @click="cancel()" :disabled="loading.search">
                                انصراف
                            </b-button>
                            <b-button variant="primary" @click="search" :disabled="loading.search">
                                جستجو
                            </b-button>
                        </template>
                    </b-modal>
                </div>
                <div slot="emptystate" class="text-center py-2">
                    <span v-if="isLoading">در حال دریافت گزارش...</span>
                    <span v-else>گزارشی برای نمایش وجود ندارد</span>
                </div>
                <div slot="loadingContent">
                    <span class="vgt-loading__content">
                      دریافت داده‌ها...
                    </span>
                </div>
            </vue-good-table>
        </b-card>
    </div>
</template>

<script>
    import moment from 'moment-jalaali'
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
                paginationOptions: {
                    enabled: true,
                    dropdownAllowAll: false,
                    mode: 'records',
                    nextLabel: 'بعدی',
                    prevLabel: 'قبلی',
                    rowsPerPageLabel: 'ردیف در هر صفحه',
                    ofLabel: 'از',
                    pageLabel: 'صفحه', // for 'pages' mode
                    allLabel: 'همه',
                },
                filter: {
                    BadgeNumber: '',
                    CardNumber: '',
                    Name: '',
                    LastName: '',
                    MinTime: '',
                    MaxTime: '',
                    TypeID: null,
                    deviceID: null,
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
                        hidden: true,
                    },
                    {
                        label: "شناسه کارت",
                        field: "CardNumber",
                    },
                    {
                        label: "شناسه کاربر",
                        field: "BadgeNumber",
                    },
                    {
                        label: "نام و نام خانوادگی",
                        field: "Name",
                        formatFn: this.getFullName,
                    },
                    {
                        label: "نوع",
                        field: "Type",
                        formatFn: this.getPersianType,
                    },
                    {
                        label: "دستگاه",
                        field: "Device_Name",
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
                    filter: {},
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
            getFullName(name, row) {
                return name + ' ' + row.LastName
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
                return this.$store.dispatch('getReport', this.serverParams)
                    .then(response => {
                        this.totalRecords = response.totalRecords;
                        this.rows = response.rows;
                    });
            },

            search() {
                this.loading.search = true

                const filter = {
                    ...this.filter,
                    BadgeNumber: this.persian2english(this.filter.BadgeNumber),
                    CardNumber: this.persian2english(this.filter.CardNumber),
                    MinTime: this.filter.MinTime ? moment(this.filter.MinTime, 'jYYYY/jMM/jDD HH:mm').format('YYYY-MM-DDTHH:mm:ss') : '',
                    MaxTime: this.filter.MaxTime ? moment(this.filter.MaxTime, 'jYYYY/jMM/jDD HH:mm').format('YYYY-MM-DDTHH:mm:ss') : '',
                };
                this.updateParams({filter, page: 1});
                this.$refs['report-table'].changePage(1);
                this.loadItems()
                    .finally(() => {
                        this.loading.search = false
                        this.$bvModal.hide('search')
                    })
            }
        },
        created() {
            this.loadItems()

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

        }
    };
</script>
<style lang="scss">
    .vgt-global-search__actions {
        order: -1;
    }

    .form-control:disabled, .form-control[readonly] {
        background: #fff;
    }

    .date-picker-close-button {
        position: absolute;
        right: 9px;
        bottom: 10px;
        font-size: 70%;
        cursor: pointer;
        opacity: .7;

        &:hover, &:focus {
            opacity: 1;
        }
    }
</style>

<template>
    <div class="main-content">
        <breadcumb page="گزارش مهمان‌ها"/>
        <!-- <div class="wrapper"> -->
        <b-card class="mb-30">
            <vue-good-table
                    ref="report-table"
                    mode="remote"
                    @on-page-change="onPageChange"
                    @on-per-page-change="onPerPageChange"
                    :totalRows="totalRecords"
                    :isLoading.sync="isLoading"
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
                                        <b-form-input v-model="filter.FName"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="6" xl="3">
                                    <b-form-group label="کد ملی">
                                        <b-form-input v-model="filter.PassportID"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="6" xl="3">
                                    <b-form-group label="شناسه کارت">
                                        <b-form-input v-model="filter.BadgeNumber"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col cols="6" xl="3">
                                    <b-form-group label="ورود از تاریخ">
                                        <span class="date-picker-close-button" @click="filter.MinEnter = ''" v-show="filter.MinEnter">&#10005;</span>
                                        <b-form-input id="date_enter_from" v-model="filter.MinEnter"
                                                      class="dir-ltr" readonly></b-form-input>
                                        <date-picker element="date_enter_from" v-model="filter.MinEnter"
                                                     type="datetime"></date-picker>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="6" xl="3">
                                    <b-form-group label="ورود تا تاریخ">
                                        <span class="date-picker-close-button" @click="filter.MaxEnter = ''" v-show="filter.MaxEnter">&#10005;</span>
                                        <b-form-input id="date_enter_to" v-model="filter.MaxEnter"
                                                      class="dir-ltr" readonly></b-form-input>
                                        <date-picker element="date_enter_to" v-model="filter.MaxEnter"
                                                     type="datetime"></date-picker>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="6" xl="3">
                                    <b-form-group label="خروج از تاریخ">
                                        <span class="date-picker-close-button" @click="filter.MinExit = ''" v-show="filter.MinExit">&#10005;</span>
                                        <b-form-input id="date_exit_from" v-model="filter.MinExit"
                                                      class="dir-ltr" readonly></b-form-input>
                                        <date-picker element="date_exit_from" v-model="filter.MinExit"
                                                     type="datetime"></date-picker>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="6" xl="3">
                                    <b-form-group label="خروج تا تاریخ">
                                        <span class="date-picker-close-button" @click="filter.MaxExit = ''" v-show="filter.MaxExit">&#10005;</span>
                                        <b-form-input id="date_exit_to" v-model="filter.MaxExit"
                                                      class="dir-ltr" readonly></b-form-input>
                                        <date-picker element="date_exit_to" v-model="filter.MaxExit"
                                                     type="datetime"></date-picker>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col cols="6">
                                    <b-form-group label="اقلام همراه">
                                        <b-form-input v-model="filter.Accessories"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="6">
                                    <b-form-group label="علت مراجعه">
                                        <b-form-input v-model="filter.Reason"></b-form-input>
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
            </vue-good-table>
        </b-card>
    </div>
</template>

<script>

    // import moment from 'moment-jalaali'
    import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
    import moment from "moment-jalaali";

    export default {
        components: {
            datePicker: VuePersianDatetimePicker,
        },
        metaInfo() {
            return {
                title: "گزارش",
            }
        },
        data() {
            return {
                loading: {
                    search: false
                },
                filter: {
                    Name: '',
                    FName: '',
                    PassportID: '',
                    BadgeNumber: '',
                    MinEnter: '',
                    MaxEnter: '',
                    MinExit: '',
                    MaxExit: '',
                    Accessories: '',
                    Reason: '',
                },
                isLoading: false,
                columns: [
                    {
                        label: 'id',
                        field: 'ID',
                        hidden: true,
                    },
                    {
                        label: 'شناسه کارت',
                        field: 'BadgeNumber',
                    },
                    {
                        label: 'نام',
                        field: 'Name',
                    },
                    {
                        label: 'نام خانوادگی',
                        field: 'FName',
                    },
                    {
                        label: 'کد ملی',
                        field: 'PassportID',
                    },
                    {
                        label: 'اقلام همراه',
                        field: 'Accessories',
                    },
                    {
                        label: 'علت مراجعه',
                        field: 'Reason',
                    },
                    {
                        label: 'تاریخ ورود',
                        field: 'Enter_perisan',
                        tdClass: "dir-ltr",
                        formatFn: this.formatEnterDate
                    },
                    {
                        label: 'تاریخ خروج',
                        field: 'Exit_persian',
                        tdClass: "dir-ltr",
                        formatFn: this.formatExitDate
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
        methods: {
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
                return this.$store.dispatch('getGuests', this.serverParams)
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
                    PassportID: this.persian2english(this.filter.PassportID),
                    MinEnter: this.filter.MinEnter ? moment(this.filter.MinEnter, 'jYYYY/jMM/jDD HH:mm').format('YYYY-MM-DDTHH:mm:ss') : '',
                    MaxEnter: this.filter.MaxEnter ? moment(this.filter.MaxEnter, 'jYYYY/jMM/jDD HH:mm').format('YYYY-MM-DDTHH:mm:ss') : '',
                    MinExit: this.filter.MinExit ? moment(this.filter.MinExit, 'jYYYY/jMM/jDD HH:mm').format('YYYY-MM-DDTHH:mm:ss') : '',
                    MaxExit: this.filter.MaxExit ? moment(this.filter.MaxExit, 'jYYYY/jMM/jDD HH:mm').format('YYYY-MM-DDTHH:mm:ss') : '',
                };
                this.updateParams({filter, page: 1});
                this.$refs['report-table'].changePage(1);
                this.loadItems()
                    .finally(() => {
                        this.loading.search = false
                        this.$bvModal.hide('search')
                    })
            },

            formatDate(value) {
                return this.english2persian(value).replace('T', ' ')
            },
            formatEnterDate(value, row) {
                return row.Enter ? this.formatDate(value) : '';
            },
            formatExitDate(value, row) {
                return row.Exit ? this.formatDate(value) : '';
            },


        },
        created() {
            this.loadItems()
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
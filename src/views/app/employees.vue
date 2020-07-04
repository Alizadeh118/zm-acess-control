<template>
    <div class="main-content">
        <breadcumb page="کارمندان" />
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
                      initialSortBy: {field: 'LastName', type: 'asc'}
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
                    :rows="$store.state.api.employees"
            >
                <div slot="emptystate" class="text-center py-2">
                    <span v-if="loading.getEmployees">در حال دریافت لیست کارمندان...</span>
                    <span v-else>کارمندی برای نمایش وجود ندارد</span>
                </div>
                <div slot="table-actions" class="mb-4">
                    <b-button variant="primary" class="btn-rounded d-none d-sm-block" v-b-modal.addEmployee
                    ><i class="i-Add-Window align-middle text-white mr-2"> </i>افزودن کارمند
                    </b-button>

                    <b-modal id="addEmployee" :title="employee.update ? 'ویرایش کارمند' : 'افزودن کارمند'"
                             @ok.prevent="addOrUpdateEmployee" @hidden="onModalHidden">
                        <b-form>
                            <b-row>
                                <b-col>
                                    <b-form-group label="نام:">
                                        <b-form-input
                                                type="text"
                                                required
                                                placeholder="علی"
                                                v-model="employee.Name"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <b-form-group label="نام خانوادگی:">
                                        <b-form-input
                                                type="text"
                                                required
                                                placeholder="جوادی"
                                                v-model="employee.LastName"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>

                            <b-row class="mt-3">
                                <b-col cols="3">
                                    <b-form-group label="شناسه">
                                        <b-form-input
                                                type="text"
                                                required
                                                v-model="employee.BadgeNumber"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <div>
                                        <b-form-group label="دپارتمان:">
                                            <treeselect v-model="employee.Department_ID" :options="departments"
                                                        placeholder="دپارتمان‌(های) مربوط را انتخاب کنید"
                                                        clearAllText="حذف همه گزینه‌ها"/>
                                        </b-form-group>
                                    </div>
                                </b-col>
                            </b-row>

                        </b-form>
                        <template v-slot:modal-footer="{ ok, cancel }">
                            <div class="spinner-bubble spinner-bubble-primary spinner-modal" v-show="loading.addOrUpdateEmployee"></div>
                            <b-button variant="secondary" @click="cancel()" :disabled="loading.addOrUpdateEmployee">
                                انصراف
                            </b-button>
                            <b-button variant="primary" @click="ok()" :disabled="loading.addOrUpdateEmployee">
                                {{ employee.update ? 'تایید و ویرایش کارمند' : 'تایید و افزودن کارمند' }}
                            </b-button>
                        </template>
                    </b-modal>
                </div>

                <template slot="table-row" slot-scope="props">

                     <span v-if="props.column.field === 'Button'">
                      <a @click.prevent="editEmployee(props.row)"
                         href=""
                         v-b-tooltip.hover
                         class="o-hidden d-inline-block"
                         title="ویرایش کارمند">
                        <i class="i-Eraser-2 text-25 text-info mr-2"></i>
                      </a>
                      <a @click.prevent="removeEmployee(props.row)"
                         href=""
                         v-b-tooltip.hover
                         class="o-hidden d-inline-block"
                         title="حذف کارمند">
                        <i class="i-Close-Window text-25 text-danger"></i>
                        </a>
                    </span>

                </template>

            </vue-good-table>
        </b-card>
    </div>
</template>

<script>
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    export default {
        components: {
            Treeselect
        },
        data() {
            return {
                loading: {
                    addOrUpdateEmployee: false,
                    removeEmployee: false,
                    getEmployees: true,
                },
                columns: [
                    {
                        label: "نام",
                        field: "Name"
                    },
                    {
                        label: "نام خانوادگی",
                        field: "LastName"
                    },
                    {
                        label: "شماره پرسنلی",
                        field: "BadgeNumber"
                    },
                    {
                        label: "دپارتمان",
                        field: "Department.Name"
                    },
                    {
                        label: "عملیات",
                        field: "Button",
                        html: true,
                        sortable: false,
                        tdClass: "text-right",
                        thClass: "text-right"
                    }
                ],
                employee: {
                    Name: '',
                    LastName: '',
                    Department_ID: null,
                    update: false
                },
            };
        },
        computed: {
            departments() {
                const list = this.$store.state.api.departments;
                let map = {}, node, roots = [], i;
                for (i = 0; i < list.length; i += 1) {
                    map[list[i].ID] = i; // initialize the map
                }
                for (i = 0; i < list.length; i += 1) {
                    node = list[i];
                    if (node.Parent_ID !== -1) {
                        // if you have dangling branches check that map[node.parentId] exists
                        list[map[node.Parent_ID]].children = list[map[node.Parent_ID]].children || [];
                        list[map[node.Parent_ID]].children.push(node);
                    } else {
                        roots.push(node);
                    }
                }

                // add id and label
                const addIDAndLabelKeys = (arr) => {
                    for (let i = 0; i < arr.length; i++) {
                        arr[i].id = arr[i]['ID'];
                        arr[i].label = arr[i]['Name'];
                        if (arr[i]['children'])
                            arr[i]['children'] = addIDAndLabelKeys(arr[i]['children'])
                    }
                    return arr;
                };
                addIDAndLabelKeys(roots);
                return roots;
            },
        },
        methods: {
            addOrUpdateEmployee() {
                this.loading.addOrUpdateEmployee = true;

                if (this.employee.update) {
                    this.$store.dispatch('updateEmployee', this.employee)
                        .then(() => {
                            this.$bvModal.hide('addEmployee');
                            this.$bvToast.toast(`کارمند با موفقیت ویرایش شد`, {
                                title: `ویرایش کارمند`,
                                variant: 'success',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                        .catch(err => {
                            console.log('Could not update employee', err);
                            this.$bvToast.toast(`ویرایش کارمند با خطا همراه بود`, {
                                title: `ویرایش کارمند`,
                                variant: 'danger',
                                toaster: 'b-toaster-top-left'
                            });

                        })
                        .finally(() => this.loading.addOrUpdateEmployee = false)
                } else {
                    this.$store.dispatch('addEmployee', this.employee)
                        .then(() => {
                            this.$bvModal.hide('addEmployee');
                            this.$bvToast.toast(`کارمند با موفقیت افزوده شد`, {
                                title: `افزودن کارمند`,
                                variant: 'success',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                        .catch(err => {
                            console.log('Could not add employee', err);
                            this.$bvToast.toast(`افزودن کارمند با خطا همراه بود`, {
                                title: `افزودن کارمند`,
                                variant: 'danger',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                        .finally(() => this.loading.addOrUpdateEmployee = false)
                }
            },
            editEmployee(employee) {
                this.employee = {
                    ...employee,
                    update: true
                };
                this.$bvModal.show('addEmployee');
            },
            removeEmployee(employee) {

                const msg = `آیا واقعا می‌خواهید کارمند «${(employee.Name || '') + ' ' + (employee.LastName || '')}» را حذف کنید؟`;
                this.$bvModal
                    .msgBoxConfirm(msg, {
                        title: "حذف کارمند",
                        buttonSize: "sm",
                        okVariant: "danger",
                        okTitle: "بله، کارمند حذف شود",
                        cancelTitle: "انصراف",
                        footerClass: "p-2",
                        hideHeaderClose: false,
                        centered: true
                    })
                    .then(ok => {
                        if (ok) {
                            this.loading.removeEmployee = true;
                            this.$store.dispatch('removeEmployee', employee.ID)
                                .then(() => {
                                    this.$bvToast.toast(`کارمند با موفقیت حذف شد`, {
                                        title: `حذف کارمند`,
                                        variant: 'success',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .catch(() => {
                                    this.$bvToast.toast(`حذف کارمند با خطا همراه بود`, {
                                        title: `حذف کارمند`,
                                        variant: 'danger',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .finally(() => this.loading.removeEmployee = false)
                        }
                    })
            },
            onModalHidden() {
                this.employee = {
                    Name: '',
                    LastName: '',
                    Department_ID: null,
                    update: false
                }
            },
        },
        created() {
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

            this.$store.dispatch('getDepartments')
                .catch(e => {
                    console.log(' Could not get departments', e);
                    this.$bvToast.toast(`دریافت لیست دپارتمان‌ها با خطا همراه بود`, {
                        title: `لیست دپارتمان`,
                        variant: 'danger',
                        toaster: 'b-toaster-top-left',
                        noAutoHide: true,
                    });
                })
        }
    };
</script>
<style>
    .vgt-global-search__actions {
        order: -1;
    }

    .footer__row-count__label {
        float: left;
    }
</style>

<template>
    <div class="main-content">
        <breadcumb page="کارمندان"/>
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
                      enabled: true,
                      mode: 'records',
                      nextLabel: 'بعدی',
                      prevLabel: 'قبلی',
                      rowsPerPageLabel: 'ردیف در هر صفحه',
                      ofLabel: 'از',
                      pageLabel: 'صفحه', // for 'pages' mode
                      allLabel: 'همه',
                    }"
                    @on-selected-rows-change="selectionChanged"
                    :select-options="{
                    enabled: true,
                    selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
                    selectionInfoClass: 'custom-class',
                    selectionText: 'ردیف انتخاب شده',
                    clearSelectionText: 'انصراف',
                    disableSelectInfo: true, // disable the select info panel on top
                    selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
                  }"
                    styleClass="tableOne vgt-table"
                    :rows="$store.state.api.employees">
                <div slot="emptystate" class="text-center py-2">
                    <span v-if="loading.getEmployees">در حال دریافت لیست کارمندان...</span>
                    <span v-else>کارمندی برای نمایش وجود ندارد</span>
                </div>
                <div slot="table-actions" class="mb-4">
                    <div class="d-flex">
                        <b-button variant="primary" class="btn-rounded d-none d-sm-block mr-3" v-b-modal.addEmployee
                        ><i class="i-Add-Window align-middle text-white mr-2"> </i>افزودن کارمند
                        </b-button>
                        <b-modal id="addEmployee" :title="employee.update ? 'ویرایش کارمند' : 'افزودن کارمند'"
                                 @ok.prevent="addOrUpdateEmployee" @hidden="onModalHidden">
                            <b-form>
                                <b-row>
                                    <b-col cols="3">
                                        <b-form-group label="شناسه">
                                            <b-form-input
                                                    type="text"
                                                    :readonly="employee.update"
                                                    required
                                                    v-model="employee.BadgeNumber"
                                            ></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col>
                                        <div>
                                            <b-form-group label="دپارتمان:">
                                                <treeselect v-model="employee.Department_ID" :options="departments"
                                                            :defaultExpandLevel="1"
                                                            placeholder="دپارتمان‌(های) مربوط را انتخاب کنید"
                                                            clearAllText="حذف همه گزینه‌ها"/>
                                            </b-form-group>
                                        </div>
                                    </b-col>
                                </b-row>

                                <b-row class="mt-3">
                                    <b-col>
                                        <b-form-group label="نام:">
                                            <b-form-input
                                                    type="text"
                                                    required
                                                    v-model="employee.Name"
                                            ></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col>
                                        <b-form-group label="نام خانوادگی:">
                                            <b-form-input
                                                    type="text"
                                                    required
                                                    v-model="employee.LastName"
                                            ></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col cols="12">
                                        <b-row>
                                            <b-col cols="6">
                                                <b-form-group label="نقش کاربر:">
                                                    <b-form-select
                                                            required
                                                            :options="privileges"
                                                            value-field="ID" text-field="Name"
                                                            v-model="employee.Privilege_ID"
                                                    ></b-form-select>
                                                </b-form-group>
                                            </b-col>
                                            <b-col cols="6" class="mt-32">
                                                <b-form-checkbox v-model="employee.Is_Guest" class="ml-0">کارت مهمان
                                                </b-form-checkbox>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>

                            </b-form>
                            <template v-slot:modal-footer="{ ok, cancel }">
                                <div class="spinner-bubble spinner-bubble-sm spinner-bubble-primary spinner-modal"
                                     v-show="loading.addOrUpdateEmployee"></div>
                                <b-button variant="secondary" @click="cancel()" :disabled="loading.addOrUpdateEmployee">
                                    انصراف
                                </b-button>
                                <b-button variant="primary" @click="ok()" :disabled="loading.addOrUpdateEmployee">
                                    {{ employee.update ? 'تایید و ویرایش کارمند' : 'تایید و افزودن کارمند' }}
                                </b-button>
                            </template>
                        </b-modal>

                        <b-button variant="info" class="btn-rounded mr-3"
                                  :class="{'pointer-events-none opacity-2': !selectedEmployeeIds.length || !!loading.toggleAbility.length}"
                                  :disabled="!selectedEmployeeIds.length || !!loading.toggleAbility.length"
                                  @click="toggleAbility(selectedEmployeeIds, true)"
                        ><i class="i-Unlock-2 align-middle text-white mr-2"> </i>فعال کردن
                        </b-button>

                        <b-button variant="warning" class="btn-rounded mr-3"
                                  :class="{'pointer-events-none opacity-2': !selectedEmployeeIds.length || !!loading.toggleAbility.length}"
                                  :disabled="!selectedEmployeeIds.length || !!loading.toggleAbility.length"
                                  @click="toggleAbility(selectedEmployeeIds, false)"
                        ><i class="i-Lock-2 align-middle text-white mr-2"> </i>غیرفعال کردن
                        </b-button>

                        <b-button variant="danger" class="btn-rounded mr-3"
                                  :class="{'pointer-events-none opacity-2': !selectedEmployeeIds.length || !!loading.removeEmployees.length}"
                                  :disabled="!selectedEmployeeIds.length || !!loading.removeEmployees.length"
                                  @click="removeEmployees(selectedEmployeeIds)"
                        ><i class="i-Close align-middle text-white mr-2"> </i>حذف
                        </b-button>
                    </div>
                </div>

                <template slot="table-row" slot-scope="props">

                    <div v-if="props.column.field === 'Button'"
                         class="d-flex align-items-center justify-content-between">
                        <div class="right">
                            <a v-if="0 && props.row.Is_Guest"
                               @click.prevent="toggleAvailability(props.row)"
                               href=""
                               v-b-tooltip.hover
                               class="o-hidden d-inline-block"
                               title="تغییر دسترسی">
                                <i class="i-Key text-25 mr-2 text-green"
                                   :class="{'text-mute': !props.row.Is_Available}"></i>
                            </a>
                            <template v-if="props.row.Is_Guest">
                                <b-badge variant="info" class="mr-2">مهمان</b-badge>
                                <b-badge :variant="props.row.Is_Available ? 'success' : 'danger'">
                                    {{ props.row.Is_Available ? 'در دسترس' : 'خارج از دسترس'}}
                                </b-badge>
                            </template>
                        </div>
                        <div class="left">
                            <a @click.prevent="toggleAbility(props.row.ID, !props.row.Is_Enable)"
                               href=""
                               v-b-tooltip.hover
                               class="o-hidden d-inline-block"
                               :class="{'opacity-2 pointer-events-none': loading.toggleAbility.includes(props.row.ID)}"
                               :title="props.row.Is_Enable ? 'غیرفعال کردن' : 'فعال کردن'">
                                <i class="i-Lock-2 text-25 text-info mr-2"
                                   :class="{'i-Unlock-2 text-warning' : props.row.Is_Enable}"></i>
                            </a>
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
                               :class="{'opacity-2 pointer-events-none': loading.removeEmployees.includes(props.row.ID)}"
                               title="حذف کارمند">
                                <i class="i-Close-Window text-25 text-danger"></i>
                            </a>
                        </div>
                    </div>

                </template>

            </vue-good-table>
        </b-card>
    </div>
</template>

<script>
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    export default {
        metaInfo() {
            return {
                title: "کارمندان",
            }
        },
        components: {
            Treeselect
        },
        data() {
            return {
                loading: {
                    addOrUpdateEmployee: false,
                    removeEmployees: [],
                    getEmployees: true,
                    toggleAbility: [],
                },
                columns: [
                    {
                        label: "شماره پرسنلی",
                        field: "BadgeNumber"
                    },
                    {
                        label: "نام",
                        field: "Name"
                    },
                    {
                        label: "نام خانوادگی",
                        field: "LastName"
                    },
                    {
                        label: "دپارتمان",
                        field: "Department_Name"
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
                    Privilege_ID: null,
                    Is_Guest: false,
                    Is_Available: true,
                    update: false
                },
                selectedEmployeeIds: [],
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
            privileges() {
                const getPersianPrivilegeName = privilege => {
                    switch (privilege) {
                        case 'normal':
                            return 'کاربر عادی'
                        case 'admin':
                            return 'مدیر ارشد'
                        default:
                            return privilege
                    }
                }
                return this.$store.state.api.privileges.map(privilege => {
                    privilege.Name = getPersianPrivilegeName(privilege.Name)
                    return privilege
                })

            }
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
                            let msg
                            try {
                                msg = err.response.data.Message
                            } catch (e) {
                                msg = 'ویرایش کارمند با خطا همراه بود'
                            }
                            this.$bvToast.toast(msg, {
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
                            let msg
                            try {
                                msg = err.response.data.Message
                            } catch (e) {
                                msg = 'افزودن کارمند با خطا همراه بود'
                            }
                            console.log('Could not add employee', err);
                            this.$bvToast.toast(msg, {
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
                            this.loading.removeEmployees.push(employee.ID)
                            this.$store.dispatch('removeEmployee', [employee.ID])
                                .then(() => {
                                    this.$bvToast.toast(`کارمند با موفقیت حذف شد`, {
                                        title: `حذف کارمند`,
                                        variant: 'success',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .catch((err) => {
                                    let msg
                                    try {
                                        msg = err.response.data.Message
                                    } catch (e) {
                                        msg = 'حذف کارمند با خطا همراه بود'
                                    }
                                    this.$bvToast.toast(msg, {
                                        title: `حذف کارمند`,
                                        variant: 'danger',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .finally(() => this.loading.removeEmployees = this.loading.removeEmployees.filter(i => i !== employee.ID))
                        }
                    })
            },
            removeEmployees(employeeIds) {
                const msg = `آیا واقعا می‌خواهید ${employeeIds.length} کارمند انتخاب شده را حذف کنید؟`;
                this.$bvModal
                    .msgBoxConfirm(msg, {
                        title: "حذف کارمند",
                        buttonSize: "sm",
                        okVariant: "danger",
                        okTitle: "بله، کارمندان حذف شودن",
                        cancelTitle: "انصراف",
                        footerClass: "p-2",
                        hideHeaderClose: false,
                        centered: true
                    })
                    .then(ok => {
                        if (ok) {
                            this.loading.removeEmployees = this.loading.removeEmployees.concat(employeeIds)
                            this.$store.dispatch('removeEmployee', employeeIds)
                                .then(() => {
                                    this.$bvToast.toast(`کارمندان با موفقیت حذف شدند`, {
                                        title: `حذف کارمند`,
                                        variant: 'success',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .catch((err) => {
                                    let msg
                                    try {
                                        msg = err.response.data.Message
                                    } catch (e) {
                                        msg = 'حذف کارمندان با خطا همراه بود'
                                    }
                                    this.$bvToast.toast(msg, {
                                        title: `حذف کارمند`,
                                        variant: 'danger',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .finally(() => this.loading.removeEmployees = this.loading.removeEmployees.filter(i => !employeeIds.includes(i)))
                        }
                    })
            },
            toggleAvailability(employee) {
                this.$store.dispatch('toggleAvailability', {EmployeeId: employee.ID, available: !employee.Is_Available})
                    .then(() => {
                        this.$bvToast.toast(`دسترسی کارمند با موفقیت تغییر کرد`, {
                            title: `دسترسی کارمند`,
                            variant: 'success',
                            toaster: 'b-toaster-top-left'
                        });
                    })
                    .catch(() => {
                        this.$bvToast.toast(`تغییر دسترسی کارمند با خطا همراه بود`, {
                            title: `دسترسی کارمند`,
                            variant: 'danger',
                            toaster: 'b-toaster-top-left'
                        });
                    })
            },
            onModalHidden() {
                this.employee = {
                    Name: '',
                    LastName: '',
                    Department_ID: null,
                    Privilege_ID: null,
                    Is_Guest: false,
                    Is_Available: true,
                    update: false,
                }
            },
            selectionChanged(data) {
                this.selectedEmployeeIds = data.selectedRows.map(employee => employee.ID)
            },
            toggleAbility(employeeIds, enabled) {
                if (this.loading.toggleAbility.includes(employeeIds)) return;

                if (Array.isArray(employeeIds))
                    this.loading.toggleAbility = this.loading.toggleAbility.concat(employeeIds)
                else
                    this.loading.toggleAbility.push(employeeIds)

                this.$store.dispatch('toggleAbility', {
                    employeeIds: Array.isArray(employeeIds) ? employeeIds : [employeeIds],
                    enabled
                })
                    .then(() => {
                        this.$bvToast.toast(`${enabled ? 'فعال سازی' : 'غیر فعال سازی'} کارمند با موفقیت انجام شد`, {
                            title: `${enabled ? 'فعال سازی' : 'غیر فعال سازی'} کارمند`,
                            variant: 'success',
                            toaster: 'b-toaster-top-left'
                        });
                    })
                    .catch(() => {
                        this.$bvToast.toast(`${enabled ? 'فعال سازی' : 'غیر فعال سازی'} کارمند با خطا همراه بود`, {
                            title: `${enabled ? 'فعال سازی' : 'غیر فعال سازی'} کارمند`,
                            variant: 'danger',
                            toaster: 'b-toaster-top-left'
                        });
                    })
                    .finally(() => {
                        if (Array.isArray(employeeIds))
                            this.loading.toggleAbility = this.loading.toggleAbility.filter(i => !employeeIds.includes(i))
                        else
                            this.loading.toggleAbility = this.loading.toggleAbility.filter(i => i !== employeeIds)
                    })
            }
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

            this.$store.dispatch('getPrivileges')
                .catch(e => {
                    console.log(' Could not get privileges', e);
                    this.$bvToast.toast(`دریافت لیست مجوزها با خطا همراه بود`, {
                        title: `لیست مجوزها`,
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

    .badge {
        font-size: 100%;
    }
</style>

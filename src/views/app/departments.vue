<template>
    <div class="main-content">
        <breadcumb page="دپارتمان‌ها"/>
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
                      enabled: false,
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
                    :rows="departmentsList"
            >
                <div slot="emptystate" class="text-center py-2">
                    <span v-if="loading.getDepartments">در حال دریافت لیست دپارتمان‌ها...</span>
                    <span v-else>دپارتمانی برای نمایش وجود ندارد</span>
                </div>
                <div slot="table-actions" class="mb-4">
                    <b-button variant="primary" class="btn-rounded d-none d-sm-block" v-b-modal.addDepartment
                    ><i class="i-Add-Window align-middle text-white mr-2"> </i>افزودن دپارتمان
                    </b-button>

                    <b-modal id="addDepartment" :title="department.update ? 'ویرایش دپارتمان' : 'افزودن دپارتمان'"
                             @ok.prevent="addOrUpdateDepartment" @hidden="onModalHidden">
                        <b-form>
                            <b-row>
                                <b-col>
                                    <b-form-group label="نام دپارتمان:">
                                        <b-form-input
                                                type="text"
                                                required
                                                placeholder="علی"
                                                v-model="department.Name"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>

                            <b-row class="mt-3" v-show="department.Parent_ID !== -1">
                                <b-col>
                                    <div>
                                        <b-form-group label="دپارتمان پدر:">
                                            <treeselect v-model="department.Parent_ID" :options="departments" :defaultExpandLevel="Infinity"
                                                        placeholder="دپارتمان‌(های) مربوط را انتخاب کنید"
                                                        clearAllText="حذف همه گزینه‌ها"/>
                                        </b-form-group>
                                    </div>
                                </b-col>
                            </b-row>

                        </b-form>
                        <template v-slot:modal-footer="{ ok, cancel }">
                            <div class="spinner-bubble spinner-bubble-sm spinner-bubble-primary spinner-modal"
                                 v-show="loading.addOrUpdateDepartment"></div>
                            <b-button variant="secondary" @click="cancel()" :disabled="loading.addOrUpdateDepartment">
                                انصراف
                            </b-button>
                            <b-button variant="primary" @click="ok()" :disabled="loading.addOrUpdateDepartment">
                                {{ department.update ? 'تایید و ویرایش دپارتمان' : 'تایید و افزودن دپارتمان' }}
                            </b-button>
                        </template>
                    </b-modal>
                </div>

                <template slot="table-row" slot-scope="props">

                    <span v-if="props.column.field === 'Name'">
                        <span class="text-mute">{{ parentCount(props.row) }}</span>
                        <span>{{ props.row.Name }}</span>
                    </span>
                    <span v-else-if="props.column.field === 'Button'">
                      <a @click.prevent="editDepartment(props.row)"
                         href=""
                         v-b-tooltip.hover
                         class="o-hidden d-inline-block"
                         title="ویرایش دپارتمان">
                        <i class="i-Eraser-2 text-25 text-info mr-2"></i>
                      </a>
                      <a @click.prevent="removeDepartment(props.row)"
                         :class="{'opacity-2 pointer-events-none': props.row.Parent_ID === -1}"
                         :disabled="props.row.Parent_ID === -1"
                         href=""
                         v-b-tooltip.hover
                         class="o-hidden d-inline-block"
                         title="حذف دپارتمان">
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
        metaInfo() {
            return {
                title: "دپارتمان‌ها",
            }
        },
        components: {
            Treeselect
        },
        data() {
            return {
                loading: {
                    addOrUpdateDepartment: false,
                    removeDepartment: false,
                    getDepartments: true,
                },
                columns: [
                    {
                        label: "نام دپارتمان",
                        field: "Name",
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
                department: {
                    Name: '',
                    Parent_ID: null,
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
            departmentsList() {
                if (!this.departments.length) return []
                const filler = (item, res = []) => {
                    res.push({
                        ID: item.ID,
                        Name: item.Name,
                        Parent_ID: item.Parent_ID,
                        Parent_Department: item.Parent_Department,
                    });
                    if (item.children)
                        for (const child of item.children)
                            res.push(filler(child))
                    return res.flat()
                }
                return filler(this.departments[0])
            }
        },
        methods: {
            addOrUpdateDepartment() {
                this.loading.addOrUpdateDepartment = true;

                if (this.department.update) {
                    this.$store.dispatch('updateDepartment', this.department)
                        .then(() => {
                            this.$bvModal.hide('addDepartment');
                            this.$bvToast.toast(`دپارتمان با موفقیت ویرایش شد`, {
                                title: `ویرایش دپارتمان`,
                                variant: 'success',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                        .catch(err => {
                            console.log('Could not update department', err);
                            let msg
                            try {
                                msg = err.response.data.Message
                            } catch (e) {
                                msg = 'ویرایش دپارتمان با خطا همراه بود'
                            }
                            this.$bvToast.toast(msg, {
                                title: `ویرایش دپارتمان`,
                                variant: 'danger',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                        .finally(() => this.loading.addOrUpdateDepartment = false)

                } else {
                    this.$store.dispatch('addDepartment', this.department)
                        .then(() => {
                            this.$bvModal.hide('addDepartment');
                            this.$bvToast.toast(`دپارتمان با موفقیت افزوده شد`, {
                                title: `افزودن دپارتمان`,
                                variant: 'success',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                        .catch(err => {
                            console.log('Could not add department', err);
                            let msg
                            try {
                                msg = err.response.data.Message
                            } catch (e) {
                                msg = 'افزودن دپارتمان با خطا همراه بود'
                            }
                            this.$bvToast.toast(msg, {
                                title: `افزودن دپارتمان`,
                                variant: 'danger',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                        .finally(() => this.loading.addOrUpdateDepartment = false)
                }
            },
            editDepartment(department) {
                this.department = {
                    ...department,
                    update: true
                };
                this.$bvModal.show('addDepartment');
            },
            removeDepartment(department) {

                const msg = `آیا واقعا می‌خواهید دپارتمان «${department.Name}» را حذف کنید؟`;
                this.$bvModal
                    .msgBoxConfirm(msg, {
                        title: "حذف دپارتمان",
                        buttonSize: "sm",
                        okVariant: "danger",
                        okTitle: "بله، دپارتمان حذف شود",
                        cancelTitle: "انصراف",
                        footerClass: "p-2",
                        hideHeaderClose: false,
                        centered: true
                    })
                    .then(ok => {
                        if (ok) {
                            this.loading.removeDepartment = true;
                            this.$store.dispatch('removeDepartment', department.ID)
                                .then(() => {
                                    this.$bvToast.toast(`دپارتمان با موفقیت حذف شد`, {
                                        title: `حذف دپارتمان`,
                                        variant: 'success',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .catch(() => {
                                    this.$bvToast.toast(`حذف دپارتمان با خطا همراه بود`, {
                                        title: `حذف دپارتمان`,
                                        variant: 'danger',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .finally(() => this.loading.removeDepartment = false)
                        }
                    })
            },
            onModalHidden() {
                this.department = {
                    Name: '',
                    Parent_ID: 2,
                    update: false
                }
            },
            parentCount(item, s = '') {
                if (item.Parent_Department) {
                    s = `\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0`;
                    return s += this.parentCount(item.Parent_Department);
                }
                return s + ' '
            }
        },
        created() {
            this.$store.dispatch('getDepartments')
                .catch(e => {
                    console.log('Could not get devices', e);
                    this.$bvToast.toast(`دریافت لیست دپارتمان‌ها با خطا همراه بود`, {
                        title: `لیست دپارتمان‌ها`,
                        variant: 'danger',
                        toaster: 'b-toaster-top-left',
                        noAutoHide: true,
                    });
                })
                .finally(() => this.loading.getDepartments = false)
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

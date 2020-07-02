<template>
    <div class="main-content">
        <breadcumb page="کارمندان" :folder="'کارمندان'"/>
        <!-- <div class="wrapper"> -->
        <b-card>
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
                    کارمندی برای نمایش وجود ندارد
                </div>
                <div slot="table-actions" class="mb-4">
                    <b-button variant="primary" class="btn-rounded d-none d-sm-block" v-b-modal.addEmployee
                    ><i class="i-Add-Window align-middle text-white mr-2"> </i>افزودن کارمند
                    </b-button>

                    <b-modal id="addEmployee" :title="employee.update ? 'ویرایش کارمند' : 'افزودن کارمند'"
                             :ok-title="employee.update ? 'تایید و ویرایش کارمند' : 'تایید و افزودن کارمند'"
                             cancel-title="انصراف"
                             @ok="addOrUpdateEmployee" @hidden="onModalHidden">
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

                    <!--                    <span v-else-if="props.column.field === 'Department'">-->
                    <!--                        <span v-if="props.row.Department">{{ props.row.Department.Name }}</span>-->
                    <!--                    </span>-->

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
        metaInfo: {
            // if no subcomponents specify a metaInfo.title, this title will be used
            title: "Task Manager"
        },
        data() {
            return {
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

                // define the default value
                value: null,
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
                    for(let i = 0; i < arr.length; i++){
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
            departments2() {
                const arr = this.$store.state.api.departments;
                let tree = [],
                    mappedArr = {},
                    arrElem,
                    mappedElem;

                // First map the nodes of the array to an object -> create a hash table.
                for (let i = 0, len = arr.length; i < len; i++) {
                    arrElem = arr[i];
                    mappedArr[arrElem.ID] = arrElem;
                    mappedArr[arrElem.ID]['children'] = [];
                }


                for (let id in mappedArr) {
                    if (mappedArr.hasOwnProperty(id)) {
                        mappedElem = mappedArr[id];
                        // If the element is not at the root level, add it to its parent array of children.
                        if (mappedElem.Parent_ID !== -1) {
                            tree.find(el => el['ID'] === mappedElem['Parent_ID']).children.push({
                                ...mappedElem,
                                id: mappedElem.ID,
                                label: mappedElem.Name
                            })
                        }
                        // If the element is at the root level, add it to first level elements array.
                        else {
                            tree.push({
                                id: mappedElem.ID,
                                label: mappedElem.Name,
                                ...mappedElem,
                                children: [],
                            });
                        }
                    }
                }
                return tree;
            },
        },
        methods: {
            addOrUpdateEmployee() {
                if (this.employee.update) {
                    this.loading = true;
                    this.$store.dispatch('updateEmployee', this.employee)
                        .then(res => {
                            console.log('res', res);
                        })
                        .catch(err => {
                            console.log('err', err);

                        })
                } else {
                    this.loading = true;
                    this.$store.dispatch('addEmployee', this.employee)
                        .then(res => {
                            console.log('res', res);
                        })
                        .catch(err => {
                            console.log('err', err);

                        })
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

                const msg = `آیا واقعا می‌خواهید کارمند «${employee.Name + ' ' + employee.LastName}» را حذف کنید؟`;
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
                        if (ok)
                            this.$store.dispatch('removeEmployee', employee.ID)
                    })
            },
            onModalHidden() {
                this.employee = {
                    Name: '',
                    IP: '',
                    Port: '',
                    CommKey: '0',
                    update: false
                }
            },
        },
        async created() {
            await this.$store.dispatch('getEmployees');
            await this.$store.dispatch('getDepartments');
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

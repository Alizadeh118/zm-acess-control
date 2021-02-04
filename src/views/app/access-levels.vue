<template>
    <div class="main-content">
        <breadcumb page="دسترسی‌ها"/>
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
                      initialSortBy: {field: 'Name', type: 'asc'}
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
                    styleClass="tableOne vgt-table"
                    :rows="$store.state.api.accessLevels"
            >
                <div slot="emptystate" class="text-center py-2">
                    <span v-if="loading.getAccessLevels">در حال دریافت لیست سطوح دسترسی...</span>
                    <span v-else>سطح دسترسی برای نمایش وجود ندارد</span>
                </div>
                <div slot="table-actions" class="mb-4">
                    <b-button variant="primary" class="btn-rounded d-none d-sm-block" v-b-modal.addAccessLevel
                    ><i class="i-Add-Window align-middle text-white mr-2"> </i>افزودن دسترسی
                    </b-button>

                    <b-modal id="addAccessLevel" :title="accessLevel.update ? 'ویرایش دسترسی' : 'افزودن دسترسی'"
                             size="lg"
                             @ok.prevent="addOrUpdateAccessLevel" @hidden="onModalHidden">
                        <b-form>

                            <b-row>
                                <b-col>
                                    <b-form-group label="نام دسترسی:">
                                        <b-form-input
                                                type="text"
                                                required
                                                v-model="accessLevel.Name"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <b-form-group label="محدوده زمانی:">
                                        <b-form-select
                                                required
                                                :options="$store.state.api.timezones"
                                                value-field="ID" text-field="Name"
                                                v-model="accessLevel.Timezone_ID"
                                        ></b-form-select>
                                    </b-form-group>
                                </b-col>
                            </b-row>

                            <b-form-group label="کارمندان:">
                                <treeselect v-model="accessLevel.employee" :options="employees"
                                            value-consists-of="LEAF_PRIORITY"
                                            noOptionsText="گزینه‌ای وجود ندارد"
                                            multiple :limit="6" :limitText="count => `+${count}`"
                                            placeholder="کارمند(های) مربوط را انتخاب کنید"
                                            clearAllText="حذف همه گزینه‌ها"/>
                            </b-form-group>

                            <b-form-group label="دستگاه‌ها:">
                                <treeselect v-model="accessLevel.device" :options="devices"
                                            noOptionsText="گزینه‌ای وجود ندارد"
                                            multiple :limit="6" :limitText="count => `+${count}`"
                                            placeholder="دستگاه(های) مربوط را انتخاب کنید"
                                            clearAllText="حذف همه گزینه‌ها"/>
                            </b-form-group>

                        </b-form>
                        <template v-slot:modal-footer="{ ok, cancel }">
                            <div class="spinner-modal d-flex align-items-center">
                                <div class="spinner-bubble spinner-bubble-primary"
                                     v-show="loading.addOrUpdateAccessLevel"></div>
                                <span class="ml-4 text-primary" v-show="loading.addOrUpdateAccessLevel">{{ loading.addOrUpdateAccessLevelText }}</span>
                            </div>
                            <b-button variant="secondary" @click="cancel()" :disabled="loading.addOrUpdateAccessLevel">
                                انصراف
                            </b-button>
                            <b-button variant="primary" @click="ok()" :disabled="loading.addOrUpdateAccessLevel">
                                {{ accessLevel.update ? 'تایید و ویرایش دسترسی' : 'تایید و افزودن دسترسی' }}
                            </b-button>
                        </template>
                    </b-modal>
                </div>
                <div slot="table-actions-bottom" class="text-right mt-16">
                    <b-button variant="dark" class="btn-rounded" :disabled="loading.syncAccesses.includes(-1)"
                              @click="syncAccesses(-1)">
                        <i class="i-Arrow-Refresh align-middle d-inline-block mr-2"
                           :class="{'spin': loading.syncAccesses.includes(-1)}"></i>
                        <span>همگام‌سازی دسترسی‌ها</span>
                    </b-button>
                </div>


                <template slot="table-row" slot-scope="props">

                    <div v-if="props.column.field === 'Button'">

                        <a href="#" @click.prevent="syncAccesses(props.row.ID)"
                           :class="{'opacity-2 pointer-events-none': loading.syncAccesses.includes(props.row.ID) || loading.syncAccesses.includes(-1)}"
                           v-b-tooltip.hover
                           class="o-hidden d-inline-block"
                           title="همگام سازی دسترسی">
                            <i class="i-Arrow-Refresh text-25 text-info mr-2 d-inline-block"
                               :class="{'spin': loading.syncAccesses.includes(props.row.ID) || loading.syncAccesses.includes(-1)}"></i>
                        </a>
                        <a @click.prevent="editAccessLevel(props.row)"
                           href=""
                           v-b-tooltip.hover
                           class="o-hidden d-inline-block"
                           title="ویرایش دسترسی">
                            <i class="i-Eraser-2 text-25 text-info mr-2"></i>
                        </a>
                        <a @click.prevent="removeAccessLevel(props.row)"
                           href=""
                           v-b-tooltip.hover
                           class="o-hidden d-inline-block"
                           title="حذف دسترسی">
                            <i class="i-Close-Window text-25 text-danger"></i>
                        </a>

                    </div>

                    <div v-else-if="props.column.field === 'Employees'">
                        <span>{{ props.row.Employees.length }} کارمند</span>
                        <a v-if="props.row.Employees.length"
                           href="#" class="badge btn-outline-facebook ml-2"
                           @click.prevent="employeesList = props.row.Employees"
                           v-b-modal.employees>نمایش</a>
                    </div>

                    <div v-else-if="props.column.field === 'Devices'">
                        <span>{{ props.row.Devices.length }} دستگاه</span>
                        <a v-if="props.row.Devices.length"
                           href="#" class="badge btn-outline-facebook ml-2"
                           @click.prevent="devicesList = props.row.Devices"
                           v-b-modal.devices>نمایش</a>
                    </div>

                </template>

            </vue-good-table>
            <b-modal id="syncAccessesProgressModal" title="دریافت داده‌ها" hide-footer no-close-on-backdrop
                     no-close-on-esc hide-header-close>
                <p class="mt-2 text-center">لطفا تا اتمام کامل عملیات منتظر بمانید</p>
                <b-progress class="mb-2 mt-4" :value="syncAccessesProgressValue" striped animated></b-progress>
            </b-modal>
        </b-card>
        <b-modal id="employees" title="لیست کارمندان" hide-footer>
            <b-list-group flush>
                <b-list-group-item v-for="(employee, i) in employeesList" :key="employee.ID">
                    {{ (i + 1) + '. ' + (employee.Name || '') + ' ' + (employee.LastName || '') }}
                </b-list-group-item>
            </b-list-group>
        </b-modal>
        <b-modal id="devices" title="لیست دستگاه‌ها" hide-footer>
            <b-list-group flush>
                <b-list-group-item v-for="(device,i) in devicesList" :key="device.ID">
                    {{ (i + 1) + '. ' + device.Name }}
                </b-list-group-item>
            </b-list-group>
        </b-modal>
    </div>
</template>

<script>
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    export default {
        metaInfo () {
            return {
                title: "دسترسی‌ها",
            }
        },
        components: {
            Treeselect
        },
        data () {
            return {
                loading: {
                    addOrUpdateAccessLevel: false,
                    addOrUpdateAccessLevelText: '',
                    removeAccessLevel: false,
                    syncAccesses: [],
                    getAccessLevels: true,
                },
                columns: [
                    {
                        label: "نام دسترسی",
                        field: "Name"
                    },
                    {
                        label: "کارمندان",
                        field: "Employees"
                    },
                    {
                        label: "دستگاه‌ها",
                        field: "Devices"
                    },
                    {
                        label: "محدوده زمانی",
                        field: "Timezone_Name"
                    },
                    {
                        label: "عملیات",
                        field: "Button",
                        html: true,
                        sortable: false,
                        tdClass: "",
                        thClass: ""
                    }
                ],
                accessLevel: {
                    Name: '',
                    Timezone_ID: null,
                    employee: [],
                    device: [],
                    Is_Guest: false,
                    update: false
                },
                employeesList: [],
                devicesList: [],
                syncAccessesProgressValue: 0,
                syncAccessesProgressInterval: null,
            };
        },
        computed: {
            employees () {
                const departments = []
                for ( const employee of this.$store.state.api.employees )
                    if ( !departments.find(d => d.id === employee.Department_ID) )
                        departments.push({
                            id: employee.Department_ID,
                            label: employee.Department_Name,
                            children: [],
                        });

                for ( const employee of this.$store.state.api.employees ) {
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
            devices () {
                return this.$store.state.api.devices.map(device => {
                    return {
                        ...device,
                        id: device.ID,
                        label: device.Name
                    }
                })
            },
        },
        methods: {
            addOrUpdateAccessLevel () {
                this.loading.addOrUpdateAccessLevel = true;
                this.loading.addOrUpdateAccessLevelText = this.accessLevel.update ? 'ویرایش دسترسی...' : 'ایجاد دسترسی...';

                if ( typeof this.accessLevel.employee === "string" )
                    this.accessLevel.employee = this.accessLevel.employee.split(',')


                if ( this.accessLevel.update ) {
                    this.$store.dispatch('updateAccessLevel', this.accessLevel)
                        .then(() => {
                            this.loading.addOrUpdateAccessLevelText = 'ویرایش کارمندان و دستگاه‌ها...';
                            this.$store.dispatch('addAccessLevelMembers', {
                                ...this.accessLevel,
                                ID: this.accessLevel.ID
                            })
                                .then(() => {
                                    this.$bvModal.hide('addAccessLevel');
                                    this.$bvToast.toast(`دسترسی با موفقیت ویرایش شد`, {
                                        title: `ویرایش دسترسی`,
                                        variant: 'success',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .catch(err => {
                                    console.log('Could not update accessLevel members', err);
                                    this.$bvToast.toast(`ویرایش دسترسی با خطا همراه بود`, {
                                        title: `ویرایش دسترسی`,
                                        variant: 'danger',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .finally(() => this.loading.addOrUpdateAccessLevel = false)

                        })
                        .catch(err => {
                            this.loading.addOrUpdateAccessLevel = false;
                            console.log('Could not update accessLevel', err);
                            let msg
                            try {
                                msg = err.response.data.Message
                            } catch ( e ) {
                                msg = 'ویرایش دسترسی با خطا همراه بود'
                            }
                            this.$bvToast.toast(msg, {
                                title: `ویرایش دسترسی`,
                                variant: 'danger',
                                toaster: 'b-toaster-top-left'
                            });
                        })

                } else {

                    this.$store.dispatch('addAccessLevel', this.accessLevel)
                        .then(accessLevel => {
                            this.loading.addOrUpdateAccessLevelText = 'افزودن کارمندان و دستگاه‌ها...';
                            this.$store.dispatch('addAccessLevelMembers', { ...this.accessLevel, ID: accessLevel.ID })
                                .then(() => {
                                    this.$bvModal.hide('addAccessLevel');
                                    this.$bvToast.toast(`دسترسی با موفقیت افزوده شد`, {
                                        title: `افزودن دسترسی`,
                                        variant: 'success',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .catch(err => {
                                    console.log('Could not add accessLevel members', err);
                                    this.$store.dispatch('removeAccessLevel', accessLevel.ID);
                                    this.$bvToast.toast(`افزودن دسترسی با خطا همراه بود`, {
                                        title: `افزودن دسترسی`,
                                        variant: 'danger',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .finally(() => this.loading.addOrUpdateAccessLevel = false)

                        })
                        .catch(err => {
                            this.loading.addOrUpdateAccessLevel = false;
                            console.log('Could not add accessLevel', err);
                            let msg
                            try {
                                msg = err.response.data.Message
                            } catch ( e ) {
                                msg = 'افزودن دسترسی با خطا همراه بود'
                            }
                            this.$bvToast.toast(msg, {
                                title: `افزودن دسترسی`,
                                variant: 'danger',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                }
            },
            editAccessLevel (accessLevel) {
                this.accessLevel = {
                    ...accessLevel,
                    employee: accessLevel.Employees.map(e => e.ID),
                    device: accessLevel.Devices.map(e => e.ID),
                    update: true
                };
                this.$bvModal.show('addAccessLevel');
            },
            removeAccessLevel (accessLevel) {

                const msg = `آیا واقعا می‌خواهید دسترسی «${ accessLevel.Name }» را حذف کنید؟`;
                this.$bvModal
                    .msgBoxConfirm(msg, {
                        title: "حذف دسترسی",
                        buttonSize: "sm",
                        okVariant: "danger",
                        okTitle: "بله، دسترسی حذف شود",
                        cancelTitle: "انصراف",
                        footerClass: "p-2",
                        hideHeaderClose: false,
                        centered: true
                    })
                    .then(ok => {
                        if ( ok ) {
                            this.loading.removeAccessLevel = true;
                            this.$store.dispatch('removeAccessLevel', accessLevel.ID)
                                .then(() => {
                                    this.$bvToast.toast(`دسترسی با موفقیت حذف شد`, {
                                        title: `حذف دسترسی`,
                                        variant: 'success',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .catch(() => {
                                    this.$bvToast.toast(`حذف دسترسی با خطا همراه بود`, {
                                        title: `حذف دسترسی`,
                                        variant: 'danger',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .finally(() => this.loading.removeAccessLevel = false)
                        }
                    })
            },
            syncAccesses (accessIds) {
                if ( this.loading.syncAccesses.includes(accessIds) ) return;
                this.loading.syncAccesses.push(accessIds);
                if ( accessIds === -1 )
                    this.triggerProgressModal(true)
                this.$store.dispatch('syncAccesses', Array.isArray(accessIds) ? accessIds : [accessIds])
                    .then(() => {
                        this.$bvToast.toast(`همگام‌سازی دسترسی(ها) با موفقیت انجام شد`, {
                            title: `همگام‌سازی`,
                            variant: 'success',
                            toaster: 'b-toaster-top-left',
                        });
                    })
                    .catch(() => {
                        this.$bvToast.toast(`همگام‌سازی دسترسی(ها) با خطا همراه بود`, {
                            title: `همگام‌سازی`,
                            variant: 'danger',
                            toaster: 'b-toaster-top-left'
                        });
                    })
                    .finally(() => {
                        if ( accessIds === -1 )
                            setTimeout(() => {
                                this.triggerProgressModal(false)
                            }, 1000)
                        this.loading.syncAccesses = this.loading.syncAccesses.filter(i => i !== accessIds)
                    })
            },
            onModalHidden () {
                this.accessLevel = {
                    Name: '',
                    Timezone_ID: null,
                    employee: [],
                    device: [],
                    Is_Guest: false,
                    update: false
                }
            },
            triggerProgressModal (show = false) {
                if ( show ) {
                    this.$bvModal.show('syncAccessesProgressModal');
                    this.syncAccessesProgressInterval = setInterval(() => {
                        this.$store.dispatch('syncDevicesProgress')
                            .then(value => this.syncAccessesProgressValue = value)
                    }, 500)
                } else {
                    this.$bvModal.hide('syncAccessesProgressModal');
                    clearInterval(this.syncAccessesProgressInterval);
                }
            }
        },
        created () {
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

            if ( !this.$store.state.api.devices.length )
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

            if ( !this.$store.state.api.employees.length )
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

            if ( !this.$store.state.api.timezones.length )
                this.$store.dispatch('getTimezones')
                    .catch(e => {
                        console.log('Could not get timezones', e);
                        this.$bvToast.toast(`دریافت لیست محدوده زمانی با خطا همراه بود`, {
                            title: `لیست محدوده زمانی`,
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

    .vgt-wrap__actions-footer {
        border: 0 !important;
    }
</style>

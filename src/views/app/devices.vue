<template>
    <div class="main-content">
        <breadcumb page="دستگاه‌ها"/>
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
                    :rows="$store.state.api.devices"
            >
                <div slot="emptystate" class="text-center py-2">
                    <span v-if="loading.getDevices">در حال دریافت لیست دستگاه‌ها...</span>
                    <span v-else>دستگاهی برای نمایش وجود ندارد</span>
                </div>
                <div slot="table-actions" class="mb-4">
                    <b-button variant="primary" class="btn-rounded d-none d-sm-block" v-b-modal.addDevice
                    ><i class="i-Add-Window align-middle text-white mr-2"> </i>افزودن دستگاه
                    </b-button>

                    <b-modal id="addDevice" :title="device.update ? 'ویرایش دستگاه' : 'افزودن دستگاه'"
                             @ok.prevent="addOrUpdateDevice" @hidden="onModalHidden">
                        <b-form>
                            <b-form-group
                                    label="نام دستگاه:"
                                    label-for="input-1"
                            >
                                <b-form-input
                                        type="text"
                                        required
                                        placeholder="ورودی ساختمان یک"
                                        v-model="device.Name"
                                ></b-form-input>
                            </b-form-group>

                            <b-row>
                                <b-col md="8">
                                    <b-form-group
                                            label="آدرس IP:"
                                            label-for="input-1"
                                    >
                                        <b-form-input
                                                type="text"
                                                class="dir-ltr text-right"
                                                required
                                                placeholder="192.168.1.100"
                                                v-model="device.IP"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>

                                <b-col md="4" class="mt-3 mt-md-0">
                                    <b-form-group
                                            label="شماره Port:"
                                            label-for="input-1"
                                    >
                                        <b-form-input
                                                type="text"
                                                class="dir-ltr text-right"
                                                required
                                                placeholder="4370"
                                                v-model="device.Port"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>

                            </b-row>


                            <b-form-group id="input-group-4" class="mt-3" v-show="!device.update">

                                <b-row>
                                    <b-col>
                                        <b-form-checkbox v-model="syncTimeChecked">زمان دستگاه تنظیم شود
                                        </b-form-checkbox>
                                    </b-col>
                                    <b-col cols="auto">
                                        <b-form-checkbox v-model="clearDataChecked" class="ml-0">داده‌های دستگاه پاک شود
                                        </b-form-checkbox>
                                    </b-col>
                                </b-row>

                            </b-form-group>
                        </b-form>
                        <template v-slot:modal-footer="{ ok, cancel }">
                            <div class="spinner-bubble spinner-bubble-sm spinner-bubble-primary spinner-modal"
                                 v-show="loading.addOrUpdateDevice"></div>
                            <b-button variant="secondary" @click="cancel()" :disabled="loading.addOrUpdateDevice">
                                انصراف
                            </b-button>
                            <b-button variant="primary" @click="ok()" :disabled="loading.addOrUpdateDevice">
                                {{ device.update ? 'تایید و ویرایش دستگاه' : 'تایید و افزودن دستگاه' }}
                            </b-button>
                        </template>
                    </b-modal>
                </div>
                <div slot="table-actions-bottom" class="text-right mt-16">
                    <b-button variant="dark" class="btn-rounded"
                              :disabled="!!loading.syncDevices.length || $store.state.api.devices.every(d=> d.State !== true)"
                              @click="syncDevices(-1)">
                        <i class="i-Arrow-Refresh align-middle d-inline-block mr-2"
                           :class="{'spin': loading.syncDevices.includes(-1)}"></i>
                        <span>همگام‌سازی دستگاه‌ها</span>
                    </b-button>
                </div>
                <template slot="table-row" slot-scope="props">

                    <span v-if="props.column.field === 'State'">
                      <span class="badge badge-primary" v-if="props.row.State">متصل</span>
                      <span class="badge badge-secondary" v-else>غیر متصل</span>
                    </span>

                    <div v-else-if="props.column.field === 'Button'">

                        <a href="#" @click.prevent="syncDevices(props.row.ID)"
                           :class="{'opacity-2 pointer-events-none': !props.row.State || loading.syncDevices.includes(props.row.ID) || loading.syncDevices.includes(-1)}"
                           v-b-tooltip.hover
                           class="o-hidden d-inline-block mx-3"
                           title="همگام سازی دستگاه">
                            <i class="i-Arrow-Refresh text-25 text-info d-inline-block"
                               :class="{'spin': loading.syncDevices.includes(props.row.ID) || loading.syncDevices.includes(-1)}"></i>
                        </a>

                        <a href="#" @click.prevent="getDataFromDevice(props.row)"
                           :class="{'opacity-2 pointer-events-none': !props.row.State || loading.getDataFromDevice.includes(props.row.ID)}"
                           v-b-tooltip.hover
                           class="o-hidden d-inline-block mx-3"
                           title="دریافت داده‌های دستگاه">
                            <i class="i-Data-Download text-25 text-info"></i>
                        </a>

                        <a href="#" @click.prevent="syncTime(props.row)"
                           :class="{'opacity-2 pointer-events-none': !props.row.State || loading.syncTime.includes(props.row.ID)}"
                           v-b-tooltip.hover
                           class="o-hidden d-inline-block mx-3"
                           title="تنظیم زمان دستگاه">
                            <i class="i-Clock-Back text-25 text-info"></i>
                        </a>

                        <a href="#" @click.prevent="clearData(props.row)"
                           :class="{'opacity-2 pointer-events-none': !props.row.State || loading.clearData.includes(props.row.ID)}"
                           v-b-tooltip.hover
                           class="o-hidden d-inline-block mx-3"
                           title="پاکسازی داده‌های دستگاه">
                            <i class="i-Cloud-Remove text-25 text-warning"></i>
                        </a>

                        <a href="#" @click.prevent="removeDevice(props.row)"
                           :class="{'opacity-2 pointer-events-none': loading.removeDevice}"
                           v-b-tooltip.hover
                           class="o-hidden d-inline-block mx-3"
                           title="حذف دستگاه">
                            <i class="i-Close-Window text-25 text-danger"></i>
                        </a>

                    </div>

                </template>

            </vue-good-table>
        </b-card>

        <b-modal id="syncDevicesProgressModal" title="دریافت داده‌ها" hide-footer no-close-on-backdrop
                 no-close-on-esc hide-header-close>
            <p class="mt-2 text-center">لطفا تا اتمام کامل عملیات منتظر بمانید</p>
            <b-progress class="mb-2 mt-4" :value="syncDevicesProgressValue" striped animated></b-progress>
        </b-modal>
    </div>
</template>

<script>
    export default {
        metaInfo () {
            return {
                title: "دستگاه‌ها",
            }
        },
        data () {
            return {
                loading: {
                    clearData: [],
                    syncTime: [],
                    getDataFromDevice: [],
                    syncDevices: [],
                    addOrUpdateDevice: false,
                    removeDevice: false,
                    getDevices: true,
                },
                columns: [
                    {
                        label: "نام دستگاه",
                        field: "Name"
                    },
                    {
                        label: "وضعیت",
                        field: "State"
                    },
                    {
                        label: "آدرس IP",
                        field: "IP"
                    },
                    {
                        label: "شماره Port",
                        field: "Port"
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
                device: {
                    Name: '',
                    IP: '',
                    Port: '',
                    CommKey: '0',
                    update: false
                },
                syncTimeChecked: false,
                clearDataChecked: false,
                syncDevicesProgressValue: 0,
                syncDevicesProgressInterval: null,
                getDevicesStateInterval: null
            };
        },
        methods: {
            addOrUpdateDevice () {
                this.loading.addOrUpdateDevice = true;

                for ( const key in this.device )
                    if ( this.device[key].length )
                        this.device[key] = this.persian2english(this.device[key]);

                if ( this.device.update ) {
                    this.$store.dispatch('updateDevice', this.device)
                        .then(() => {
                            this.$bvModal.hide('addDevice')
                            this.$bvToast.toast(`دستگاه با موفقیت ویرایش شد`, {
                                title: `ویرایش دستگاه`,
                                variant: 'success',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                        .catch(err => {
                            console.log('Could not update device', err);
                            this.$bvToast.toast(`ویرایش دستگاه با خطا همراه بود`, {
                                title: `ویرایش دستگاه`,
                                variant: 'danger',
                                toaster: 'b-toaster-top-left'
                            });

                        })
                        .finally(() => this.loading.addOrUpdateDevice = false)
                } else {
                    this.$store.dispatch('addDevice', this.device)
                        .then(device => {
                            if ( this.syncTimeChecked )
                                this.syncTime(device);
                            if ( this.clearDataChecked )
                                this.clearData(device);
                            this.$bvModal.hide('addDevice');
                            this.$bvToast.toast(`دستگاه با موفقیت افزوده شد`, {
                                title: `افزودن دستگاه`,
                                variant: 'success',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                        .catch(err => {
                            console.log('Could not add device', err);
                            let msg
                            try {
                                msg = err.response.data.Message
                            } catch ( e ) {
                                msg = 'افزودن دستگاه با خطا همراه بود'
                            }
                            this.$bvToast.toast(msg, {
                                title: `افزودن دستگاه`,
                                variant: 'danger',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                        .finally(() => this.loading.addOrUpdateDevice = false)
                }
            },
            getDevicesState () {
                this.$store.dispatch('getDevicesState');
                this.getDevicesStateInterval = setTimeout(() => {
                    this.getDevicesState()
                }, 60000) // sync devices state every 60 seconds
            },
            removeDevice (device) {
                if ( this.loading.removeDevice ) return;
                const msg = `آیا واقعا می‌خواهید دستگاه با نام «${ device.Name }» را حذف کنید؟`
                this.$bvModal
                    .msgBoxConfirm(msg, {
                        title: "حذف دستگاه",
                        buttonSize: "sm",
                        okVariant: "danger",
                        okTitle: "بله، دستگاه حذف شود",
                        cancelTitle: "انصراف",
                        footerClass: "p-2",
                        hideHeaderClose: false,
                        centered: true
                    })
                    .then(ok => {
                        if ( ok ) {
                            this.loading.removeDevice = true;
                            this.$store.dispatch('removeDevice', device.ID)
                                .then(() => {
                                    this.$bvToast.toast(`دستگاه با موفقیت حذف شد`, {
                                        title: `حذف دستگاه`,
                                        variant: 'success',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .catch(() => {
                                    this.$bvToast.toast(`حذف دستگاه با خطا همراه بود`, {
                                        title: `حذف دستگاه`,
                                        variant: 'danger',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .finally(() => this.loading.removeDevice = false)
                        }
                    })
            },
            clearData (device) {
                if ( this.loading.clearData.includes(device.ID) ) return;
                const msg = `آیا واقعا می‌خواهید داده‌های دستگاه با نام «${ device.Name }» را حذف کنید؟`
                this.$bvModal
                    .msgBoxConfirm(msg, {
                        title: "پاکسازی داده‌های دستگاه",
                        buttonSize: "sm",
                        okVariant: "danger",
                        okTitle: "بله، داده‌ها حذف شود",
                        cancelTitle: "انصراف",
                        footerClass: "p-2",
                        hideHeaderClose: false,
                        centered: true
                    })
                    .then(ok => {
                        if ( ok ) {
                            this.loading.clearData.push(device.ID)
                            this.$store.dispatch('clearData', device.ID)
                                .then(() => {
                                    this.$bvToast.toast(`پاکسازی داده‌های دستگاه با موفقیت انجام شد`, {
                                        title: `پاکسازی دستگاه`,
                                        variant: 'success',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .catch(() => {
                                    this.$bvToast.toast(`پاکسازی داده‌های دستگاه با خطا همراه بود`, {
                                        title: `پاکسازی دستگاه`,
                                        variant: 'danger',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .finally(() => this.loading.clearData = this.loading.clearData.filter(i => i !== device.ID))
                        }
                    })
            },
            syncTime (device) {
                if ( this.loading.syncTime.includes(device.ID) ) return;
                this.loading.syncTime.push(device.ID);
                this.$store.dispatch('syncTime', device.ID)
                    .then(() => {
                        this.$bvToast.toast(`زمان دستگاه با موفقیت تنظیم شد`, {
                            title: `تنظیم زمان`,
                            variant: 'success',
                            toaster: 'b-toaster-top-left',
                        });
                    })
                    .catch(() => {
                        this.$bvToast.toast(`تنظیم زمان دستگاه با خطا همراه بود`, {
                            title: `تنظیم زمان`,
                            variant: 'danger',
                            toaster: 'b-toaster-top-left'
                        });
                    })
                    .finally(() => this.loading.syncTime = this.loading.syncTime.filter(i => i !== device.ID))
            },
            getDataFromDevice (device) {
                if ( this.loading.getDataFromDevice.includes(device.ID) ) return;
                this.loading.getDataFromDevice.push(device.ID);

                this.$store.dispatch('getDataFromDevice', device.ID)
                    .then(() => {
                        this.$bvToast.toast(`داده‌های دستگاه با موفقیت دریافت شد`, {
                            title: `دریافت داده‌ها`,
                            variant: 'success',
                            toaster: 'b-toaster-top-left',
                        });
                    })
                    .catch(() => {
                        this.$bvToast.toast(`دریافت داده‌های دستگاه با خطا همراه بود`, {
                            title: `دریافت داده‌ها`,
                            variant: 'danger',
                            toaster: 'b-toaster-top-left'
                        });
                    })
                    .finally(() => this.loading.getDataFromDevice = this.loading.getDataFromDevice.filter(i => i !== device.ID))
            },
            syncDevices (deviceIds) {
                if ( this.loading.syncDevices.includes(deviceIds) ) return;
                this.loading.syncDevices.push(deviceIds);
                if ( deviceIds === -1 )
                    this.triggerProgressModal(true)
                this.$store.dispatch('syncDevices', Array.isArray(deviceIds) ? deviceIds : [deviceIds])
                    .then(() => {
                        this.$bvToast.toast(`همگام‌سازی دستگاه(ها) با موفقیت انجام شد`, {
                            title: `همگام‌سازی`,
                            variant: 'success',
                            toaster: 'b-toaster-top-left',
                        });
                    })
                    .catch(() => {
                        this.$bvToast.toast(`همگام‌سازی دستگاه(ها) با خطا همراه بود`, {
                            title: `همگام‌سازی`,
                            variant: 'danger',
                            toaster: 'b-toaster-top-left'
                        });
                    })
                    .finally(() => {
                        if ( deviceIds === -1 )
                            setTimeout(() => {
                                this.triggerProgressModal(false)
                            }, 1000)
                        this.loading.syncDevices = this.loading.syncDevices.filter(i => i !== deviceIds)
                    })
            },
            onModalHidden () {
                this.device = {
                    Name: '',
                    IP: '',
                    Port: '',
                    CommKey: '0',
                    update: false
                };
                this.syncTimeChecked = false;
                this.clearDataChecked = false;
            },
            triggerProgressModal (show = false) {
                if ( show ) {
                    this.$bvModal.show('syncDevicesProgressModal');
                    this.syncDevicesProgressInterval = setInterval(() => {
                        this.$store.dispatch('syncDevicesProgress')
                            .then(value => this.syncDevicesProgressValue = value)
                    }, 500)
                } else {
                    this.$bvModal.hide('syncDevicesProgressModal');
                    clearInterval(this.syncDevicesProgressInterval);
                }
            }
        },
        created () {
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
                    })
                    .finally(() => this.loading.getDevices = false)

            this.$store.commit('CHANGE_WANT_TO_GET_DEVICES_STATE', true)
            this.getDevicesState()
        },
        beforeDestroy () {
            this.$store.commit('CHANGE_WANT_TO_GET_DEVICES_STATE', false)
            clearInterval(this.getDevicesStateInterval)
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

    .btn-link:focus, .btn-link.focus {
        text-decoration: none !important;
    }

    .vgt-wrap__actions-footer {
        border: 0 !important;
    }
</style>

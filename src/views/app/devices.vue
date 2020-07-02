<template>
    <div class="main-content">
        <breadcumb page="دستگاه" :folder="'دستگاه‌ها'"/>
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
                      enabled: false,
                      initialSortBy: {field: 'Name', type: 'asc'}
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
                    :rows="$store.state.api.devices"
            >
                <div slot="emptystate" class="text-center py-2">
                    دستگاهی برای نمایش وجود ندارد
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
                                                placeholder="4376"
                                                v-model="device.Port"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>

                            </b-row>


                            <b-form-group id="input-group-4" class="mt-3">

                                <b-row>
                                    <b-col>
                                        <b-form-checkbox v-model="syncTimeChecked">زمان دستگاه تنظیم شود</b-form-checkbox>
                                    </b-col>
                                    <b-col cols="auto">
                                        <b-form-checkbox v-model="clearDataChecked" class="ml-0">داده‌های دستگاه پاک شود
                                        </b-form-checkbox>
                                    </b-col>
                                </b-row>

                            </b-form-group>
                        </b-form>
                        <template v-slot:modal-footer="{ ok, cancel }">
                            <div class="spinner-bubble spinner-bubble-primary" v-show="loading.addOrUpdateDevice"></div>
                            <b-button variant="secondary" @click="cancel()" :disabled="loading.addOrUpdateDevice">
                                انصراف
                            </b-button>
                            <b-button variant="primary" @click="ok()" :disabled="loading.addOrUpdateDevice">
                                {{ device.update ? 'تایید و ویرایش دستگاه' : 'تایید و افزودن دستگاه' }}
                            </b-button>
                        </template>
                    </b-modal>
                </div>

                <template slot="table-row" slot-scope="props">

                    <span v-if="props.column.field === 'State'">
                      <span class="badge badge-primary" v-if="props.row.State">متصل</span>
                      <span class="badge badge-secondary" v-else>غیر متصل</span>
                    </span>

                    <div v-else-if="props.column.field === 'Button'">

                        <a href="#" @click.prevent="syncTime(props.row)"
                           :class="{'opacity-2': loading.syncTime}"
                           :disabled="loading.syncTime"
                           v-b-tooltip.hover
                           class="o-hidden d-inline-block mx-3"
                           title="تنظیم زمان دستگاه">
                            <i class="i-Clock-Back text-25 text-info"></i>
                        </a>

                        <a href="#" @click.prevent="clearData(props.row)"
                           :class="{'opacity-2': loading.clearData}"
                           :disabled="loading.clearData"
                           v-b-tooltip.hover
                           class="o-hidden d-inline-block mx-3"
                           title="پاکسازی داده‌های دستگاه">
                            <i class="i-Cloud-Remove text-25 text-warning"></i>
                        </a>

                         <a href="#" @click.prevent="editDevice(props.row)"
                            v-b-tooltip.hover
                            class="o-hidden d-inline-block mx-3"
                            title="ویرایش دستگاه">
                            <i class="i-Eraser-2 text-25 text-info"></i>
                          </a>

                         <a href="#" @click.prevent="removeDevice(props.row)"
                            :class="{'opacity-2': loading.removeDevice}"
                            :disabled="loading.removeDevice"
                            v-b-tooltip.hover
                            class="o-hidden d-inline-block mx-3"
                            title="حذف دستگاه">
                            <i class="i-Close-Window text-25 text-danger"></i>
                         </a>

                    </div>

                </template>

            </vue-good-table>
        </b-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: {
                    clearData: false,
                    syncTime: false,
                    addOrUpdateDevice: false,
                    removeDevice: false,
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
            };
        },
        methods: {
            addOrUpdateDevice() {
                this.loading.addOrUpdateDevice = true;
                if (this.device.update) {
                    this.$store.dispatch('updateDevice', this.device)
                        .then(device => {
                            if (this.syncTimeChecked)
                                this.syncTime(device);
                            if (this.clearDataChecked)
                                this.clearData(device);
                            this.$bvModal.hide('addDevice')
                            this.$bvToast.toast(`دستگاه با موفقیت ویرایش شد`, {
                                title: `ویرایش دستگاه`,
                                variant: 'success',
                                toaster: 'b-toaster-bottom-right'
                            });
                        })
                        .catch(err => {
                            console.log('Could not update device', err);
                            this.$bvToast.toast(`ویرایش دستگاه با خطا همراه بود`, {
                                title: `ویرایش دستگاه`,
                                variant: 'danger',
                                toaster: 'b-toaster-bottom-right'
                            });

                        })
                        .finally(() => this.loading.addOrUpdateDevice = false)
                } else {
                    this.$store.dispatch('addDevice', this.device)
                        .then(device => {
                            if (this.syncTimeChecked)
                                this.syncTime(device);
                            if (this.clearDataChecked)
                                this.clearData(device);
                            this.$bvModal.hide('addDevice');
                            this.$bvToast.toast(`دستگاه با موفقیت افزوده شد`, {
                                title: `افزودن دستگاه`,
                                variant: 'success',
                                toaster: 'b-toaster-bottom-right'
                            });
                        })
                        .catch(err => {
                            console.log('Could not add device', err);
                            this.$bvToast.toast(`افزودن دستگاه با خطا همراه بود`, {
                                title: `افزودن دستگاه`,
                                variant: 'danger',
                                toaster: 'b-toaster-bottom-right'
                            });
                        })
                        .finally(() => this.loading.addOrUpdateDevice = false)
                }
            },
            getDevicesState() {
                setInterval(() => {
                    this.$store.dispatch('getDevicesState');
                }, 60000) // sync devices state every 60 seconds
            },
            editDevice(device) {
                this.device = {
                    ...device,
                    update: true
                };
                this.$bvModal.show('addDevice');
            },
            removeDevice(device) {
                if (this.loading.removeDevice) return;
                const msg = `آیا واقعا می‌خواهید دستگاه با نام «${device.Name}» را حذف کنید؟`
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
                        if (ok) {
                            this.loading.removeDevice = true;
                            this.$store.dispatch('removeDevice', device.ID)
                                .then(() => {
                                    this.$bvToast.toast(`دستگاه با موفقیت حذف شد`, {
                                        title: `حذف دستگاه`,
                                        variant: 'success',
                                        toaster: 'b-toaster-bottom-right'
                                    });
                                })
                                .catch(() => {
                                    this.$bvToast.toast(`حذف دستگاه با خطا همراه بود`, {
                                        title: `حذف دستگاه`,
                                        variant: 'danger',
                                        toaster: 'b-toaster-bottom-right'
                                    });
                                })
                                .finally(() => this.loading.removeDevice = false)
                        }
                    })
            },
            clearData(device) {
                if (this.loading.clearData) return;
                const msg = `آیا واقعا می‌خواهید داده‌های دستگاه با نام «${device.Name}» را حذف کنید؟`
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
                        if (ok) {
                            this.loading.clearData = true
                            this.$store.dispatch('clearData', device.ID)
                                .then(() => {
                                    this.$bvToast.toast(`پاکسازی داده‌های دستگاه با موفقیت انجام شد`, {
                                        title: `پاکسازی دستگاه`,
                                        variant: 'success',
                                        toaster: 'b-toaster-bottom-right'
                                    });
                                })
                                .catch(() => {
                                    this.$bvToast.toast(`پاکسازی داده‌های دستگاه با خطا همراه بود`, {
                                        title: `پاکسازی دستگاه`,
                                        variant: 'danger',
                                        toaster: 'b-toaster-bottom-right'
                                    });
                                })
                                .finally(() => this.loading.clearData = false)
                        }
                    })
            },
            syncTime(device) {
                if (this.loading.syncTime) return;
                this.loading.syncTime = true
                this.$store.dispatch('syncTime', device.ID)
                    .then(() => {
                        this.$bvToast.toast(`زمان دستگاه با موفقیت تنظیم شد`, {
                            title: `تنظیم زمان`,
                            variant: 'success',
                            toaster: 'b-toaster-bottom-right',
                        });
                    })
                    .catch(() => {
                        this.$bvToast.toast(`تنظیم زمان دستگاه با خطا همراه بود`, {
                            title: `تنظیم زمان`,
                            variant: 'danger',
                            toaster: 'b-toaster-bottom-right'
                        });
                    })
                    .finally(() => this.loading.syncTime = false)
            },
            onModalHidden() {
                this.device = {
                    Name: '',
                    IP: '',
                    Port: '',
                    CommKey: '0',
                    update: false
                }
                this.syncTimeChecked = false;
                this.clearDataChecked = false;
            },
        },
        async created() {
            await this.$store.dispatch('getDevices');
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

    .spinner-bubble {
        font-size: 4px;
        margin: 0 20px 0 auto !important;
    }
</style>

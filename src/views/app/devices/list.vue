<template>
    <div class="main-content">
        <breadcumb page="دستگاه‌ها" :folder="'زعیم مصباح'"/>
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
                      initialSortBy: {field: 'title', type: 'asc'}
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

                    <b-modal id="addDevice" :title="device.update ? 'ویرایش دستگاه' : 'افزودن دستگاه'" :ok-title="device.update ? 'تایید و ویرایش دستگاه' : 'تایید و افزودن دستگاه'" cancel-title="انصراف"
                             @ok="addOrUpdateDevice" @hidden="onModalHidden">
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
                                <b-form-checkbox-group id="checkboxes-4">
                                    <b-row>
                                        <b-col>
                                            <b-form-checkbox value="me">زمان دستگاه تنظیم شود</b-form-checkbox>

                                        </b-col>
                                        <b-col class="text-right">
                                            <b-form-checkbox value="that" class="ml-0">داده‌های دستگاه پاک شود
                                            </b-form-checkbox>
                                        </b-col>
                                    </b-row>

                                </b-form-checkbox-group>
                            </b-form-group>
                        </b-form>
                    </b-modal>
                </div>

                <template slot="table-row" slot-scope="props">

                    <span v-if="props.column.field === 'State'">
                      <span class="badge badge-primary" v-if="props.row.State">متصل</span>
                      <span class="badge badge-secondary" v-else>غیر متصل</span>
                    </span>

                    <span v-else-if="props.column.field === 'Button'">

                      <a @click="editDevice(props.row)"
                         v-b-tooltip.hover
                         class="o-hidden d-inline-block"
                         title="Edit">
                        <i class="i-Eraser-2 text-25 text-info mr-2"></i>
                      </a>

                      <a @click="removeDevice(props.row)"
                         v-b-tooltip.hover
                         class="o-hidden d-inline-block"
                         title="Delete">
                        <i class="i-Close-Window text-25 text-danger"></i>
                        </a>
                    </span>

                </template>

            </vue-good-table>
        </b-card>
    </div>
</template>

<script>
    export default {
        metaInfo: {
            // if no subcomponents specify a metaInfo.title, this title will be used
            title: "Task Manager"
        },
        data() {
            return {
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
                        label: "Button",
                        field: "Button",
                        html: true,
                        tdClass: "text-right",
                        thClass: "text-right"
                    }
                ],
                device: {
                    Name: '',
                    IP: '',
                    Port: '',
                    CommKey: '0'
                }
            };
        },
        methods: {
            addOrUpdateDevice(update = false) {
                console.log("hello", this.device);
                if (update) {
                    this.loading= true;
                    this.$store.dispatch('updateDevice', this.device)
                        .then(res => {
console.log('res', res);
                        })
                        .catch(err => {
console.log('err', err);

                        })
                }
            },
            getDevicesState() {
                this.$store.dispatch('getDevicesState');
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
                        if (ok)
                            this.$store.dispatch('removeDevice', device.ID)
                    })
            },
            onModalHidden() {
                this.device = {
                    Name: '',
                    IP: '',
                    Port: '',
                    CommKey: '0',
                    update: false
                }
            },
        },
        async created() {
            await this.$store.dispatch('getDevices');
            this.getDevicesState()
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

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
                    :rows="rows"
            >
                <div slot="table-actions" class="mb-4">
                    <b-button variant="primary" class="btn-rounded d-none d-sm-block" v-b-modal.addDevice
                    ><i class="i-Add-Window align-middle text-white mr-2"> </i>افزودن دستگاه
                    </b-button>

                    <b-modal id="addDevice" title="افزودن دستگاه" ok-title="تایید و افزودن دستگاه" cancel-title="انصراف">
                        <b-form>
                            <b-form-group
                                    id="input-group-1"
                                    label="نام دستگاه:"
                                    label-for="input-1"
                            >
                                <b-form-input
                                        id="input-1"
                                        type="text"
                                        required
                                        placeholder="ورودی ساختمان یک"
                                ></b-form-input>
                            </b-form-group>

                            <b-row>
                                <b-col md="8">
                                    <b-form-group
                                            id="input-group-1"
                                            label="آدرس IP:"
                                            label-for="input-1"
                                    >
                                        <b-form-input
                                                id="input-1"
                                                type="text"
                                                class="dir-ltr text-right"
                                                required
                                                placeholder="192.168.1.100"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>

                                <b-col md="4" class="mt-3 mt-md-0">
                                    <b-form-group
                                            id="input-group-1"
                                            label="شماره Port:"
                                            label-for="input-1"
                                    >
                                        <b-form-input
                                                id="input-1"
                                                type="text"
                                                class="dir-ltr text-right"
                                                required
                                                placeholder="4376"
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
                                            <b-form-checkbox value="that" class="ml-0">داده‌های دستگاه پاک شود</b-form-checkbox>
                                        </b-col>
                                    </b-row>

                                </b-form-checkbox-group>
                            </b-form-group>
                        </b-form>
                    </b-modal>
                </div>

                <template slot="table-row" slot-scope="props">
                <span v-if="props.column.field === 'connected'">
                  <span class="badge badge-primary" v-if="props.row.connected">متصل</span>
                  <span class="badge badge-secondary" v-else>غیر متصل</span>
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
                foods: ["apple", "orrange"],
                columns: [
                    {
                        label: "نام دستگاه",
                        field: "title"
                    },
                    {
                        label: "وضعیت",
                        field: "connected"
                    },
                    {
                        label: "آدرس IP",
                        field: "ip"
                    },
                    {
                        label: "شماره Port",
                        field: "port"
                    }
                ],
                rows: [
                    {
                        id: 1,
                        title: "لورم",
                        connected: false,
                        ip: "jhonwick_23@gmail.com",
                        port: "+88012378478",
                    },
                    {
                        id: 2,
                        title: "ایپسوم",
                        connected: true,
                        ip: "jameswann@gmail.com",
                        port: "+88012378478",
                    },
                    {
                        id: 3,
                        title: "سوسن",
                        connected: true,
                        ip: "jameswann@gmail.com",
                        port: "+88012378478",
                    },
                    {
                        id: 4,
                        title: "محتوا",
                        connected: false,
                        ip: "jhonwick_23@gmail.com",
                        port: "+88012378478",
                    },
                    {
                        id: 5,
                        title: "فهیم",
                        connected: false,
                        ip: "jhonwick_23@gmail.com",
                        port: "+88012378478",
                    },
                    {
                        id: 6,
                        title: "متنی",
                        connected: false,
                        ip: "jameswann@gmail.com",
                        port: "+88012378478",
                    },
                    {
                        id: 1,
                        title: "علی",
                        connected: true,
                        ip: "dan_brown@gmail.com",
                        port: "+88012378478",
                    },
                    {
                        id: 2,
                        title: "کیوان",
                        connected: false,
                        ip: "jameswann@gmail.com",
                        port: "+88012378478",
                    },
                    {
                        id: 3,
                        title: "دفتر",
                        connected: true,
                        ip: "janeswann@gmail.com",
                        port: "+88012378478",
                    },
                    {
                        id: 4,
                        title: "شبها",
                        connected: true,
                        ip: "jaasdameswann@gmail.com",
                        port: "+88012378478",
                    },
                    {
                        id: 5,
                        title: "بالا",
                        connected: true,
                        ip: "doomwaytne@gmail.com",
                        port: "+88012378478",
                    },
                    {
                        id: 6,
                        title: "دلربا",
                        connected: false,
                        ip: "sidsacc@gmail.com",
                        port: "+88012378478",
                    }
                ]
            };
        },
        methods: {
            addFile() {
                console.log("hello");
            }
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

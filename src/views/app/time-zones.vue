<template>
    <div class="main-content">
        <breadcumb page="مناطق زمانی"/>
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
                    :rows="$store.state.api.timezones"
            >
                <div slot="emptystate" class="text-center py-2">
                    <span v-if="loading.getTimezones">در حال دریافت لیست مناطق زمانی...</span>
                    <span v-else>منطقه زمانی برای نمایش وجود ندارد</span>
                </div>
                <div slot="table-actions" class="mb-4">
                    <b-button variant="primary" class="btn-rounded d-none d-sm-block" v-b-modal.addTimezone
                    ><i class="i-Add-Window align-middle text-white mr-2"> </i>افزودن منطقه زمانی
                    </b-button>

                    <b-modal id="addTimezone" :title="timezone.update ? 'ویرایش منطقه زمانی' : 'افزودن منطقه زمانی'"
                             @ok.prevent="addOrUpdateTimezone" @hidden="onModalHidden">
                        <b-form>

                            <b-form-group label="نام منطقه زمانی:" class="mb-4">
                                <b-form-input type="text" required v-model="timezone.Name"></b-form-input>
                            </b-form-group>

                            <b-form-group label="شنبه:" label-cols="2">
                                <b-row align-v="center">
                                    <b-col>
                                        <the-mask
                                                masked
                                                class="form-control dir-ltr text-right"
                                                :mask="['##:##']"
                                                placeholder="13:00"
                                                v-model="timezone.Saturday[0]"
                                        />
                                    </b-col>
                                    <b-col cols="auto">تا</b-col>
                                    <b-col>
                                        <the-mask
                                                masked
                                                class="form-control dir-ltr text-right"
                                                :mask="['##:##']"
                                                placeholder="16:00"
                                                v-model="timezone.Saturday[1]"
                                        />
                                    </b-col>
                                </b-row>
                            </b-form-group>
                            <b-form-group label="یک‌شنبه:" label-cols="2">
                                <b-row align-v="center">
                                    <b-col>
                                        <the-mask
                                                masked
                                                class="form-control dir-ltr text-right"
                                                :mask="['##:##']"
                                                placeholder="13:00"
                                                v-model="timezone.Sunday[0]"
                                        />
                                    </b-col>
                                    <b-col cols="auto">تا</b-col>
                                    <b-col>
                                        <the-mask
                                                masked
                                                class="form-control dir-ltr text-right"
                                                :mask="['##:##']"
                                                placeholder="16:00"
                                                v-model="timezone.Sunday[1]"
                                        />
                                    </b-col>
                                </b-row>
                            </b-form-group>
                            <b-form-group label="دوشنبه:" label-cols="2">
                                <b-row align-v="center">
                                    <b-col>
                                        <the-mask
                                                masked
                                                class="form-control dir-ltr text-right"
                                                :mask="['##:##']"
                                                placeholder="13:00"
                                                v-model="timezone.Monday[0]"
                                        />
                                    </b-col>
                                    <b-col cols="auto">تا</b-col>
                                    <b-col>
                                        <the-mask
                                                masked
                                                class="form-control dir-ltr text-right"
                                                :mask="['##:##']"
                                                placeholder="16:00"
                                                v-model="timezone.Monday[1]"
                                        />
                                    </b-col>
                                </b-row>
                            </b-form-group>
                            <b-form-group label="سه‌شنبه:" label-cols="2">
                                <b-row align-v="center">
                                    <b-col>
                                        <the-mask
                                                masked
                                                class="form-control dir-ltr text-right"
                                                :mask="['##:##']"
                                                placeholder="13:00"
                                                v-model="timezone.Tuesday[0]"
                                        />
                                    </b-col>
                                    <b-col cols="auto">تا</b-col>
                                    <b-col>
                                        <the-mask
                                                masked
                                                class="form-control dir-ltr text-right"
                                                :mask="['##:##']"
                                                placeholder="16:00"
                                                v-model="timezone.Tuesday[1]"
                                        />
                                    </b-col>
                                </b-row>
                            </b-form-group>
                            <b-form-group label="چهارشنبه:" label-cols="2">
                                <b-row align-v="center">
                                    <b-col>
                                        <the-mask
                                                masked
                                                class="form-control dir-ltr text-right"
                                                :mask="['##:##']"
                                                placeholder="13:00"
                                                v-model="timezone.Wednesday[0]"
                                        />
                                    </b-col>
                                    <b-col cols="auto">تا</b-col>
                                    <b-col>
                                        <the-mask
                                                masked
                                                class="form-control dir-ltr text-right"
                                                :mask="['##:##']"
                                                placeholder="16:00"
                                                v-model="timezone.Wednesday[1]"
                                        />
                                    </b-col>
                                </b-row>
                            </b-form-group>
                            <b-form-group label="پنج‌شنبه:" label-cols="2">
                                <b-row align-v="center">
                                    <b-col>
                                        <the-mask
                                                masked
                                                class="form-control dir-ltr text-right"
                                                :mask="['##:##']"
                                                placeholder="13:00"
                                                v-model="timezone.Thursday[0]"
                                        />
                                    </b-col>
                                    <b-col cols="auto">تا</b-col>
                                    <b-col>
                                        <the-mask
                                                masked
                                                class="form-control dir-ltr text-right"
                                                :mask="['##:##']"
                                                placeholder="16:00"
                                                v-model="timezone.Thursday[1]"
                                        />
                                    </b-col>
                                </b-row>
                            </b-form-group>
                            <b-form-group label="جمعه:" label-cols="2">
                                <b-row align-v="center">
                                    <b-col>
                                        <the-mask
                                                masked
                                                class="form-control dir-ltr text-right"
                                                :mask="['##:##']"
                                                placeholder="13:00"
                                                v-model="timezone.Friday[0]"
                                        />
                                    </b-col>
                                    <b-col cols="auto">تا</b-col>
                                    <b-col>
                                        <the-mask
                                                masked
                                                class="form-control dir-ltr text-right"
                                                :mask="['##:##']"
                                                placeholder="16:00"
                                                v-model="timezone.Friday[1]"
                                        />
                                    </b-col>
                                </b-row>
                            </b-form-group>

                        </b-form>
                        <template v-slot:modal-footer="{ ok, cancel }">
                            <div class="spinner-bubble spinner-bubble-primary spinner-modal"
                                 v-show="loading.addOrUpdateTimezone"></div>
                            <b-button variant="secondary" @click="cancel()" :disabled="loading.addOrUpdateTimezone">
                                انصراف
                            </b-button>
                            <b-button variant="primary" @click="ok()" :disabled="loading.addOrUpdateTimezone">
                                {{ timezone.update ? 'تایید و ویرایش منطقه زمانی' : 'تایید و افزودن منطقه زمانی' }}
                            </b-button>
                        </template>
                    </b-modal>
                </div>

                <template slot="table-row" slot-scope="props">

                    <div v-if="props.column.field === 'Button'">

                        <a href="#" @click.prevent="editTimezone(props.row)"
                           v-b-tooltip.hover
                           class="o-hidden d-inline-block mx-3"
                           title="ویرایش منطقه زمانی">
                            <i class="i-Eraser-2 text-25 text-info"></i>
                        </a>

                        <a href="#" @click.prevent="removeTimezone(props.row)"
                           :class="{'opacity-2': loading.removeTimezone}"
                           v-b-tooltip.hover
                           class="o-hidden d-inline-block mx-3"
                           title="حذف منطقه زمانی">
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
                    addOrUpdateTimezone: false,
                    removeTimezone: false,
                    getTimezones: true,
                },
                columns: [
                    {
                        label: "نام منطقه زمانی",
                        field: "Name"
                    },
                    {
                        label: "شنبه",
                        field: "Saturday",
                        tdClass: "time-range",
                    },
                    {
                        label: "یک‌شنبه",
                        field: "Sunday",
                        tdClass: "time-range",
                    },
                    {
                        label: "دوشنبه",
                        field: "Monday",
                        tdClass: "time-range",
                    },
                    {
                        label: "سه‌شنبه",
                        field: "Tuesday",
                        tdClass: "time-range",
                    },
                    {
                        label: "چهارشنبه",
                        field: "Wednesday",
                        tdClass: "time-range",
                    },
                    {
                        label: "پنج‌شنبه",
                        field: "Thursday",
                        tdClass: "time-range",
                    },
                    {
                        label: "جمعه",
                        field: "Friday",
                        tdClass: "time-range",
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
                timezone: {
                    Name: '',
                    Saturday: [],
                    Sunday: [],
                    Monday: [],
                    Tuesday: [],
                    Wednesday: [],
                    Thursday: [],
                    Friday: [],
                    update: false
                }
            };
        },
        methods: {
            addOrUpdateTimezone() {
                this.loading.addOrUpdateTimezone = true;
                const timezone = {...this.timezone};
                for (const key in timezone)
                    // eslint-disable-next-line no-prototype-builtins
                    if (timezone.hasOwnProperty(key) && Array.isArray(timezone[key]))
                        timezone[key] = timezone[key].join('-');

                if (this.timezone.update) {
                    this.$store.dispatch('updateTimezone', timezone)
                        .then(() => {
                            this.$bvModal.hide('addTimezone');
                            this.$bvToast.toast(`منطقه زمانی با موفقیت ویرایش شد`, {
                                title: `ویرایش منطقه زمانی`,
                                variant: 'success',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                        .catch(err => {
                            console.log('Could not update timezone', err);
                            this.$bvToast.toast(`ویرایش منطقه زمانی با خطا همراه بود`, {
                                title: `ویرایش منطقه زمانی`,
                                variant: 'danger',
                                toaster: 'b-toaster-top-left'
                            });

                        })
                        .finally(() => this.loading.addOrUpdateTimezone = false)
                } else {
                    this.$store.dispatch('addTimezone', timezone)
                        .then(() => {
                            this.$bvModal.hide('addTimezone');
                            this.$bvToast.toast(`منطقه زمانی با موفقیت افزوده شد`, {
                                title: `افزودن منطقه زمانی`,
                                variant: 'success',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                        .catch(err => {
                            console.log('Could not add timezone', err);
                            this.$bvToast.toast(`افزودن منطقه زمانی با خطا همراه بود`, {
                                title: `افزودن منطقه زمانی`,
                                variant: 'danger',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                        .finally(() => this.loading.addOrUpdateTimezone = false)
                }
            },
            editTimezone(timezone) {
                timezone = {...timezone};
                for (const key in timezone)
                    // eslint-disable-next-line no-prototype-builtins
                    if (timezone.hasOwnProperty(key) && ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(key))
                        timezone[key] = timezone[key].split('-');
                this.timezone = {
                    ...timezone,
                    update: true
                };
                this.$bvModal.show('addTimezone');
            },
            removeTimezone(timezone) {
                if (this.loading.removeTimezone) return;
                const msg = `آیا واقعا می‌خواهید منطقه زمانی با نام «${timezone.Name}» را حذف کنید؟`
                this.$bvModal
                    .msgBoxConfirm(msg, {
                        title: "حذف منطقه زمانی",
                        buttonSize: "sm",
                        okVariant: "danger",
                        okTitle: "بله، منطقه زمانی حذف شود",
                        cancelTitle: "انصراف",
                        footerClass: "p-2",
                        hideHeaderClose: false,
                        centered: true
                    })
                    .then(ok => {
                        if (ok) {
                            this.loading.removeTimezone = true;
                            this.$store.dispatch('removeTimezone', timezone.ID)
                                .then(() => {
                                    this.$bvToast.toast(`منطقه زمانی با موفقیت حذف شد`, {
                                        title: `حذف منطقه زمانی`,
                                        variant: 'success',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .catch(() => {
                                    this.$bvToast.toast(`حذف منطقه زمانی با خطا همراه بود`, {
                                        title: `حذف منطقه زمانی`,
                                        variant: 'danger',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .finally(() => this.loading.removeTimezone = false)
                        }
                    })
            },
            onModalHidden() {
                this.timezone = {
                    Name: '',
                    Saturday: [],
                    Sunday: [],
                    Monday: [],
                    Tuesday: [],
                    Wednesday: [],
                    Thursday: [],
                    Friday: [],
                    update: false
                };
            },
        },
        created() {
            this.$store.dispatch('getTimezones')
                .catch(e => {
                    console.log('Could not get timezones', e);
                    this.$bvToast.toast(`دریافت لیست مناطق زمانی با خطا همراه بود`, {
                        title: `لیست مناطق زمانی`,
                        variant: 'danger',
                        toaster: 'b-toaster-top-left',
                        noAutoHide: true,
                    });
                })
                .finally(() => this.loading.getTimezones = false)

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

    .time-range {
        letter-spacing: 1px;
    }
</style>

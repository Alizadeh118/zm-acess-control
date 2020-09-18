<template>
    <div class="main-content">
        <breadcumb page="رخدادها"/>
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
                      initialSortBy: {field: 'ID', type: 'desc'}
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
                    :rows="events"
            >
                <div slot="emptystate" class="text-center py-2">
                    <span v-if="loading.getEvents">در حال دریافت لیست رخدادها...</span>
                    <span v-else>رخدادی برای نمایش وجود ندارد</span>
                </div>


            </vue-good-table>
        </b-card>
    </div>
</template>

<script>

    export default {
        metaInfo() {
            return {
                title: "رخدادها",
            }
        },
        data() {
            return {
                events: [],
                loading: {
                    removeEvent: false,
                    getEvents: true,
                },
                columns: [
                    {
                        label: 'ID',
                        field: 'ID',
                        type: 'number',
                        hidden: true,
                    },
                    {
                        label: "رخداد",
                        field: "Message",
                        tdClass: "dir-ltr text-right pr-5",
                    },
                    {
                        label: "نام کاربری",
                        field: "User_name"
                    },
                    {
                        label: "زمان",
                        field: "Time_Persian",
                        tdClass: "dir-ltr",
                        formatFn: value => this.english2persian(value).replace('T', ' ')
                    },
                ],
            };
        },
        methods: {
            getEvents() {
                this.$store.dispatch('getEvents')
                    .then(events => this.events = events)
                    .catch(e => {
                        console.log('Could not get events', e);
                        this.$bvToast.toast(`دریافت لیست رخدادها با خطا همراه بود`, {
                            title: `لیست رخدادها`,
                            variant: 'danger',
                            toaster: 'b-toaster-top-left',
                            noAutoHide: true,
                        });
                    })
                    .finally(() => this.loading.getEvents = false);
            },
            removeEvent(event) {
                this.loading.removeEvent = true;
                this.$store.dispatch('removeEvent', event.ID)
                    .then(() => {
                        this.$bvToast.toast(`رخداد با موفقیت حذف شد`, {
                            title: `حذف رخداد`,
                            variant: 'success',
                            toaster: 'b-toaster-top-left'
                        });
                        this.getEvents()
                    })
                    .catch(() => {
                        this.$bvToast.toast(`حذف رخداد با خطا همراه بود`, {
                            title: `حذف رخداد`,
                            variant: 'danger',
                            toaster: 'b-toaster-top-left'
                        });
                    })
                    .finally(() => this.loading.removeEvent = false)
            },
        },
        created() {
            this.getEvents()
        }
    };
</script>

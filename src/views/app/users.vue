<template>
    <div class="main-content">
        <breadcumb page="کاربران"/>
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
                      initialSortBy: {field: 'Role', type: 'desc'}
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
                    :rows="$store.state.api.users"
            >
                <div slot="emptystate" class="text-center py-2">
                    <span v-if="loading.getUsers">در حال دریافت لیست کاربران...</span>
                    <span v-else>کاربری برای نمایش وجود ندارد</span>
                </div>
                <div slot="table-actions" class="mb-4">
                    <b-button variant="primary" class="btn-rounded d-none d-sm-block" v-b-modal.addUser
                    ><i class="i-Add-Window align-middle text-white mr-2"> </i>افزودن کاربر
                    </b-button>

                    <b-modal id="addUser" :title="user.update ? 'ویرایش کاربر' : 'افزودن کاربر'"
                             @ok.prevent="addOrUpdateUser" @hidden="onModalHidden">
                        <b-form>
                            <b-row>
                                <b-col cols="12">
                                    <b-form-group label="نام کاربری:">
                                        <b-form-input
                                                class="dir-ltr"
                                                type="text"
                                                required
                                                :disabled="user.update"
                                                v-model="user.UserName"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="12" v-show="user.update && user.UserName === ownUser.Name">
                                    <b-form-group label="رمز عبور فعلی">
                                        <b-form-input
                                                class="dir-ltr"
                                                type="password"
                                                required
                                                v-model="user.OldPassword"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="12">
                                    <b-form-group :label="user.update ? 'رمز عبور جدید:' : 'رمز عبور:'">
                                        <b-form-input
                                                class="dir-ltr"
                                                type="password"
                                                required
                                                v-model="user.Password"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="12" v-show="!user.update || user.UserName === ownUser.Name">
                                    <b-form-group label="تکرار رمز عبور:">
                                        <b-form-input
                                                class="dir-ltr"
                                                type="password"
                                                required
                                                v-model="user.ConfirmPassword"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="12" v-show="!user.update" class="mt-2">
                                    <b-row>
                                        <b-col>
                                            <b-form-group label="نقش" :disabled="user.update">
                                                <b-form-radio v-model="user.Role" v-for="role in $store.getters.roles" @change="user.Roles = []"
                                                              :key="role.id" :value="role.id">
                                                    <span style="font-size: 1.3em;">{{ role.title }}</span>
                                                </b-form-radio>
                                            </b-form-group>
                                        </b-col>

                                        <b-col v-if="selectedRole && selectedRole.items.length">
                                            <b-form-group label="مجوز‌های کاربر">
                                                <b-form-checkbox-group stacked v-model="user.Roles">
                                                    <b-form-checkbox class="ml-0"
                                                                     :key="item.id"
                                                                     :value="item.id"
                                                                     v-for="item in selectedRole.items">
                                                        {{ item.title }}
                                                    </b-form-checkbox>
                                                </b-form-checkbox-group>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>

                                </b-col>
                            </b-row>


                        </b-form>
                        <template v-slot:modal-footer="{ ok, cancel }">
                            <div class="spinner-bubble spinner-bubble-sm spinner-bubble-primary spinner-modal"
                                 v-show="loading.addOrUpdateUser"></div>
                            <b-button variant="secondary" @click="cancel()" :disabled="loading.addOrUpdateUser">
                                انصراف
                            </b-button>
                            <b-button variant="primary" @click="ok()" :disabled="loading.addOrUpdateUser">
                                {{ user.update ? 'تایید و ویرایش کاربر' : 'تایید و افزودن کاربر' }}
                            </b-button>
                        </template>
                    </b-modal>
                </div>

                <template slot="table-row" slot-scope="props">

                    <div v-if="props.column.field === 'Button' && (props.row.Role !== 'admin' || props.row.Name === ownUser.Name)"
                         class="d-flex justify-content-end">
                        <a @click.prevent="editUser(props.row)"
                           href=""
                           v-b-tooltip.hover
                           class="o-hidden d-inline-block"
                           title="تغییر رمز عبور">
                            <i class="i-Eraser-2 text-20 d-block text-info mr-2"></i>
                        </a>
                        <a @click.prevent="removeUser(props.row)"
                           href=""
                           v-b-tooltip.hover
                           class="o-hidden d-inline-block"
                           title="حذف کاربر">
                            <i class="i-Close-Window text-20 d-block text-danger"></i>
                        </a>
                    </div>

                </template>

            </vue-good-table>
        </b-card>
    </div>
</template>

<script>

    export default {
        metaInfo() {
            return {
                title: "کاربران",
            }
        },
        data() {
            return {
                loading: {
                    addOrUpdateUser: false,
                    removeUser: false,
                    getUsers: true,
                },
                columns: [
                    {
                        label: "نام کاربری",
                        field: "Name"
                    },
                    {
                        label: "نقش",
                        field: "Role",
                        formatFn: this.getPersianRole
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
                user: {
                    UserName: '',
                    OldPassword: '',
                    Password: '',
                    ConfirmPassword: '',
                    Role: '',
                    Roles: [],
                    update: false,
                },
            };
        },
        methods: {
            addOrUpdateUser() {
                this.loading.addOrUpdateUser = true;

                if (this.user.update) {
                    if (this.user.UserName === this.ownUser.Name)
                        this.$store.dispatch('changePassword', {
                            UserID: this.user.User_Id,
                            OldPassword: this.user.OldPassword,
                            NewPassword: this.user.Password,
                            ConfirmPassword: this.user.ConfirmPassword,
                        })
                            .then(() => {
                                this.$bvModal.hide('addUser');
                                this.$bvToast.toast(`رمز عبور شما با موفقیت ویرایش شد`, {
                                    title: `ویرایش رمز عبور`,
                                    variant: 'success',
                                    toaster: 'b-toaster-top-left'
                                });
                            })
                            .catch(err => {
                                console.log('Could not edit user', err);
                                let msg
                                try {
                                    msg = err.response.data.Message
                                } catch (e) {
                                    msg = 'ویرایش رمز عبور شما با خطا همراه بود'
                                }
                                this.$bvToast.toast(msg, {
                                    title: `ویرایش رمز عبور`,
                                    variant: 'danger',
                                    toaster: 'b-toaster-top-left'
                                });
                            })
                            .finally(() => this.loading.addOrUpdateUser = false)
                    else
                        this.$store.dispatch('resetPassword', {
                            UserID: this.user.User_Id,
                            NewPassword: this.user.Password
                        })
                            .then(() => {
                                this.$bvModal.hide('addUser');
                                this.$bvToast.toast(`رمز عبور کاربر با موفقیت ویرایش شد`, {
                                    title: `ویرایش رمز عبور`,
                                    variant: 'success',
                                    toaster: 'b-toaster-top-left'
                                });
                            })
                            .catch(err => {
                                console.log('Could not edit user', err);
                                let msg
                                try {
                                    msg = err.response.data.Message
                                } catch (e) {
                                    msg = 'ویرایش رمز عبور کاربر با خطا همراه بود'
                                }
                                this.$bvToast.toast(msg, {
                                    title: `ویرایش رمز عبور`,
                                    variant: 'danger',
                                    toaster: 'b-toaster-top-left'
                                });
                            })
                            .finally(() => this.loading.addOrUpdateUser = false)
                } else {
                    const user = JSON.parse(JSON.stringify(this.user))
                    user.Roles.push(user.Role)
                    this.$store.dispatch('addUser', user)
                        .then(() => {
                            this.$bvModal.hide('addUser');
                            this.$bvToast.toast(`کاربر با موفقیت افزوده شد`, {
                                title: `افزودن کاربر`,
                                variant: 'success',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                        .catch(err => {
                            console.log('Could not add user', err);
                            let msg
                            try {
                                msg = err.response.data.Message
                            } catch (e) {
                                msg = 'افزودن کاربر با خطا همراه بود'
                            }
                            this.$bvToast.toast(msg, {
                                title: `افزودن کاربر`,
                                variant: 'danger',
                                toaster: 'b-toaster-top-left'
                            });
                        })
                        .finally(() => this.loading.addOrUpdateUser = false)
                }
            },
            editUser(user) {
                this.user = {
                    ...user,
                    UserName: user.Name,
                    Role: '',
                    Roles: [],
                    update: true
                };
                this.$bvModal.show('addUser');
            },
            removeUser(user) {

                const msg = `آیا واقعا می‌خواهید کاربر «${(user.Name || '') + ' ' + (user.LastName || '')}» را حذف کنید؟`;
                this.$bvModal
                    .msgBoxConfirm(msg, {
                        title: "حذف کاربر",
                        buttonSize: "sm",
                        okVariant: "danger",
                        okTitle: "بله، کاربر حذف شود",
                        cancelTitle: "انصراف",
                        footerClass: "p-2",
                        hideHeaderClose: false,
                        centered: true
                    })
                    .then(ok => {
                        if (ok) {
                            this.loading.removeUser = true;
                            this.$store.dispatch('removeUser', user.ID)
                                .then(() => {
                                    this.$bvToast.toast(`کاربر با موفقیت حذف شد`, {
                                        title: `حذف کاربر`,
                                        variant: 'success',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .catch(() => {
                                    this.$bvToast.toast(`حذف کاربر با خطا همراه بود`, {
                                        title: `حذف کاربر`,
                                        variant: 'danger',
                                        toaster: 'b-toaster-top-left'
                                    });
                                })
                                .finally(() => this.loading.removeUser = false)
                        }
                    })
            },
            onModalHidden() {
                this.user = {
                    Name: '',
                    LastName: '',
                    Department_ID: null,
                    update: false
                }
            },
            getPersianRole(role) {
                switch (role) {
                    case 'admin':
                        return 'مدیر'
                    case 'security':
                        return 'نگهبان'
                    default:
                        return role
                }
            }
        },
        computed: {
            ownUser() {
                return this.$store.state.api.users.find(u => u.Name === this.$store.state.api.user.userName)
            },
            selectedRole() {
                return this.$store.getters.roles.find(r => r.id === this.user.Role)
            }
        },
        created() {
            this.$store.dispatch('getRoles');

            this.$store.dispatch('getUsers')
                .catch(e => {
                    console.log('Could not get users', e);
                    this.$bvToast.toast(`دریافت لیست کاربران با خطا همراه بود`, {
                        title: `لیست کاربران`,
                        variant: 'danger',
                        toaster: 'b-toaster-top-left',
                        noAutoHide: true,
                    });
                })
                .finally(() => this.loading.getUsers = false);
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

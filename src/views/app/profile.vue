<template>
    <div class="main-content">
        <breadcumb page="پروفایل"/>
        <!-- <div class="wrapper"> -->
        <b-card class="mb-30">
            <p>
                <span class="mr-2">نام کاربری:</span>
                <strong>{{ user.Name }}</strong>
            </p>
            <p>
                <span class="mr-2">نقش:</span>
                <strong>{{ getPersianRole(user.Role) }}</strong>
            </p>
        </b-card>
    </div>
</template>

<script>

    export default {
        metaInfo(){
            return {
                title: "پروفایل",
            }
        },
        data() {
            return {};
        },
        methods: {
            getPersianRole(role){
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
        computed:{
            user(){
                return this.$store.state.api.users.find(u => u.Name === this.$store.state.api.user.userName)
            }
        },
        created() {
            if (!this.$store.state.api.users.length)
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
        }
    };
</script>
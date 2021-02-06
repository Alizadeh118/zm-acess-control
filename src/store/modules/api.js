import axios from 'axios';
import Roles from '../../roles';

const baseURL = process.env.NODE_ENV === 'production' ? 'api' : 'http://51.89.110.11:9091/api'

let user = null;
try {
    user = localStorage.getItem("user");
    user = JSON.parse(user);
    axios.defaults.headers.common.Authorization = `bearer ${ user.access_token }`;
} catch ( e ) {
    localStorage.removeItem("user");
}

let settings = {
    app_name: '',
    company_name: '',
    logo: '',
    background: '',
}
try {
    if ( JSON.parse(localStorage.getItem('settings')) )
        settings = JSON.parse(localStorage.getItem('settings'))
} catch ( e ) {
    localStorage.removeItem("settings");
}

const request = axios.create({ baseURL });

const state = {
    devices: [],
    employees: [],
    departments: [],
    timezones: [],
    accessLevels: [],
    users: [],
    privileges: [],
    types: [],
    roles: [],
    settings,
    user,
    wantToGetDevicesState: false
};

const getters = {
    isSecurity: state => state.user && state.user.roles.includes(Roles.security),
    roles: state => {
        return state.roles.reduce((result, item) => {
            result.push({
                id: Object.values(item.Key)[0],
                title: Object.keys(item.Key)[0],
                items: item.Value.reduce((values, i) => {
                    values.push({
                        id: Object.values(i)[0],
                        title: Object.keys(i)[0],
                    })
                    return values
                }, [])
            })
            return result
        }, [])
    }
    // isAdmin: state => state.user state.user && && state.user.Role === 'admin',
};

const actions = {
    // devices
    async getDevices ({ commit, dispatch }) {
        try {
            const response = await request.get('/device');
            commit("ADD_DEVICES", response.data);
            // dispatch('getDevicesState');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async getDataFromDevice (ctx, deviceId) {
        try {
            const response = await request.post('/device/data', {
                devices: [deviceId]
            });
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async getDevicesState ({ commit, state }) {
        console.log('here', state.devices);
        for ( const device of state.devices ) {
            if ( state.wantToGetDevicesState && (!device.stateUpdatedAt || Date.now() - device.stateUpdatedAt > 30000 )) {
                try {
                    const response = await request.get(`/device/state/${ device.ID }`)
                    commit("UPDATE_DEVICE_STATE", {
                        id: device.ID,
                        state: response.data
                    });
                } catch ( e ) {
                    console.log(e);
                }
            }
        }
    },
    async addDevice ({ dispatch }, device) {
        try {
            const response = await request.post('/device/', device);
            dispatch('getDevices');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async updateDevice ({ dispatch }, device) {
        try {
            const response = await request.put('/device/' + device.ID, device);
            dispatch('getDevices');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async removeDevice ({ dispatch }, deviceId) {
        try {
            const response = await request.delete(`/device/${ deviceId }`);
            dispatch('getDevices');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async syncTime (ctx, deviceId) {
        try {
            const response = await request.post(`/device/synctime`, {
                devices: [deviceId]
            });
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async clearData (ctx, deviceId) {
        try {
            const response = await request.post(`/device/clear`, {
                devices: [deviceId]
            });
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async syncDevicesProgress () {
        try {
            const response = await request.get(`/access/sync/device/progress`);
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async syncAccessesProgress () {
        try {
            const response = await request.get(`/access/sync/access/progress`);
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    // employees
    async getEmployees ({ commit }) {
        try {
            const response = await request.post('/employee/get', {});
            commit("ADD_EMPLOYEES", response.data);
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async addEmployee ({ dispatch }, employee) {
        try {
            const response = await request.post('/employee/', employee);
            dispatch('getEmployees');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async updateEmployee ({ dispatch }, employee) {
        try {
            const response = await request.put('/employee/' + employee.ID, employee);
            dispatch('getEmployees');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async removeEmployee ({ dispatch }, employeeIds) {
        try {
            const response = await request.delete(`/Employee`, {
                data: {
                    employee: employeeIds
                }
            });
            dispatch('getEmployees');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async toggleAvailability ({ dispatch }, { EmployeeId, available }) {
        try {
            const response = await request.post(`/Employee/${ EmployeeId }/available`, {
                available
            });
            dispatch('getEmployees');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async toggleAbility ({ dispatch }, { employeeIds, enabled }) {
        try {
            const response = await request.post(`/Employee/enable`, {
                employee: employeeIds,
                enable: enabled
            });
            dispatch('getEmployees');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async getPrivileges ({ commit }) {
        try {
            const response = await request.get('/Access/privilege');
            commit("ADD_PRIVILEGES", response.data);
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    // departments
    async getDepartments ({ commit }) {
        try {
            const response = await request.get('/department');
            commit("ADD_DEPARTMENTS", response.data);
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async addDepartment ({ dispatch }, department) {
        try {
            const response = await request.post('/department/', department);
            dispatch('getDepartments');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async updateDepartment ({ dispatch }, department) {
        try {
            const response = await request.put('/department/' + department.ID, department);
            dispatch('getDepartments');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async removeDepartment ({ dispatch }, departmentId) {
        try {
            const response = await request.delete(`/department/${ departmentId }`);
            dispatch('getDepartments');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    // timezones
    async getTimezones ({ commit }) {
        try {
            const response = await request.get('/timezone');
            commit("ADD_TIMEZONES", response.data);
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async addTimezone ({ dispatch }, timezone) {
        try {
            const response = await request.post('/timezone/', timezone);
            dispatch('getTimezones');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async updateTimezone ({ dispatch }, timezone) {
        try {
            const response = await request.put('/timezone/' + timezone.ID, timezone);
            dispatch('getTimezones');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async removeTimezone ({ dispatch }, timezoneId) {
        try {
            const response = await request.delete(`/timezone/${ timezoneId }`);
            dispatch('getTimezones');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    // accessLevels
    async getAccessLevels ({ commit }) {
        try {
            const response = await request.get('/access');
            commit("ADD_ACCESS_LEVELS", response.data);
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async addAccessLevel (ctx, accessLevel) {
        try {
            const response = await request.post('/access/', accessLevel);
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async addAccessLevelMembers ({ dispatch }, accessLevel) {
        try {
            const response = await request.post('/access/member/add/' + accessLevel.ID, accessLevel);
            dispatch('getAccessLevels');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async updateAccessLevel ({ dispatch }, accessLevel) {
        try {
            const response = await request.put('/access/' + accessLevel.ID, accessLevel);
            dispatch('getAccessLevels');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async removeAccessLevel ({ dispatch }, accessLevelId) {
        try {
            const response = await request.delete(`/access/${ accessLevelId }`);
            dispatch('getAccessLevels');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async syncDevices ({ state }, deviceIds) {
        try {
            if ( deviceIds.length === 1 && deviceIds[0] === -1 )
                deviceIds = state.devices.map(d => d.ID)

            const response = await request.post('/access/sync/device', {
                devices: deviceIds
            });
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async syncAccesses (ctx, accessIds) {
        try {
            if ( accessIds.length === 1 && accessIds[0] === -1 )
                accessIds = state.accessLevels.map(a => a.ID)
            const response = await request.post('/access/sync/access', {
                access: accessIds
            });
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    // account
    async login ({ commit }, data) {
        try {
            const response = await request.post('/account/token', new URLSearchParams({
                username: data.username,
                password: data.password,
                grant_type: "password"
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            commit('LOGIN', response.data);
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async logout ({ commit }) {
        commit('LOGOUT');
    },
    async getUsers ({ commit }) {
        try {
            const response = await request.get('/account/users');
            commit("ADD_USERS", response.data);
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async addUser ({ dispatch }, data) {
        try {
            const response = await request.post('/account/register', data);
            dispatch('getUsers');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async resetPassword (ctx, data) {
        try {
            const response = await request.post('/account/resetpassword', data);
            // dispatch('getUsers');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async changePassword (ctx, data) {
        try {
            const response = await request.post('/account/changepassword', data);
            // dispatch('getUsers');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async getRoles ({ commit }) {
        try {
            const response = await request.get('/account/roles');
            commit("ADD_ROLES", response.data);
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    // events
    async getEvents () {
        try {
            const response = await request.post('/events', {});
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async removeEvent (ctx, id) {
        try {
            const response = await request.delete('/events', {
                data: {
                    logs: [id]
                }
            });
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    // report
    async getReport ({ commit, dispatch }, data) {
        try {
            for ( const key in data.filter )
                !!data.filter[key] || delete data.filter[key]

            data = {
                ...data.filter,
                page_size: data.perPage,
                page_number: data.page - 1,
            }

            console.log(data);
            const count = await dispatch('getReportCount', data)

            const response = await request.post('/report', data);
            return {
                rows: response.data,
                totalRecords: count
            };
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async getReportCount (ctx, data) {
        try {
            const response = await request.post('/report/count', data);
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async removeReport ({ dispatch }, id) {
        try {
            const response = await request.delete('/report', {
                data: {
                    logs: [id]
                }
            });
            dispatch('getReport');
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async getTypes ({ commit }) {
        try {
            const response = await request.get('/report/type');
            commit("ADD_TYPES", response.data);
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    // settings
    async setNames ({ dispatch }, data) {
        try {
            const response = await request.post('/setting/name', data);
            dispatch('getNames')
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async getNames ({ commit }) {
        try {
            const response = await request.get('/setting/name');
            commit('SET_SETTINGS', response.data);
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async setLogo ({ dispatch }, data) {
        try {
            const response = await request.post('/setting/logoApp', data);
            dispatch('getLogo')
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async getLogo ({ commit }) {
        try {
            const response = await request.get('/setting/logoApp');
            const url = new URL(response.data)
            commit("SET_LOGO", baseURL + url.pathname.replace(/.*api/, ''))
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async setBackground ({ dispatch }, data) {
        try {
            const response = await request.post('/setting/picLogin', data);
            dispatch('getBackground')
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async getBackground ({ commit }) {
        try {
            const response = await request.get('/setting/picLogin');
            const url = new URL(response.data)
            commit("SET_BACKGROUND", baseURL + url.pathname.replace(/.*api/, ''))
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    // security
    async enterGuest ({ dispatch }, data) {
        try {
            const response = await request.post('/access/member/add', data);
            dispatch('getEmployees')
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async exitGuest ({ dispatch }, id) {
        try {
            const response = await request.post(`/guests/${id}/exit`);
            await dispatch('getEmployees')
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async addGuest ({ dispatch }, data) {
        try {
            const response = await request.post('/guests', data);
            await dispatch('getEmployees')
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async getGuestsCount (ctx, data) {
        try {
            const response = await request.post('/guests/count', data);
            return response.data;
        } catch ( e ) {
            return Promise.reject(e);
        }
    },
    async getGuests ({ dispatch }, data) {
        try {
            for ( const key in data.filter )
                !!data.filter[key] || delete data.filter[key]

            data = {
                ...data.filter,
                page_size: data.perPage,
                page_number: data.page - 1,
            }

            const count = await dispatch('getGuestsCount', data)

            const response = await request.post('/guests/get', data);
            return {
                rows: response.data,
                totalRecords: count
            };
        } catch ( e ) {
            return Promise.reject(e);
        }
    },

};

const mutations = {
    LOGIN (state, user) {
        const userRoles = JSON.parse(user.uesrRoles)
        const roles = []
        for ( const role in userRoles ) {
            if ( userRoles[role].length )
                for ( const r of userRoles[role] )
                    roles.push(r)
            else
                roles.push(role)
        }
        user.roles = roles
        state.user = user;
        localStorage.setItem("user", JSON.stringify(user));
        request.defaults.headers.common.Authorization = `bearer ${ user.access_token }`;
    },
    LOGOUT (state) {
        state.user = null;
        state.devices = [];
        state.employees = [];
        state.departments = [];
        state.timezones = [];
        state.accessLevels = [];
        state.users = [];
        state.report = [];
        state.privileges = [];
        state.types = [];
        localStorage.removeItem("user");
        delete axios.defaults.headers.common.Authorization;
    },
    ADD_DEVICES (state, data) {
        state.devices = data;
    },
    ADD_PRIVILEGES (state, data) {
        state.privileges = data;
    },
    ADD_TYPES (state, data) {
        state.types = data;
    },
    ADD_REPORT (state, data) {
        state.report = data;
    },
    UPDATE_DEVICE_STATE (state, data) {
        state.devices = state.devices.map(device => {
            if ( device.ID === data.id ) {
                device.State = data.state;
                device.stateUpdatedAt = Date.now()
            }
            return device;
        })
    },
    ADD_EMPLOYEES (state, data) {
        state.employees = data;
    },
    ADD_USERS (state, data) {
        state.users = data;
    },
    ADD_ROLES (state, data) {
        state.roles = data;
    },
    ADD_DEPARTMENTS (state, data) {
        state.departments = data;
    },
    ADD_TIMEZONES (state, data) {
        state.timezones = data;
    },
    ADD_ACCESS_LEVELS (state, data) {
        state.accessLevels = data;
    },
    SET_SETTINGS (state, data) {
        for ( const item of data )
            state.settings[item.Name] = item.Value;
        localStorage.setItem('settings', JSON.stringify(state.settings))
    },
    SET_LOGO (state, data) {
        state.settings.logo = data
        localStorage.setItem('settings', JSON.stringify(state.settings))
    },
    SET_BACKGROUND (state, data) {
        state.settings.background = data
        localStorage.setItem('settings', JSON.stringify(state.settings))
    },
    CHANGE_WANT_TO_GET_DEVICES_STATE(state, data){
        state.wantToGetDevicesState = data
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

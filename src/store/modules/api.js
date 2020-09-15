import axios from 'axios';

let user = null;
try {
    user = localStorage.getItem("user");
    user = JSON.parse(user);
    axios.defaults.headers.common.Authorization = `bearer ${user.access_token}`;
} catch (e) {
    localStorage.removeItem("user");
}

const request = axios.create({
    baseURL: 'http://87.236.210.216:8001/api/',
    // baseURL: '/api',
});

const state = {
    devices: [],
    employees: [],
    departments: [],
    timezones: [],
    accessLevels: [],
    users: [],
    report: [],
    privileges: [],
    user: user,
};

// const getters = {
//     invoiceList: state => state.rows,
// };

const actions = {
    // devices
    async getDevices({commit, dispatch}) {
        try {
            const response = await request.get('/device');
            commit("ADD_DEVICES", response.data);
            dispatch('getDevicesState');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async getDataFromDevice(ctx, deviceId) {
        try {
            const response = await request.post('/device/data', {
                devices: [deviceId]
            });
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async getDevicesState({commit}) {
        for (const device of state.devices) {

            request.get(`/device/state/${device.ID}`)
                .then(response => {
                    commit("UPDATE_DEVICE_STATE", {
                        id: device.ID,
                        state: response.data
                    });
                }).catch(e => {
                console.log(e);
            })

            /*
            * try {
                const response = await request.get(`/device/state/${device.ID}`);
                commit("UPDATE_DEVICE_STATE", {
                    id: device.ID,
                    state: response.data
                });
            } catch (e) {
                console.log(e);
            }
            * */
        }
    },
    async addDevice({dispatch}, device) {
        try {
            const response = await request.post('/device/', device);
            dispatch('getDevices');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async updateDevice({dispatch}, device) {
        try {
            const response = await request.put('/device/' + device.ID, device);
            dispatch('getDevices');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async removeDevice({dispatch}, deviceId) {
        try {
            const response = await request.delete(`/device/${deviceId}`);
            dispatch('getDevices');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async syncTime(ctx, deviceId) {
        try {
            const response = await request.post(`/device/synctime`, {
                devices: [deviceId]
            });
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async clearData(ctx, deviceId) {
        try {
            const response = await request.post(`/device/clear`, {
                devices: [deviceId]
            });
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async getDataFromDeviceProgress() {
        try {
            const response = await request.get(`/device/data/progress`);
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    // employees
    async getEmployees({commit}) {
        try {
            const response = await request.post('/employee/get', {});
            commit("ADD_EMPLOYEES", response.data);
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async addEmployee({dispatch}, employee) {
        try {
            const response = await request.post('/employee/', employee);
            dispatch('getEmployees');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async updateEmployee({dispatch}, employee) {
        try {
            const response = await request.put('/employee/' + employee.ID, employee);
            dispatch('getEmployees');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async removeEmployee({dispatch}, EmployeeId) {
        try {
            const response = await request.delete(`/Employee/${EmployeeId}`);
            dispatch('getEmployees');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async toggleAvailability({dispatch}, {EmployeeId, available}) {
        try {
            const response = await request.post(`/Employee/${EmployeeId}/available`, {
                available
            });
            dispatch('getEmployees');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async getPrivileges({commit}) {
        try {
            const response = await request.get('/Access/privilage');
            commit("ADD_PRIVILEGES", response.data);
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    // departments
    async getDepartments({commit}) {
        try {
            const response = await request.get('/department');
            commit("ADD_DEPARTMENTS", response.data);
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async addDepartment({dispatch}, department) {
        try {
            const response = await request.post('/department/', department);
            dispatch('getDepartments');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async updateDepartment({dispatch}, department) {
        try {
            const response = await request.put('/department/' + department.ID, department);
            dispatch('getDepartments');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async removeDepartment({dispatch}, departmentId) {
        try {
            const response = await request.delete(`/department/${departmentId}`);
            dispatch('getDepartments');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    // timezones
    async getTimezones({commit}) {
        try {
            const response = await request.get('/timezone');
            commit("ADD_TIMEZONES", response.data);
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async addTimezone({dispatch}, timezone) {
        try {
            const response = await request.post('/timezone/', timezone);
            dispatch('getTimezones');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async updateTimezone({dispatch}, timezone) {
        try {
            const response = await request.put('/timezone/' + timezone.ID, timezone);
            dispatch('getTimezones');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async removeTimezone({dispatch}, timezoneId) {
        try {
            const response = await request.delete(`/timezone/${timezoneId}`);
            dispatch('getTimezones');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    // accessLevels
    async getAccessLevels({commit}) {
        try {
            const response = await request.get('/access');
            commit("ADD_ACCESS_LEVELS", response.data);
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async addAccessLevel(ctx, accessLevel) {
        try {
            const response = await request.post('/access/', accessLevel);
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async addAccessLevelMembers({dispatch}, accessLevel) {
        try {
            const response = await request.post('/access/member/add/' + accessLevel.ID, accessLevel);
            dispatch('getAccessLevels');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async updateAccessLevel({dispatch}, accessLevel) {
        try {
            const response = await request.put('/access/' + accessLevel.ID, accessLevel);
            dispatch('getAccessLevels');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async removeAccessLevel({dispatch}, accessLevelId) {
        try {
            const response = await request.delete(`/access/${accessLevelId}`);
            dispatch('getAccessLevels');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async syncDevices({state}, deviceIds) {
        try {
            if (deviceIds === -1)
                deviceIds = state.devices.map(d => d.ID)

            const response = await request.post('/access/sync/device', {
                devices: deviceIds
            });
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async syncAccesses(ctx, accessIds) {
        try {
            const response = await request.post('/access/sync/access', {
                access: accessIds
            });
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    // account
    async login({commit}, data) {
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
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async logout({commit}) {
        commit('LOGOUT');
    },
    async getUsers({commit}) {
        try {
            const response = await request.get('/account/users');
            commit("ADD_USERS", response.data);
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async addUser({dispatch}, data) {
        try {
            const response = await request.post('/account/register', data);
            dispatch('getUsers');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async resetPassword(ctx, data) {
        try {
            const response = await request.post('/account/resetpassword', data);
            // dispatch('getUsers');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async changePassword(ctx, data) {
        try {
            const response = await request.post('/account/changepassword', data);
            // dispatch('getUsers');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    // events
    async getEvents() {
        try {
            const response = await request.post('/events');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async removeEvent(ctx, id) {
        try {
            const response = await request.delete('/events', {
                data: {
                    logs: [id]
                }
            });
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    // report
    async getReport({commit}) {
        try {
            const response = await request.post('/report', {});
            commit("ADD_REPORT", response.data);
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    async removeReport({dispatch}, id) {
        try {
            const response = await request.delete('/report', {
                data: {
                    logs: [id]
                }
            });
            dispatch('getReport');
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },

};

const mutations = {
    LOGIN(state, user) {
        state.user = user;
        localStorage.setItem("user", JSON.stringify(user));
        request.defaults.headers.common.Authorization = `bearer ${user.access_token}`;
    },
    LOGOUT(state) {
        state.user = null;
        localStorage.removeItem("user");
        delete axios.defaults.headers.common.Authorization;
    },
    ADD_DEVICES(state, data) {
        state.devices = data;
    },
    ADD_PRIVILEGES(state, data) {
        state.privileges = data;
    },
    ADD_REPORT(state, data) {
        state.report = data;
    },
    UPDATE_DEVICE_STATE(state, data) {
        state.devices = state.devices.map(device => {
            if (device.ID === data.id)
                device.State = data.state;
            return device;
        })
    },
    ADD_EMPLOYEES(state, data) {
        state.employees = data;
    },
    ADD_USERS(state, data) {
        state.users = data;
    },
    ADD_DEPARTMENTS(state, data) {
        state.departments = data;
    },
    ADD_TIMEZONES(state, data) {
        state.timezones = data;
    },
    ADD_ACCESS_LEVELS(state, data) {
        state.accessLevels = data;
    },
};

export default {
    state,
    // getters,
    actions,
    mutations
};

import axios from 'axios';

const token = localStorage.getItem("token");
if (token)
    axios.defaults.headers.common.Authorization = `bearer ${token}`;

const request = axios.create({
    baseURL: 'http://172.20.10.5:8003/api',
    // baseURL: '/api',
});

const state = {
    devices: [],
    employees: [],
    departments: [],
    timezones: [],
    accessLevels: [],
    token: null,
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
            try {
                const response = await request.get(`/device/state/${device.ID}`);
                commit("UPDATE_DEVICE_STATE", {
                    id: device.ID,
                    state: response.data
                });
            } catch (e) {
                console.log(e);
            }
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
            const response = await request.get(`/device/${deviceId}/sync/time`);
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
            const response = await request.get('/employee');
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
            const response = await request.post('/access/member/' + accessLevel.ID, accessLevel);
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
    async syncData({state}) {
        try {
            const response = await request.post('/access/sync', {
                devices: state.devices.map(d => d.ID)
            });
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    // account
    async login({commit}, data) {
        try {
            const response =  await request.post('/account/token', new URLSearchParams({
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

};

const mutations = {
    LOGIN(state, {access_token}) {
        state.token = access_token;
        localStorage.setItem("token", access_token);
        axios.defaults.headers.common.Authorization = `bearer ${access_token}`;
    },
    LOGOUT(state) {
        state.token = null;
        localStorage.removeItem("token");
        delete axios.defaults.headers.common.Authorization;
    },
    ADD_DEVICES(state, data) {
        state.devices = data;
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

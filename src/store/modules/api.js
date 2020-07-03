import axios from 'axios';

const request = axios.create({
    // baseURL: 'http://192.168.1.106:8002/api',
    baseURL: 'http://172.20.10.2:8002/api',
});

const state = {
    devices: [],
    employees: [],
    departments: [],
    timezones: [],
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
            const response = await request.put('/device/'+device.ID, device);
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
            const response = await request.get(`/device/${deviceId}/clear`);
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
            const response = await request.put('/employee/'+employee.ID, employee);
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
            const response = await request.put('/department/'+department.ID, department);
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
            const response = await request.put('/timezone/'+timezone.ID, timezone);
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
};

const mutations = {
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
};

export default {
    state,
    // getters,
    actions,
    mutations
};

import axios from 'axios';

const request = axios.create({
    baseURL: 'http://192.168.1.101:8002/api',
});

const state = {
    devices: []
};

// const getters = {
//     invoiceList: state => state.rows,
// };

const actions = {
    async getDevices({commit}) {
        try {
            const response = await request.get('/device');
            commit("ADD_DEVICES", response.data);
            return response.data;
        } catch (e) {
            return e;
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
                return response.data;
            } catch (e) {
                return e;
            }
        }
    },
    async updateDevice({dispatch}, device) {
        try {
            const response = await request.put('/device/'+device.ID, device);
            dispatch('getDevices');
            return response.data;
        } catch (e) {
            return e;
        }
    },
    async removeDevice({dispatch}, deviceId) {
        try {
            const response = await request.delete(`/device/${deviceId}`);
            dispatch('getDevices');
            return response.data;
        } catch (e) {
            return e;
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
};

export default {
    state,
    // getters,
    actions,
    mutations
};

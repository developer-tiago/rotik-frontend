import axios from '.'

export default {
    index(userId) {
        return axios.get(`/wallet/${userId}`)
    },

    show(userId) {
        return axios.get(`/wallet/distribution/${userId}`)
    }
}
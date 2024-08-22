import axios from '.'

export default {
    index(userId) {
        return axios.get(`/transactions/${userId}`)
    },

    getByFilter(userId, type, value) {
        return axios.get(`/transactions/filter/${userId}/?type=${type}&value=${value}`)
    },

    makeTransaction(data) {
        return axios.post('/transactions', data)
    }
}
import axios from '.'

export default {
    paginate(page) {
        return axios.get(page)
    },

    getActiveByNameOrTicker(filter) {
        return axios.get(`/actives/${filter}`)
    }
}
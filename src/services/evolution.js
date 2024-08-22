import axios from '.'

export default {
    index(userId) {
        return axios.get(`/evolutions-of-heritage/${userId}`)
    }
}
import axios from 'axios';

export default {
  index() {
    const baseUrl = 'https://api.dadosdemercado.com.br/v1/tickers';
    const bearToken = '8cb7a3a5529cec195ed3adc5cd994e66'; // Replace with your environment variable or secure configuration

    const axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${bearToken}`, // Add the Authorization header with the Bear Token
      },
    });

    return axiosInstance.get(''); // Assuming the endpoint doesn't require any specific URL path
  },
};
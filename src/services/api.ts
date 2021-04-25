import axios from 'axios';

const api = axios.create({
    baseURL: 'https://my-json-server.typicode.com/im-mhid/PlantManager'
});

export default api;
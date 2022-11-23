import axios from "axios";
import jwt from 'jsonwebtoken';
/* JWT secret key */
const KEY = process.env.JWT_KEY;

const api = axios.create();
// Add a request interceptor
api.interceptors.request.use(config => {
    if (!config.headers) return config;
    const token = localStorage.getItem('access_token');
    if (!token || !KEY) return config;
    jwt.verify(token, KEY, function (err, decoded) {
        if (err) {
            return Promise.reject(err);
        }
    });


    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
},
    error => {
        return Promise.reject(error);
    }
)


// Add a response interceptor
api.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export default api
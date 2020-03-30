import axios from 'axios';
import { AUTHTOKEN, SHOW_LOADING, HIDE_LOADING } from '../utils/contants';

const BASE_URL = 'https://viruscorona.co.in';

const fileHeaders = {
    'Content-Type': 'multipart/form-data'
};

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers['Content-Type'] = 'application/json';

const showLoader = () => {
    window.dispatchEvent(new CustomEvent(SHOW_LOADING));
};

const hideLoader = () => {
    window.dispatchEvent(new CustomEvent(HIDE_LOADING));
};

// Add a request interceptor
axios.interceptors.request.use(
    function(config) {
        showLoader();
        return config;
    },
    function(error) {
        hideLoader();
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    function(response) {
        hideLoader();
        return response;
    },
    function(error) {
        hideLoader();
        return Promise.reject(error);
    }
);

export default {
    isSessionValid() {
        const expiry = localStorage.getItem('expiry');
        return (
            localStorage.getItem(AUTHTOKEN) &&
            expiry &&
            new Date(expiry) > Date.now()
        );
    },
    signIn(email, password) {
        return axios.post('/signin', { email, password });
    },

    createAccount({ name, email, password, orgID, orgName }) {
        return axios.post('/createAccount', {
            name,
            email,
            password,
            orgID,
            orgName
        });
    },

    verifyOTP({ emailId, otp }) {
        return axios.post('/verifyOTP', {
            identifier: emailId,
            accountIdentifierType: 'email',
            otp
        });
    },

    createOrder(formData) {
        return axios.post('/createOrder', formData, { headers: fileHeaders });
    },

    downloadQRCodes(orderID) {
        return axios.post('/downloadQRCodes', {
            orderID,
            authToken: localStorage.getItem(AUTHTOKEN)
        });
    },

    getOrders() {
        const userInfo = localStorage.getItem('userInfo');
        const { accountID } = JSON.parse(userInfo);

        return axios.post('/getOrders', {
            accountID,
            authToken: localStorage.getItem(AUTHTOKEN)
        });
    }
};

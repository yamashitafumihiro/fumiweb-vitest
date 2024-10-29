import axios from 'axios'

const axiosInstance = axios.create({
    baseURL:'https://70rxju4pfb.execute-api.ap-northeast-1.amazonaws.com/dev',
    headers:{
        'Content-Type':'application/json',
    },
});

export default axiosInstance

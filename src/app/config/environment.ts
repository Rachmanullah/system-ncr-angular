const PORT=4200;
const PRODUCTION=false
const API_BASE_URL='http://localhost:5010/api'
const API_BASE_URL_PROD='http://10.191.15.30:4000/api'

//environtment to docker
// const API_BASE_URL_PROD='/api'

export const environment = {
    port: PORT,
    production: PRODUCTION,
    apiUrl: API_BASE_URL
};


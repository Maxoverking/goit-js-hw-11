const axios = require('axios').default;

export const requestHTTP = async (inputText, PAGE_COUNTER) => {
    const BASE_URL = `https://pixabay.com/api/?key=31213238-ba438b7a093e03eb97bf90c50&`;
    try {
        const response = await axios.get(`${BASE_URL}q=${inputText}&image_type=photo&page=${PAGE_COUNTER}&per_page=40`);
        return response;
    } catch (error) {
        return console.log(error);
    }
};
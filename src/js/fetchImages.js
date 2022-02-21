const BASE_URL = 'https://pixabay.com/api/';
const KEY = '25783532-c25c49afce5183be9881181c4';
const axios = require('axios').default;

export default class ImagesIpiServise {
    constructor() {
        this.page = 1;
        this.searchQuery = '';
    }

    async fetchImages() {
        const searchParams = new URLSearchParams({
            key: KEY,
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: this.page,
            per_page: 40,
        });

        const url = `${BASE_URL}?${searchParams}`;
        // console.log(url)

        try {
            const response = await axios.get(url);            
            return response.data;
        } catch (error) {
             console.log(error);
        }
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    } 
}
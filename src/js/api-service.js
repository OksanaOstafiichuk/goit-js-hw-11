// 'https://pixabay.com/api/?key=27792321-2960889e1be9eac4cb5e657cd'
import axios from "axios";
import Notiflix from 'notiflix';



const API_KEY = '27792321-2960889e1be9eac4cb5e657cd';
const BASE_URL = 'https://pixabay.com/api/';
const options = new URLSearchParams({
  per_page: 40,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true
});


export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchApi() {
    return axios.get(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&page=${this.page}&${options}`)
      .then(response => {
        if (this.page === 1 && response.data.totalHits > 1) {
          Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
        }

        this.page += 1;

        return response.data;
      });
  }

  resertPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery; 
  }
} 
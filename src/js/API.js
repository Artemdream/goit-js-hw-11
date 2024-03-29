import axios from 'axios';
const BASE_URL = `https://pixabay.com/api/?`;

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const options = new URLSearchParams({
      key: '33610632-7e8c2f7a73fdbb86134be2184',
      q: `${this.searchQuery}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: `${this.page}`,
      per_page: 40,
    });
    const { data } = await axios.get(`${BASE_URL}${options}`);
    console.log(data);
    return data;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}

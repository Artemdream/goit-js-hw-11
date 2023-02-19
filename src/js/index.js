import Notiflix from 'notiflix';
import ApiService from './API';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { refs } from './refs';
import { renderCard } from './renderCard';

const apiService = new ApiService();
const lightboxGallery = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
hideBtn();
clearCardContainet();

async function onSearch(e) {
  e.preventDefault();
  apiService.resetPage();
  apiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (!apiService.query) {
    clearCardContainet();
    hideBtn();
    return;
  }

  try {
    const { hits, totalHits } = await apiService.fetchImages();
    if (hits.length === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images`);

    renderCard(hits);
    lightboxGallery.refresh();
    showBtn();
  } catch (error) {
    console.log(error);
    clearCardContainet();
    hideBtn();
  }
}

async function onLoadMore() {
  hideBtn();
  try {
    const { hits } = await apiService.fetchImages();
    renderCard(hits);
    apiService.incrementPage();
    lightboxGallery.refresh();
    showBtn();
  } catch (error) {
    console.log(error);
    Notify.info("We're sorry, but you've reached the end of search results.");
    clearCardContainet();
  }
}

function clearCardContainet() {
  refs.listCard.innerHTML = '';
}

function hideBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function showBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

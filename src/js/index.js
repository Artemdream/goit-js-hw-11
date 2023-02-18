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

function onSearch(e) {
  e.preventDefault();
  apiService.query = e.currentTarget.elements.searchQuery.value.trim();
  apiService.resetPage();

  if (!apiService.query) {
    clearCardContainet();
    hideBtn();
    return;
  }
  apiService
    .fetchImages()
    .then(data => {
      if (data.total !== 0) {
        Notiflix.Notify.success(`Hooray! We found ${data.total} images`);
        return data.hits;
      }
    })
    .then(image => {
      clearCardContainet();
      renderCard(image);
      lightboxGallery.refresh();
      showBtn();
    })
    .catch(() => {
      hideBtn();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

function onLoadMore() {
  hideBtn();

  apiService
    .fetchImages()
    .then(data => {
      setTimeout(() => {
        showBtn();
      }, 300);
      return data.hits;
    })
    .then(image => {
      renderCard(image);
      lightboxGallery.refresh();
    });
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

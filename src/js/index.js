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

async function onSearch(e) {
  e.preventDefault();
  apiService.resetPage();
  clearCardContainet();

  apiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (!apiService.query) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    hideBtn();
    return;
  }

  try {
    const { hits, totalHits } = await apiService.fetchImages();
    console.log(hits);
    if (hits.length === 0) {
      hideBtn();
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images`);

    renderCard(hits);
    apiService.resetPage();
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
    apiService.incrementPage();
    const { hits } = await apiService.fetchImages();
    renderCard(hits);
    lightboxGallery.refresh();
    setTimeout(() => {
      showBtn();
    }, 300);
  } catch (error) {
    console.log(error);
    Notify.info("We're sorry, but you've reached the end of search results.");
    clearCardContainet();
  }
}

async function onEntry(entries) {
  entries.forEach(async entry => {
    try {
      if (entry.isIntersecting && apiService.query !== '') {
        apiService.incrementPage();
        const { hits } = await apiService.fetchImages();
        renderCard(hits);
        lightboxGallery.refresh();
        smoothScroll();
        hideBtn();
      }
    } catch (error) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      console.error(error);
    }
  });
}

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '100px',
});

observer.observe(refs.target);

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
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

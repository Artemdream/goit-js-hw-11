import Notiflix from 'notiflix';
import ApiService from './API';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.getElementById('search-form'),
  listCard: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.btn-load-more'),
};
const apiService = new ApiService();

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
    .then(renderCard);
}

function renderCard(data) {
  const markup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a class="gallery__item" href="${largeImageURL}">
  <img class="img-card"src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes <span class="span-text">${likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views <span class="span-text">${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments <span class="span-text">${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads <span class="span-text">${downloads}</span></b>
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  refs.listCard.insertAdjacentHTML('beforeend', markup);
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

new SimpleLightbox('.gallery a', {});

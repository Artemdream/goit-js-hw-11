import { refs } from './refs';

export function renderCard(data) {
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

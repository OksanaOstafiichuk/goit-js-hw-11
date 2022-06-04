// const API_KEY = '27792321-2960889e1be9eac4cb5e657cd';
import LoadMoreBtn from './js/load-more-button';
import ApiService from './js/api-service';
import Notiflix from 'notiflix';


 
const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}

const apiService = new ApiService();
const loadMoreBtn = new LoadMoreBtn();

// loadMoreBtn.hide();

refs.form.addEventListener('submit', onSearchBtn);
refs.loadMoreBtn.addEventListener('click', onloadMoreBtn)

function onSearchBtn(evt) {
    evt.preventDefault();

    apiService.query = evt.currentTarget.elements.searchQuery.value;

    if (apiService.query === '') {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
        
    }
    apiService.resertPage();
    apiService.fetchApi().then(({ hits }) => {
        clearGallery();
        renderGallery({ hits });
        // loadMoreBtn.show();
    });
}

function onloadMoreBtn(evt) {
    apiService.fetchApi().then(renderGallery);

}

// _______________________________________________________________________________

function renderGallery({hits}) {
    const markup = hits
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
        <a class="link-img" href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
            <p class="info-item">
            <b>Likes</b>
            ${likes}
            </p>
            <p class="info-item">
            <b>Views</b>
            ${views}
            </p>
            <p class="info-item">
            <b>Comments</b>
            ${comments}
            </p>
            <p class="info-item">
            <b>Downloads</b>
            ${downloads}
            </p>
        </div>
        </div>`
    }).join('');

    refs.gallery.insertAdjacentHTML('beforeend', markup)
}

function clearGallery() {
    refs.gallery.innerHTML = '';
}

import ApiService from './js/api-service';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import LoadMoreBtn from './js/load-more-button';
import "./css/common.css";

const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}

const apiService = new ApiService();
const loadMoreBtn = new LoadMoreBtn();
loadMoreBtn.hide();

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
    fetchGallery();
    clearGallery();
}

async function fetchGallery() {
    const { hits } = await apiService.fetchApi();
    renderGallery({ hits });
}

function onloadMoreBtn(evt) {
    fetchGallery();
    lightbox.refresh();
    openImages()
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

    refs.gallery.insertAdjacentHTML('beforeend', markup);
    loadMoreBtn.show();
    openImages()

    if (hits.length < 40) {
        loadMoreBtn.hide();
        Notiflix.Notify.info('We are sorry, but you have reached the end of search results.');
    }

    scrollImg()
}

function clearGallery() {
    refs.gallery.innerHTML = '';
}

function openImages() {
    const lightbox = new SimpleLightbox('.photo-card a', {
        captions: true,
        captionsData: 'alt',
        captionDelay: 250,
    });
}

function scrollImg() {
    if (apiService.page > 2) {
        const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });
    }
}
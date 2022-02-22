import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import ImagesIpiServise from './js/fetchImages';
import photoCard from './js/templates/photo_card.hbs'

const refs = getRefs();
const imagesIpiServise = new ImagesIpiServise;

const lightbox = new SimpleLightbox('.gallary a', {    
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250
});

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
    e.preventDefault();
    imagesIpiServise.query = e.currentTarget.elements.searchQuery.value;
    if (imagesIpiServise.query === '') {
        Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
        return;
    }

    imagesIpiServise.resetPage();
    clearImages();
    imagesIpiServise.fetchImages().then(({hits}) => {  
        if(hits.length === 0) {
            Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
            return;
        }              
        appendImagesMarkup(hits);
        imagesIpiServise.incrementPage();
        lightbox.refresh();
        lowScroll();        
    });       
}

function getRefs() {
    return {
        searchForm: document.getElementById('search-form'),
        gallary: document.querySelector('.gallary'),
        scroll: document.querySelector('.scroll')
    }   
}

function clearImages() {
    refs.gallary.innerHTML = '';
}

function appendImagesMarkup(images) {
    refs.gallary.insertAdjacentHTML('beforeend', photoCard(images));
}

const scroll = entries => {
    entries.forEach(entry => {  
        if (entry.isIntersecting && imagesIpiServise.query !== '') {
            imagesIpiServise.fetchImages().then(({ hits, totalHits }) => {
                if (40*imagesIpiServise.page > totalHits) {
                    Notiflix.Notify.info("SWe're sorry, but you've reached the end of search results.");
                    return;
                }
                appendImagesMarkup(hits);
                imagesIpiServise.incrementPage();
                Notiflix.Notify.info(`Hooray! We found totalHits ${totalHits - (40*imagesIpiServise.page)} images.`);
                lightbox.refresh();
                lowScroll();
            })
        }
    });
}

const observer = new IntersectionObserver(scroll);

observer.observe(refs.scroll);

function lowScroll() {
    const { height: cardHeight } = refs.gallary
    .firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
    });
}






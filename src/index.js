import './css/styles.css';
import Notiflix from 'notiflix';
import ImagesIpiServise from './js/fetchImages';
import photoCard from './js/templates/photo_card.hbs'


const refs = getRefs();
const imagesIpiServise = new ImagesIpiServise;

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
        appendImagesMarkup(hits);
        imagesIpiServise.incrementPage;
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

const scroll = () => {
    if (imagesIpiServise.query !== '') {
        imagesIpiServise.fetchImages().then(({ hits }) => {
        appendImagesMarkup(hits);
        imagesIpiServise.incrementPage;
        })
    }
    
}

const observer = new IntersectionObserver(scroll);

observer.observe(refs.scroll);
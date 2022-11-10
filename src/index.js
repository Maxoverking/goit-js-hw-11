import { Notify } from 'notiflix/build/notiflix-notify-aio';
// Описан в документации
import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";


const form = document.querySelector('#search-form');
const formBtn = document.querySelector('#search-form button');
formBtn.setAttribute('disabled', true);
formBtn.style.backgroundColor = "#c9c9c9";

const formInput = document.querySelector('#search-form input');
const gallery = document.querySelector('.gallery')


form.addEventListener('input', controlBtn);
form.addEventListener('submit', getImages);


function getImages(evt) {
    evt.preventDefault();
    cleanHtml()
  
    const formValue = evt.currentTarget;
    const inputText = formValue.elements.searchQuery.value;

    const BASE_URL = `https://pixabay.com/api/?key=31213238-ba438b7a093e03eb97bf90c50`;
    const OPTION = `q=${inputText}&image_type=photo&orientation=horizontal&safesearch=true`;

    fetch(`${BASE_URL}&${OPTION}`)
        .then(response => {return response.json()})
        .then(data => {
            console.log(data);
            if (data.total === 0) {  
                Notify.failure("Sorry, there are no images matching your search query. Please try again.")
                return;
            } else {
                Notify.success(`Hooray! We found ${data.totalHits} images`);
                markupCards(data);
            }  
            // createGalleryItems(data);
        })
        .catch(error => console.log(error));    
    form.reset();
    blockSearchBtn();
    
}

// new SimpleLightbox (".gallery div")
// function createGalleryItems(data) {
//      const dataArray = data.hits;
//     const markupBigImg = dataArray.map(({largeImageURL}) => { 
//         return `<a class="gallery__item" href="${largeImageURL}">
//        <img class="gallery__image" src="" alt="" />
//      </a>`}).join('');  
//     gallery.insertAdjacentHTML('beforeend',markupBigImg);
    
// }

function markupCards(data) {
    const dataArray = data.hits;

   const markup = dataArray.map(object => {
        const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = object;

        console.log("🚀 ~ largeImageURL", largeImageURL);
        return `<div class="photo-card" >
  <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
  <div class="info" >
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div> `}).join('');
gallery.insertAdjacentHTML('beforeend',markup);
}




function controlBtn() {
     const inputValue = formInput.value.trim();
    if (inputValue.length === 0 ) {
        blockSearchBtn();
    } else {
        formBtn.removeAttribute('disabled');
        formBtn.style.backgroundColor = "white"; 
    }
}
function blockSearchBtn() {
    formBtn.setAttribute('disabled', true);
    formBtn.style.backgroundColor = "#c9c9c9";
}

function cleanHtml() {
    gallery.innerHTML = '';
}
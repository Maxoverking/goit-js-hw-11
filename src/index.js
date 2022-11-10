import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const axios = require('axios').default;



const form = document.querySelector('#search-form');
const formBtn = document.querySelector('#search-form button');
formBtn.setAttribute('disabled', true);
formBtn.style.backgroundColor = "#c9c9c9";

const formInput = document.querySelector('#search-form input');
const gallery = document.querySelector('.gallery');


form.addEventListener('input', controlBtn);
form.addEventListener('submit', getImages);

function getImages(evt) {
    evt.preventDefault();
    cleanHtml();
    const inputText = evt.currentTarget.elements.searchQuery.value;

    requestHTTP(inputText).then(({ data }) => {
        if (data.total === 0) {  
                Notify.failure("Sorry, there are no images matching your search query. Please try again.")
                return;
            } else {
                Notify.success(`Hooray! We found ${data.totalHits} images`);
                markupCards(data);
        }  
        const lightbox = new SimpleLightbox('.photo-card a');
        lightbox.refresh();
        
    }).catch(error => console.log(error))
        form.reset();
        blockSearchBtn();
    
}


async function requestHTTP(inputText) {
    const BASE_URL = `https://pixabay.com/api/?key=31213238-ba438b7a093e03eb97bf90c50`;
    const OPTION = `q=${inputText}&image_type=photo&orientation=horizontal&safesearch=true`;
      try {
          const response = await axios.get(`${BASE_URL}&${OPTION}`);
          return response;        
      } catch (error) {
          
    console.error(error);
  }
}


function markupCards(data) {
    const dataArray = data.hits;

   const markup = dataArray.map(object => {
        const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = object;
       return `<div class="photo-card">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
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
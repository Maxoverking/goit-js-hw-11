import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { requestHTTP } from './fetchPicture'

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
let lightbox = new SimpleLightbox('.gallery a');


const form = document.querySelector('#search-form');
const formInput = document.querySelector('#search-form input');
const formBtn = document.querySelector('#search-form button');
formBtn.setAttribute('disabled', true);
formBtn.style.backgroundColor = "#c9c9c9";

const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

form.addEventListener('input', showSearchBtn);
form.addEventListener('submit', getImages);
loadMoreBtn.addEventListener('click', loadMoreData);


let PAGE_COUNTER = 1;

function getImages(evt) {
  evt.preventDefault();
  
  updateSearch();

  const inputText = formInput.value.trim();
  requestHTTP(inputText, PAGE_COUNTER).then(({ data }) => {
    console.log(data.hits);
    if (data.total === 0) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
      return;
    }else {
      Notify.success(`Hooray! We found ${data.totalHits} images`);
      markupCards(data);
      loadMoreBtn.style.display = "block";
      
      lightbox.refresh();
    }
  }).catch(error => console.log(error)); 
}

function loadMoreData() {
   const inputText = formInput.value;
  PAGE_COUNTER ++;
  requestHTTP(inputText, PAGE_COUNTER).then(({ data }) => {
    if (data.hits < 40) {
      loadMoreBtn.style.display = "none";
    } else {
       markupCards(data);
    lightbox.refresh();
    } 
  }).catch(error => console.log(error));
}

function markupCards(data) {
    const dataArray = data.hits;

   const markup = dataArray.map(object => {
        const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = object;
       return `<div class="photo-card">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
    </a>
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
  gallery.innerHTML+= markup; 
}

function showSearchBtn() {
     const inputValue = formInput.value.trim();
    if (inputValue.length === 0 ) {
        blockSearchBtn();
    } else {
        formBtn.removeAttribute('disabled');
        formBtn.style.backgroundColor = "white"; 
    }
}

function updateSearch() {
  gallery.innerHTML = "";
  PAGE_COUNTER = 1
  blockSearchBtn()
  loadMoreBtn.style.display = "none";
}

function blockSearchBtn() {
    formBtn.setAttribute('disabled', true);
    formBtn.style.backgroundColor = "#c9c9c9";
}










// async function requestHTTP(inputText) {
//     const BASE_URL = `https://pixabay.com/api/?key=31213238-ba438b7a093e03eb97bf90c5A0`;
//     const OPTION = `q=${inputText}&image_type=photo&orientation=horizontal&safesearch=true`;
//       try {
//         const response = await axios.get(`${BASE_URL}&${OPTION}&page=${PAGE_COUNTER}&per_page=40`);
//         console.log(response);
//           return response;        
//       } catch (error) {         
//     console.error(error);
//   }
// }

// function getImages(evt) {
//     evt.preventDefault();
//     cleanHtml();
//     let inputText = evt.currentTarget.elements.searchQuery.value;

//     requestHTTP(inputText).then(({ data }) => {
//         if (data.total === 0) {  
//                 Notify.failure("Sorry, there are no images matching your search query. Please try again.")
//                 return;
//             } else {
//                 Notify.success(`Hooray! We found ${data.totalHits} images`);
//           markupCards(data);
          
//           lightbox.refresh();
//         }  
        
//     }).catch(error => console.log(error));
//   form.reset();
//   loadMoreBtn.style.display = "block";
//   blockSearchBtn();
  
// }

// loadMoreBtn.addEventListener('click', (evt) => {
//   PAGE_COUNTER++;
  
//   requestHTTP().then(({ data }) => {
           
//     markupCards(data);
//     const lightbox = new SimpleLightbox('.photo-card a');
//     lightbox.refresh();
//   }
        
//   ).catch(error => console.log(error));

// })


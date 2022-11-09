
const form = document.querySelector('#search-form');
const formBtn = document.querySelector('#search-form button');
const formInput = document.querySelector('#search-form input');
const gallery = document.querySelector('.gallery')

formBtn.addEventListener('click', getImages);

function getImages(evt) {
    evt.preventDefault();
    const textInputValue = formInput.value;

    const BASE_URL = `https://pixabay.com/api/?key=31213238-ba438b7a093e03eb97bf90c50`;
    const OPTION = `q=${textInputValue}&image_type=photo&orientation=horizontal&safesearch=true`;

    fetch(`${BASE_URL}&${OPTION}`)
        .then(response => {return response.json()})
        .then(data =>
            markupCards(data)
            
        )
        .catch(error => console.log(error));    
    form.reset();
}


function markupCards(data) {
    const dataArray = data.hits;

   const markup = dataArray.map(object => {
        const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = object;
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

gallery.innerHTML += markup;
}

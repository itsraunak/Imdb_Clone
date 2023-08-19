const key = '91470c81';


var searchInput = document.getElementById('Input');
var displaySearchList = document.getElementsByClassName('fav-container');

fetch('http://www.omdbapi.com/?i=tt3896198&apikey=91470c81')
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.log(err));

// upon keypress - function findMovies is initiated
searchInput.addEventListener('input' , findMovies);


async function singleMovie() {
    //finding the ID of the movie from the url
    var urlQueryParams = new URLSearchParams(window.location.search);
    var id = urlQueryParams.get('id');
    console.log(id);

    const url = `https://www.omdbapi.com/?i=${id}&apiKey=${key}`;
    const res = await fetch(`${url}`);
    const data = await res.json();
    console.log(data);
    console.log(url);

    // making the output html by string interpollation

    var output = `

    <div class="movie-poster">
        <img src=${data.Poster} alt="Movie Poster">
    </div>
    <div class="movie-details">
        <div class="details-header">
            <div class="dh-ls">
                <h2>${data.Title}</h2>
            </div>
            <div class="dh-rs">
                <i class="fa-solid fa-bookmark" onClick=addTofavorites('${id}') style="cursor: pointer;"></i>
            </div>
        </div>
        <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span 
        style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
        <ul class="details-ul">
            <li><strong>Actors: </strong>${data.Actors}</li>
            <li><strong>Director: </strong>${data.Director}</li>
            <li><strong>Writers: </strong>${data.Writer}</li>
        </ul>
        <ul class="details-ul">
            <li><strong>Genre: </strong>${data.Genre}</li>
            <li><strong>Release Date: </strong>${data.DVD}</li>
            <li><strong>Box Office: </strong>${data.BoxOffice}</li>
            <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
        </ul>
        <p style="font-size: 14px; margin-top:10px;">${data.Plot}</p>
        <p style="font-size: 15px; font-style: italic; color: #222; margin-top: 10px;">
            <i class="fa-solid fa-award"></i>
            &thinsp; ${data.Awards}
        </p>
    </div> 
    `

    //Appending the output

    document.querySelector('.movie-container').innerHTML = output;

}

// add to favorite

async function addTofavorites(id) {
    console.log("fav-item",id);

    localStorage.setItem(Math.random().toString(36).slice(2,7) , id); // math.random for the unique key and value pair
    alert('Movie Added to watchlist!');
}

// removing the movie from the favorites list and also from the localstorage
async function removeFromFavorites(id) {
    console.log(id);
    for(i in localStorage) {
        // if the id passed as argument matches with the value associated with the key , then removing it
        if(localStorage[i] == id) {
            localStorage.removeItem(i)
            break;
        }
    }

    // alerting the user and refreshing the page
    alert('Movie Removed From WatchList');
    window.location.replace('favorite.html');
}

// displaying the movie list on the search page according to the user list
async function displayMovieList(movies) {
    var output = '';
    // transversing over the movies list which is passed as an argument to our function 
    for(i of movies) {
        var img = '';
        if(i.Poster != 'N/A') {
            img = i.Poster;
        } else {
            img = 'img/blank-poster.webp';
        }
        var id = i.imdbID;

        //Appending the output through string interpolition
        output += `

        <div class="fav-item">
            <div class="fav-poster">
            <a href="movie.html?id=${id}"><img src=${img} alt="Favorites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name"><a href="movie.html?id=${id}">${i.Title}</a></p>
                        <p class="fav-movie-rating"><a href="movie.html?id=${id}">${i.Year}</a></p>
                    </div>
                    <div>
                        <i class="fa-solid fa-bookmark" style="cursor:pointer;" onClick=addTofavorites('${id}')></i>
                    </div>
                </div>
            </div>
        </div>

       `
    }
    // Appending this to the movie-display class of out html page
    document.querySelector('.fav-container').innerHTML = output;
    console.log("Here is movieList....." , movies);
}

// when the user is searching for the movie then a list of the related movie will be displayed and that list is defined
async function findMovies() {
    const url = `https://www.omdbapi.com/?s=${(searchInput.value).trim()}&page=1&apikey=${key}`;
    const res = await fetch(`${url}`);
    const data = await res.json();

    if(data.Search) {
        //calling the function to display list to the movies related to the user search
        displayMovieList(data.Search);
    }
}

//Favorite movies are loaded on to the fav page from localstorage
async function favoritesMovieLoader() {

    var output = '';
    //Traversing over all the movies in the localstorage
    for(i in localStorage) {
        var id = localStorage.getItem(i);
        if(id != null) {
            //Fetching the movie through id
            const url = `http://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`;
            // const url = `https://www.omdbapi.com/?i=${i}&plot=full&apikey=${key}`;  // id is on the localStorage
            console.log(id ,"Start");
            const res = await fetch(`${url}`);
            const data = await res.json();
            console.log(data);


            var img = '';
            if(data.Poster) {
                img = data.Poster
            } else {
                img = data.Title;
            }
            var Id = data.imdbID;
            // adding all the movie html in the output using interpolation 
            output += `

            <div class="fav-item">
                <div class="fav-poster">
                    <a href="movie.html?id=${id}"><img src=${img} alt="Favorites Poster"></a>
                </div>
                <div class="fav-details">
                    <div class="fav-details-box">
                        <div>
                            <p class="fav-movie-name">${data.Title}</p>
                            <p class="fav-movie-rating">${data.Year} &middot; <span
                                    style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                        </div>
                        <div style="color: maroon">
                            <i class="fa-solid fa-trash" style="cursor:pointer;" onClick="removeFromFavorites('${Id}')"></i>
                        </div>
                    </div>
                </div>
            </div>
    
           `;
        }
    }
    //Appending the html to the movie-display class in favourite page
    document.querySelector('.fav-container').innerHTML = output;
}
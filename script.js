const API_KEY = '109c71427841a92aeceb78c7e03c2586';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const movieContainer = document.getElementById('movieContainer');
const favoritesContainer = document.getElementById('favoritesContainer');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

// 인기 영화 목록 불러오기
async function getPopularMovies() {
  try {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`);
    const data = await res.json();
    renderMovies(data.results, movieContainer);
  } catch (error) {
    console.error('영화 데이터를 불러오는 중 오류 발생:', error);
  }
}

// 영화 검색 기능
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    renderMovies(data.results, movieContainer);
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
  }
});

// 화면에 영화 카드 출력
function renderMovies(movies, container) {
  if (movies.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">검색 결과가 없습니다.</p>';
    return;
  }

  container.innerHTML = movies.map(movie => {
    const poster = movie.poster_path ? IMAGE_URL + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Image';
    return `
      <div class="card">
        <img src="${poster}" alt="${movie.title}">
        <div class="card-info">
          <h3>${movie.title}</h3>
          <p>⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
        </div>
        <button onclick="saveFavorite(${movie.id}, '${movie.title.replace(/'/g, "\\'")}', '${movie.poster_path || ''}')">❤️ 찜하기</button>
      </div>
    `;
  }).join('');
}

// 찜하기 (localStorage 저장)
function saveFavorite(id, title, poster_path) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.some(m => m.id === id)) {
    favorites.push({ id, title, poster_path });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
    alert(`'${title}'이(가) 찜 목록에 추가되었습니다!`);
  } else {
    alert('이미 찜한 영화입니다.');
  }
}

// 찜 삭제 기능
function removeFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(movie => movie.id !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  loadFavorites();
}

// 찜한 영화 목록 표시
function loadFavorites() {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = '<p style="grid-column: 1/-1; color: #888;">아직 찜한 영화가 없습니다.</p>';
    return;
  }

  favoritesContainer.innerHTML = favorites.map(movie => {
    const poster = movie.poster_path ? IMAGE_URL + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Image';
    return `
      <div class="card">
        <img src="${poster}" alt="${movie.title}">
        <div class="card-info">
          <h3>${movie.title}</h3>
        </div>
        <button style="background-color: #555;" onclick="removeFavorite(${movie.id})">❌ 삭제</button>
      </div>
    `;
  }).join('');
}

// 초기화 호출
getPopularMovies();
loadFavorites();
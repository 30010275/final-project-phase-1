//Declearing a constant apiURL with the URL of the iTunes API. set to search for albums

const apiURL = 'https://itunes.apple.com/search?term=radiohead&entity=album'; // URL for Radiohead albums

//initializing an empty arrsy to store allAlbums data 
let allAlbums = [];
//Defines an asynchronous function to fetch music data from the API. async allows you to use await inside the function for asynchronous operations.

async function fetchMusicData() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        
        // Store the fetched data globally for filtering later
        allAlbums = data.results;

        // Pass the fetched data to the function to display it
        displayMusicData(allAlbums);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('music-data').innerText = 'Failed to load album data.';
    }
}

function displayMusicData(albums) {
    const container = document.getElementById('music-data');
    container.innerHTML = ''; // Clear loading message
//IF ALBUM NOT FOUND DISPLAY NO ALBUM FOUND
    if (albums.length === 0) {
        container.innerHTML = 'No albums found.';
        return;
    }

    albums.forEach(album => {
        const albumDiv = document.createElement('div');
        albumDiv.classList.add('album-item');

        albumDiv.innerHTML = `
            <h2>${album.collectionName}</h2>
            <p><strong>Artist:</strong> ${album.artistName}</p>
            <p><strong>Release Date:</strong> ${new Date(album.releaseDate).toLocaleDateString()}</p>
            <img src="${album.artworkUrl100}" alt="${album.collectionName} artwork" />
            <div class="comment-section">
                <textarea placeholder="Add a comment..."></textarea>
                <button onclick="addComment(event, '${album.collectionId}')">Add Comment</button>
                <ul class="comments-list" id="comments-${album.collectionId}">
                    <!-- Comments will be appended here -->
                </ul>
            </div>
        `;

        container.appendChild(albumDiv);
    });
}

function addComment(event, albumId) {
    event.preventDefault();

    const commentText = event.target.previousElementSibling.value;
    if (!commentText.trim()) return;

    const commentsList = document.getElementById(`comments-${albumId}`);
    const newComment = document.createElement('li');
    newComment.textContent = commentText;
    commentsList.appendChild(newComment);

    // Clear the textarea after adding the comment
    event.target.previousElementSibling.value = '';
}

function filterAlbums() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();

    const filteredAlbums = allAlbums.filter(album => {
        return album.collectionName.toLowerCase().includes(searchTerm) || 
               album.artistName.toLowerCase().includes(searchTerm);
    });

    displayMusicData(filteredAlbums);
}

// Call the function to fetch data when the page loads
fetchMusicData();

const baseUrl = 'https://api.lyrics.ovh';

const searchBtn = document.querySelector('.search-btn');
const backBtn = document.querySelector('#back-btn');
const clearBtn = document.querySelector('.btn-danger');
let songName = document.querySelector('.song-name');
const resultSection = document.querySelector('.search-result');
const lyricTitle = document.querySelector('.lyrics-title');
const lyricBody = document.querySelector('.lyric');
const lyricContainer = document.querySelector('.single-lyrics')

let removeElem = (node) => {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

const updateUI = data => {

    removeElem(resultSection);
    removeElem(lyricTitle);
    removeElem(lyricBody);

    backBtn.style.display = 'none';

    data.forEach(elem => {
        let singleResult = document.createElement('div');
        singleResult.setAttribute('class', 'single-result row align-items-center my-3 p-3');

        let artistImg = document.createElement('img');
        artistImg.setAttribute('class', 'img-fluid rounded');
        artistImg.setAttribute('src', elem.artist.picture);
        let imgContainer = document.createElement('div');
        imgContainer.setAttribute('class', 'col-md-4 d-flex justify-content-center');
        imgContainer.appendChild(artistImg);

        let title = document.createElement('h3');
        title.textContent = elem.title;
        title.setAttribute('class', 'lyrics-name text-center');

        let artist = document.createElement('p');
        artist.textContent = `Album by ${elem.artist.name}`;
        artist.setAttribute('class', 'author lead text-center');

        let preview = document.createElement('a');
        preview.textContent = "Preview";
        preview.setAttribute('class', 'btn btn-info col-sm-5 m-2');
        preview.setAttribute('target', '_blank');
        preview.setAttribute('href', elem.preview);
        preview.setAttribute('rel', 'noopener noreferrer');

        let lyricsBtn = document.createElement('button');
        lyricsBtn.textContent = "Lyrics";
        lyricsBtn.setAttribute('class', 'btn btn-success col-sm-5 m-2');

        let btnContainer = document.createElement('div');
        btnContainer.setAttribute('class', 'row d-flex justify-content-center');
        btnContainer.appendChild(preview);
        btnContainer.appendChild(lyricsBtn);

        let textInfo = document.createElement('div');
        textInfo.setAttribute('class', 'col-md-7');
        textInfo.appendChild(title);
        textInfo.appendChild(artist);
        textInfo.appendChild(btnContainer);

        singleResult.appendChild(imgContainer);
        singleResult.appendChild(textInfo);

        resultSection.appendChild(singleResult);
    });

    clearBtn.style.display = 'block';

};


const fetchSongData = () => {
    if (songName.value !== '') {

        fetch(`${baseUrl}/suggest/${songName.value}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                } else {
                    return response.json();
                }
            }).then(response => {
                updateUI(response.data);
            }).catch(error => {
                console.log(error);
            });
    }
};

const fetchLyrics = event => {
    const target = event.target;

    if (target.tagName == 'BUTTON') {
        let title = target.parentNode.parentNode.childNodes[0].textContent;
        let artist = target.parentNode.parentNode.childNodes[1].textContent.substr(9);

        removeElem(resultSection);

        lyricTitle.textContent = `${title}-${artist}`;

        backBtn.style.display = 'block';

        fetch(`${baseUrl}/v1/${artist}/${title}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                } else {
                    return response.json();
                }
            }).then(response => {
                let lyricLines = response.lyrics.split("\n");
                lyricLines.forEach(line => {
                    let lineBreak = document.createElement("br");
                    let textNode = document.createTextNode(line);
                    lyricBody.appendChild(textNode);
                    lyricBody.appendChild(lineBreak);
                });
            }).catch(error => {
                console.log(error);
                lyricBody.innerHTML = `${error}!Could not find lyrics...`
            });
    }
};

searchBtn.addEventListener('click', fetchSongData);

resultSection.addEventListener('click', fetchLyrics);

backBtn.addEventListener('click', fetchSongData);

clearBtn.addEventListener('click', () => {
    songName.value = '';
    removeElem(resultSection);
    removeElem(lyricTitle);
    removeElem(lyricBody);
    backBtn.style.display = 'none';
    clearBtn.style.display = 'none';
});

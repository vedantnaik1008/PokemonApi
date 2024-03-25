let pageNumber = 0;
let pageLength = 500;
// let loading = false;
const body = document.querySelector('body');
const card = document.querySelector('.card');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-image');
const modalParagraph = document.getElementById('modal-name');
const modalCLose = document.querySelector('.modal .modal-content .close');
const prev_button = document.querySelector('.prev');
const next_button = document.querySelector('.next');
const loading = document.querySelector('.loading p')
const formContainer = document.querySelector('.form_container .container')
const input = document.querySelector('.input');
// `https://pokeapi.co/api/v2/pokemon/`;

const disableButtons = (disable) => {
    prev_button.disabled = disable;
    next_button.disabled = disable;
};

const loadingIndicatior = (value) => {
    if (value === true) {
        loading.classList.add('loading');
        loading.innerText = 'loading...'
        console.log('adding', value);
    }else{
        loading.remove()
        console.log('removing', value);
    }
}

const fetchData = async () => {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/?offset=${pageNumber}&limit=20`;
    try {
        disableButtons(true);
        loadingIndicatior(true)
        const res = await fetch(apiUrl);
        const data = await res.json();
        await fetchDataAgain(data.results);
        loadingIndicatior(false)
        disableButtons(false);
        console.log(data);
    } catch (error) {
        console.log('failed to fetch data', error);
    }
};

const fetchDataAgain = async (dataAgain) => {
    try {
        const allPokemonData = [];

        await Promise.all(
            dataAgain.map(async (item) => {
                const res = await fetch(item.url);
                const data = await res.json();
                // Push each Pokémon object into the array
                allPokemonData.push(data);
            })
        );
        renderDataAgain(allPokemonData);
    } catch (error) {
        console.log('failed to fetch data again');
    }
};

const renderDataAgain = (data) => {
    // console.log(data[0]);

    let html = '';
    data.forEach((item, i) => {
        html += `<div class="card" data-index="${i}">
        <img src="${item.sprites.other.dream_world.front_default}" loading='${
            i === 0 ? 'egar' : 'lazy'
        }' height='200px' width='200px' alt="${item.name}">
        <p>${item.name}</p>
    </div>
    `;
    });
    const container = document.querySelector('.flex');
    container.innerHTML = html;

    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            openModal(data[index]);
        });
    });
};

const openModal = (pokemon) => {
    console.log(pokemon);
    modal.style.display = 'block';
    modalImg.src = pokemon.sprites.other.dream_world.front_default;
    modalImg.width = '300';
    modalImg.height = '300';
    modalParagraph.innerText = pokemon.name;
    console.log(modal);
    body.append(modal);
};

const closeModal = () => {
    modal.style.display = 'none';
};

const prevButton = () => {
    if (pageNumber > 10) {
        pageNumber = pageNumber - 10;
    } else {
        pageNumber = pageLength;
    }
    loadingIndicatior(true);
    fetchData();
};

const nextButton = () => {
    if (pageNumber < pageLength) {
        pageNumber = pageNumber + 10;
    } else {
        pageNumber = 0;
    }
    loadingIndicatior(true);
    fetchData();

};

const handleInput = async(e) =>{
    const api = `https://pokeapi.co/api/v2/pokemon/${e.target.value}`;
try {
    const res = await fetch(api)
    const data = await res.json()
    console.log(data, 'input data');
    renderSearchData(data)
} catch (error) {
    console.log(error, "input");
}
}

const renderSearchData = (data) => {
   formContainer.innerHTML = `<div class="cards">
        <img src="${data.sprites.other.dream_world.front_default}" height='200px' width='200px' alt="${data.name}">
        <p>${data.name}</p>
    </div>`;
}

prev_button.addEventListener('click', prevButton);
next_button.addEventListener('click', nextButton);
document.querySelector('.close').addEventListener('click', closeModal);
input.addEventListener('change', handleInput)
fetchData();

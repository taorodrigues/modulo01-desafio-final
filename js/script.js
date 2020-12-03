/**
 * Estado da aplicação (state)
 */
let containerUsers = null;
let tabFilteredUsers = null;
let tabInformation = null;

let searchInput = null;
let searchButton = null;
let sentenceToSearch = null;

let allUsers = [];
let filteredUsers = [];

const numberFormat = Intl.NumberFormat('pt-BR');
const MINIMUM_LENGTH_SEARCH = 1;

window.addEventListener('load', () => {
  // 1. Na carga inicial da aplicação, obter os dados dos usuarios
  mapIds();
  fetchUsers();
  inputListener();
  showNoUsers();
  showNoStatistics();
});

function mapIds() {
  containerUsers = document.querySelector('.user-container');
  tabFilteredUsers = document.querySelector('#tabFilteredUsers');
  tabInformation = document.querySelector('#tabInformation');

  searchInput = document.querySelector('#inputName');
  searchButton = document.querySelector('#searchButton');
  searchButton.disabled = 'true'; // desabilita o botao ao inicializar a pagina
}

async function fetchUsers() {
  // 2. Carregar os dados dos usuários em um array.
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  ); // retorna em binario
  const json = await res.json();

  allUsers = json.results.map((user) => {
    const { picture, gender, name, dob } = user;

    return {
      picture: picture.thumbnail,
      gender: gender,
      name: name.first + ' ' + name.last,
      age: dob.age,
    };
  });
}

function inputListener() {
  searchInput.addEventListener('keyup', (event) => {
    const searchLength = searchInput.value.trim().length;
    // habilitar e desabilitar o botao de busca
    searchButton.disabled = searchLength < MINIMUM_LENGTH_SEARCH;

    if (searchLength < MINIMUM_LENGTH_SEARCH) {
      return;
    }

    if (event.keyCode !== 13 && event.keyCode !== 13) {
      return;
    }

    searchUsers();
  });
}

function showNoStatistics() {
  tabInformation.innerHTML = `<h2>No statistics to show.</h2>`;
}

function showNoUsers() {
  tabFilteredUsers.innerHTML = `<h2>No user has been found.</h2>`;
}

function searchUsers() {
  //4. Para filtrar, considere todo o texto em minúsculas. Assim, o filtro "E" trará tanto "Elena" quanto "Helena", caso existam na API.
  sentenceToSearch = searchInput.value.toLocaleLowerCase();

  if (sentenceToSearch !== '') {
    //3. Filtrem os dados a partir de qualquer posição no nome, ou seja, o nome "Brenda" (caso exista na API) deve ser retornado se o filtro for "enda".
    filteredUsers = allUsers.filter((user) =>
      user.name.toLocaleLowerCase().includes(sentenceToSearch, 0)
    );

    if (filteredUsers.length === 0) {
      showNoUsers();
      showNoStatistics();

      return;
    }

    filteredUsers.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    renderUserList();
    renderStatistics();
  } else {
    filteredUsers = [];
  }

  console.log(filteredUsers);
}

function renderUserList() {
  let usersHTML = `<div><h5>${filteredUsers.length} user(s) found:</h5>`;

  filteredUsers.forEach((country) => {
    let { picture, name, age } = country;

    name = highlight(name, sentenceToSearch);

    const userHTML = `
      <div class='country'>
        <div>
          <img src="${picture}" alt="${name}">
        </div>
        <div>
          ${name}, ${age} anos
        </div>
      </div>  
    `;

    usersHTML += userHTML;
  });

  usersHTML += '</div>';
  tabFilteredUsers.innerHTML = usersHTML;
}

function renderStatistics() {
  let = 0;

  const totalAge = filteredUsers.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);

  const averageAge = parseFloat(totalAge / filteredUsers.length).toFixed(2);

  let numberOfMaleUsers = filteredUsers.filter(
    (user) => user.gender.toLocaleLowerCase() === 'male'
  );

  numberOfMaleUsers = numberOfMaleUsers.length;

  let numberOfFemaleUsers = filteredUsers.filter(
    (user) => user.gender.toLocaleLowerCase() === 'female'
  );

  numberOfFemaleUsers = numberOfFemaleUsers.length;

  console.log(numberOfMaleUsers);
  console.log(numberOfFemaleUsers);
  console.log(totalAge);
  console.log(averageAge);

  let informationHtml = '<div><h5>Estatisticas</h5>';

  const estatisticasHTML = `
      <div class='information-container'>
        <div>
          Sexo Masculino: <b>${numberOfMaleUsers}</b>
        </div>
        <div>
          Sexo Feminino: <b>${numberOfFemaleUsers}</b>
        </div>
        <div>
          Soma das Idades: <b>${totalAge}</b>
        </div>
        <div>
          Média das Idades: <b>${averageAge}</b>
        </div>
      </div>
    `;

  informationHtml += estatisticasHTML + '</div>';
  tabInformation.innerHTML = informationHtml;
}

function highlight(originalText, text) {
  var innerHTML = '';
  var index = originalText.toLocaleLowerCase().indexOf(text);

  if (index >= 0) {
    innerHTML =
      originalText.substring(0, index) +
      "<span class='highlight'>" +
      originalText.substring(index, index + text.length) +
      '</span>' +
      originalText.substring(index + text.length);
  }
  000;
  return innerHTML;
}

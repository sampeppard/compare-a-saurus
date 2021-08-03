// Create Dino Constructor
function LifeForm(species, weight, height, diet, location, period, facts) {
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.location = location;
    this.period = period;
    this.fact = facts;
    this.image = `./images/${species.toLowerCase()}.png`
}

// Create Dino Compare Method 1
LifeForm.prototype.compareWeight = (dino, human) => {
    if (dino.weight > human.weight) {
        return `The ${dino.species} is heavier than ${human.name}`
    } else if (dino.weight === human.weight) {
        return `The ${dino.species} weighs the same as ${human.name}`
    } else {
        return `The ${dino.species} is lighter than ${human.name}`
    }
}

// Create Dino Compare Method 2
LifeForm.prototype.compareHeight = (dino, human) => {
    if (dino.height > human.height) {
        return `The ${dino.species} is taller than ${human.name}`
    } else if (dino.height === human.height) {
        return `The ${dino.species} is the same height as ${human.name}`
    } else {
        return `The ${dino.species} is shorter than ${human.name}`
    }
}

// Create Dino Compare Method 3
LifeForm.prototype.compareDiet = (dino, human) => {
    if (dino.diet === human.diet) {
        return `A ${dino.species} has the same diet as ${human.name}`
    } else {
        return `A ${dino.species} is has a different diet than ${human.name}`
    }
}

// Method to create extra facts
LifeForm.prototype.createFacts = (lifeform) => {
    return {
        periodFact: `The ${lifeform.species} lived in the ${lifeform.when} period`,
        habitatFact: `The ${lifeform.species} was native to ${lifeform.where}`
    }
}

function Dinosaur(species, weight, height, diet, location, period, facts) {
    LifeForm.call(this, species, weight, height, diet, location, period, facts);
}
Dinosaur.prototype = Object.create(LifeForm.prototype);
Dinosaur.prototype.constructor = Dinosaur;

// Create Human Object
const Human = new LifeForm('human');

// Consume form info and create instance
function handleForm() {
    const name = document.getElementById('name').value;
    const heightInFeet = document.getElementById('feet').value;
    const heightInches = document.getElementById('inches').value;
    const weight = document.getElementById('weight').value;
    const diet = document.getElementById('diet').value;
    const form = document.getElementById('dino-compare');
    const grid = document.getElementById('grid');
    const validation = document.getElementById('validation');
    const backNav = document.getElementById('back-nav');

    const values = [name, heightInFeet, heightInches, weight, diet];

    if (values.includes('')) {
        validation.style.display = 'block';
        validation.innerText = 'Please ensure all fields are filled out ;)';
        return;
    } else {
        form.style.display = 'none';
        validation.style.display = 'none';
        grid.style.display = 'flex';
        backNav.style.display = 'block';
    }

    Human.name = name;
    Human.height = parseInt(heightInFeet) * 12 + parseInt(heightInches);
    Human.weight = parseInt(weight);
    Human.diet = diet;

    return values;
}

clearFormAndGrid = () => {
    document.getElementById('name').value = '';
    document.getElementById('feet').value = '';
    document.getElementById('inches').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('grid').innerHTML = '';
}

handleBackNav = () => {
    const grid = document.getElementById('grid');
    const validation = document.getElementById('validation');
    const backNav = document.getElementById('back-nav');
    const form = document.getElementById('dino-compare');

    grid.style.display = 'none';
    form.style.display = 'block';
    backNav.style.display = 'none';
    validation.style.display = 'none';

    clearFormAndGrid();
}

// Add tiles to DOM
populateGrid = (lifeform) => {
    const gridList = document.getElementById('grid');
    const handleTitle = lifeform.species === 'human' ? Human.name : lifeform.species;
    const handleFact = () => {
        if (lifeform.species === 'human') {
            return '';
        } else if (lifeform.species === 'pigeon') {
            return `<p>${lifeform.fact}</p>`
        } else {
            return `<p>${lifeform.factList[Math.floor(Math.random() * lifeform.factList.length)]}</p>`
        }
    };

    const tileContent = `
        <div class="grid-item">
            <h3>${handleTitle}</h3>
            <img src="${lifeform.image}" />
            ${handleFact()}
        </div>`;

    gridList.insertAdjacentHTML('beforeend', tileContent);
    document.getElementById('back-nav').addEventListener('click', (event) => {
        handleBackNav();
    });
};

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);

    return array;
}
  
// Create Dino Objects
function createDinos() {
    fetch('dino.json', {
            headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            }
        }
    )
    .then(response => response.json())
    .then((data) => {

        const shuffledDinos = shuffle(data.Dinos);

        const humanData = {
            name: Human.name,
            species: 'human',
            weight: Human.weight,
            height: Human.height,
            diet: Human.diet,
            image: `./images/human.png`,
        };

        shuffledDinos.splice(4, 0, humanData);
    
        shuffledDinos.forEach(dino => {
            const newDino = new Dinosaur(
                dino.species,
                dino.weight,
                dino.height,
                dino.diet,
                dino.where,
                dino.when,
                dino.fact,
                dino.image
            );

            const weightComparison = newDino.compareWeight(dino, humanData);
            const heightComparison = newDino.compareHeight(dino, humanData);
            const dietComparison = newDino.compareDiet(dino, humanData);
            const extraFacts = newDino.createFacts(dino);

            const facts = [weightComparison, heightComparison, dietComparison, dino.fact, extraFacts.periodFact, extraFacts.habitatFact];

            newDino.factList = facts;
            
            populateGrid(newDino);
        })
    });
}

// On button click, prepare and display infographic in IIFE
(function () {
    document.getElementById('btn').addEventListener('click', (event) => {
        event.preventDefault();
        handleForm();

        createDinos();
    });
})();

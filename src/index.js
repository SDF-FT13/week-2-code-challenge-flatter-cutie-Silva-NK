document.addEventListener("DOMContentLoaded", async () => {
    getCharacters ();

    let allCharacters = [];
    
    const characterInfo = document.getElementById("detailed-info");
    const characterBar =  document.getElementById("character-bar");
    const voteCount =  document.getElementById("vote-count");
    const voteForm =  document.getElementById("votes-form");
    const voteInput =  document.getElementById("votes");
    const resetBtn =  document.getElementById("reset-btn");

    function getCharacters() {
        fetch("http://localhost:3000/characters")
        .then(response => response.json ())
        .then(characters => {
            allCharacters = characters;
            displayCharacters(characters);
        })
        .catch(error => console.error("Error fetching characters: ", error));
    }

    function displayCharacters(characters) {
        characters.forEach(character => {
            const span = document.createElement("span");
            span.textContent = character.name;
            span.addEventListener("click", () => showCharacterInfo(character));
            characterBar.appendChild(span);
        });
    }

    function showCharacterInfo(character) {
        document.getElementById("name").textContent = character.name;
        document.getElementById("image").src = character.image;
        document.getElementById("image").alt = character.name;
        document.getElementById("vote-count").textContent = character.votes;

        currentCharacter = character;
    }

    voteForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (currentCharacter) {
            const sumOfVotes = parseInt(voteInput.value);
            if(!isNaN(sumOfVotes) && sumOfVotes > 0) {
                currentCharacter.votes += sumOfVotes;
                voteCount.textContent= currentCharacter.votes;
                voteInput.value = "";
            }
        }
    });

    resetBtn.addEventListener("click", () => {
        if (currentCharacter) {
            currentCharacter.votes = 0;
            voteCount.textContent = 0;
        }
    });
});

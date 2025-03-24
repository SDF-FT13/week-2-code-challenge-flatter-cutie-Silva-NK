document.addEventListener("DOMContentLoaded", async () => {
    getCharacters ();

    let allCharacters = [];
    
    const characterInfo = document.getElementById("detailed-info");
    const characterBar =  document.getElementById("character-bar");

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
        characterInfo.innerHTML = "";

        const characterName = document.createElement("p");
        characterName.id = "name";
        characterName.textContent = character.name;

        const characterImage = document.createElement("img");
        characterImage.id = "image";
        characterImage.src = character.image;
        characterImage.alt = character.name;

        characterInfo.appendChild(characterName);
        characterInfo.appendChild(characterImage);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    getCharacters ();

    /* I changed the image-URLs of  Mr. Cutie an Mx. Monkey in the db.json since the originals were not available. */

    let allCharacters = [];
    let currentCharacter = null;
    
    const characterInfo = document.getElementById("detailed-info");
    const characterBar =  document.getElementById("character-bar");
    const voteCount =  document.getElementById("vote-count");
    const voteForm =  document.getElementById("votes-form");
    const voteInput =  document.getElementById("votes");
    const resetBtn =  document.getElementById("reset-btn");
    const characterForm = document.getElementById("character-form");

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

                fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ votes: currentCharacter.votes })
                })
                .then(response => response.json())
                .catch(error => console.error("Error updating votes: ", error));
            }
        }
    });

    resetBtn.addEventListener("click", () => {
        if (currentCharacter) {
            currentCharacter.votes = 0;
            voteCount.textContent = 0;

            fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ votes: 0 })
            })
            .then(response => response.json())
            .then(() => {
                currentCharacter.votes = 0;
                voteCount.textContent = 0;
            })
            .catch(error => console.error("Error resetting votes: ", error));
        }
    });

    characterForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newCharName = document.getElementById("new-name").value; //Change name id to new-name to prevent overlap with earlier name id.
        const newCharImage = document.getElementById("image-url").value;

        if (newCharName.trim() !== "" && newCharImage.trim() !== "") {
            const newCharacter = {
                // id: allCharacters.length + 1,
                name: newCharName,
                image: newCharImage,
                votes: 0
            };

            fetch("http://localhost:3000/characters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCharacter)
            })
            .then(response => response.json())
            .then(savedCharacter => {
                allCharacters.push(savedCharacter);

            //allCharacters.push(newCharacter);

            const span = document.createElement("span");
            span.textContent = savedCharacter.name; // span.textContent = newCharacter.name;
            span.addEventListener("click", () => showCharacterInfo(savedCharacter)); // span.addEventListener("click", () => showCharacterInfo(newCharacter));
            characterBar.appendChild(span);

            showCharacterInfo(savedCharacter); // showCharacterInfo(newCharacter);

            characterForm.reset();
        })
        .catch(error => console.error("Error adding new character: ", error));
    }
    });

});

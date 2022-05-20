let deckId
let wins1 = 0
let wins2 = 0
const cardsContainer = document.getElementById("cards")
const newDeckBtn = document.getElementById("new-deck")
const drawCardBtn = document.getElementById("draw-cards")
const header = document.getElementById("header")

function handleClick() {
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id
            console.log(deckId)
        })
}

newDeckBtn.addEventListener("click", handleClick)

drawCardBtn.addEventListener("click", () => {
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].image} class="card" />
            `
            cardsContainer.children[1].innerHTML = `
                <img src=${data.cards[1].image} class="card" />
            `
            const winnerText = determineCardWinner(data.cards[0], data.cards[1])
            header.textContent = winnerText
            document.getElementById("remaining-cards").textContent = `Remaining cards: ${data.remaining}`

            if (data.remaining <= 0) {
                drawCardBtn.disabled = true
                drawCardBtn.style.cursor = "not-allowed"
                newDeckBtn.innerHTML = `Another game? `
                newDeckBtn.addEventListener('click', () => { location.reload() })
                if (wins1 > wins2) {
                    header.innerText = "COMPUTER WON THE WAR!"
                } else if (wins1 < wins2) {
                    header.innerText = "CONGRATS YOU WON THE WAR!"
                } else {
                    header.innerText = "ITS A DRAW!"
                }
            }
        })

})

function determineCardWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9",
        "10", "JACK", "QUEEN", "KING", "ACE"
    ]
    const card1ValueIndex = valueOptions.indexOf(card1.value)
    const card2ValueIndex = valueOptions.indexOf(card2.value)

    if (card1ValueIndex > card2ValueIndex) {
        wins1++
        document.getElementById("comp-score").textContent = `Computer score: ${wins1} `
        return "Computer win!"
    } else if (card1ValueIndex < card2ValueIndex) {
        wins2++
        document.getElementById("player-score").textContent = `Your score: ${wins2} `
        return "You win!"
    } else {
        return "War!"
    }
}
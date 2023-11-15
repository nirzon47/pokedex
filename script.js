// DOM Elements
const pokemonContainerElement = document.getElementById('pokemon-container')

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
	fetchPokemon()
})

// Variables
let data = []

// Functions
const fetchPokemonResponse = (id) => {
	return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((response) =>
		response.json()
	)
}

const fetchPokemon = async () => {
	const promises = []
	const currGen = 'one'

	for (let i = gen[currGen].start; i <= gen[currGen].end; i++) {
		promises.push(fetchPokemonResponse(i))
	}

	Promise.all(promises).then((pokemons) => {
		data = pokemons
		renderPokemon()
	})
}

const renderPokemon = () => {
	pokemonContainerElement.innerHTML = ''
	const fragment = document.createDocumentFragment()

	data.forEach((item) => {
		const label = document.createElement('label')
		label.classList.add('swap', 'swap-flip')
		const id = item.id.toString().padStart(3, '0')

		label.id = item.id

		const [types, abilities] = getTypesAndAbilities(item)

		// Getting background color of the card
		const bgColor = getBackgroundColor(item.types[0].type.name)

		label.innerHTML = `
                     <input type="checkbox" />
                        <div class="card ${bgColor} swap-off">
                            <h3 class="card-id">${id}</h3>
                            <img
                                src="${item.sprites.other.dream_world.front_default}"
                                alt="${item.name}"
                                class="h-32 max-w-[91%]"
                            />
                            <h3 class="text-2xl font-semibold capitalize">${item.name}</h3>
                            <div class="flex gap-x-2">
                                ${types}
		    				</div>
                        </div>
                        <div class="card ${bgColor} swap-on">
                            <h3 class="card-id">${id}</h3>
                            <img
                                src="${item.sprites.other.dream_world.front_default}"
                                alt="${item.name}"
                                class="h-32 max-w-[91%]"
                            />
                            <h3 class="-mt-4 text-2xl font-semibold capitalize">${item.name}</h3>
                            <p class="w-10/12 font-medium text-center">
                                Abilities: ${abilities}
                            </p>
                        </div>`

		fragment.append(label)
	})

	pokemonContainerElement.append(fragment)
}

const getTypesAndAbilities = (item) => {
	// Getting all the types
	let types = ''
	item.types.forEach((type) => {
		types += `<p class="type">${type.type.name}</p>`
	})

	// Getting all the abilities
	let abilities = ''
	item.abilities.forEach((ability) => {
		abilities +=
			ability.ability.name.charAt(0).toUpperCase() +
			ability.ability.name.slice(1) +
			', '
	})
	abilities = abilities.slice(0, -2)

	return [types, abilities]
}

const getBackgroundColor = (type) => {
	switch (type) {
		case 'grass':
			return 'bg-green-400'

		case 'fire':
			return 'bg-red-400'

		case 'water':
			return 'bg-blue-400'

		case 'bug':
			return 'bg-yellow-400'

		case 'normal':
			return 'bg-gray-400'

		case 'poison':
			return 'bg-purple-400'

		case 'electric':
			return 'bg-yellow-300'

		case 'ground':
			return 'bg-yellow-700'

		case 'fairy':
			return 'bg-pink-400'

		case 'fighting':
			return 'bg-red-600'

		case 'psychic':
			return 'bg-pink-600'

		case 'rock':
			return 'bg-gray-600'

		case 'ghost':
			return 'bg-purple-600'

		case 'ice':
			return 'bg-cyan-400'

		case 'dragon':
			return 'bg-yellow-50'

		case 'dark':
			return 'bg-gray-800'

		case 'steel':
			return 'bg-gray-700'

		case 'flying':
			return 'bg-blue-300'
	}
}

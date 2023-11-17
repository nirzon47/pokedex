/* DOM Elements
 */

// Sections
const pokemonContainerElement = document.getElementById('pokemon-container')

// Elements
const loadingElement = document.getElementById('loading')
const noResultsElement = document.getElementById('no-results')

// Inputs
const nameInputElement = document.getElementById('name-input')
const enableHoverElement = document.getElementById('enable-hover')

// Buttons
const resetButtonElement = document.getElementById('reset-btn')
const settingsButtonElement = document.getElementById('settings-btn')

// Selects
const generationSelectElement = document.getElementById('generation-select')
const typeSelectElement = document.getElementById('type-select')
const themeSelectElement = document.getElementById('theme-select')

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
	fetchPokemon()
	fetchTypes()
	setThemeSelect()
	handleThemeSelect()
	setHoverCheckbox()
	handleHoverChange()
})

typeSelectElement.addEventListener('change', () => {
	handleTypeSelect()
})

nameInputElement.addEventListener('input', () => {
	handleSearch()
})

generationSelectElement.addEventListener('change', () => {
	handleGenerationSelect()
})

resetButtonElement.addEventListener('click', () => {
	currGen = 'one'
	nameInputElement.value = ''
	typeSelectElement.value = 'all'
	generationSelectElement.value = 'one'
	noResultsElement.classList.add('hidden')
	fetchPokemon()
})

settingsButtonElement.addEventListener('click', () => {
	settingsModal.showModal()
})

themeSelectElement.addEventListener('change', () => {
	handleThemeSelect()
})

enableHoverElement.addEventListener('change', () => {
	handleHoverChange()
})

// Variables
let pokemon = [] // Globally storing fetched data
let currGen = 'one' // Current generation
let filteredPokemon = [] // Filtered pokemon

// Local storage variables
let theme = localStorage.getItem('theme') || 'dracula'
let hoverSetting = localStorage.getItem('hover') || 'false'

// Functions

/**
 * Fetches the response for a given Pokemon ID from the PokeAPI.
 *
 * @param {number} id - The ID of the Pokemon to fetch.
 * @return {Promise} - A Promise that resolves to the JSON response from the PokeAPI.
 */
const fetchPokemonResponse = (id) => {
	return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((response) =>
		response.json()
	)
}

/**
 * Fetches the details of multiple Pokemon asynchronously.
 *
 * @return {Promise<void>} A promise that resolves when all the Pokemon details have been fetched.
 */
const fetchPokemon = async () => {
	const promises = []

	for (let i = gen[currGen].start; i <= gen[currGen].end; i++) {
		promises.push(fetchPokemonResponse(i))
	}

	loadingElement.classList.remove('opacity-0')
	Promise.all(promises).then((pokemons) => {
		pokemon = pokemons
		renderPokemon()
		loadingElement.classList.add('opacity-0')
	})
}

/**
 * Renders the Pokemon data on the webpage.
 *
 * @param {Array} [data=pokemon] - The data to be rendered. Defaults to the "pokemon" array.
 */
const renderPokemon = (data = pokemon) => {
	pokemonContainerElement.innerHTML = ''
	const fragment = document.createDocumentFragment()

	data.forEach((item) => {
		const div = document.createElement('div')
		div.classList.add('flex', 'justify-center', 'items-center')

		const label = document.createElement('label')
		label.classList.add('swap', 'swap-flip', 'w-60')

		// Getting the id, if it is less than 100, add zeros to make it 3 digit
		const id = item.id.toString().padStart(3, '0')

		label.id = item.id

		// Getting types and abilities
		const [types, abilities] = getTypesAndAbilities(item)

		// Getting background color of the card
		const bgColor = getBackgroundColor(item.types[0].type.name)

		// Getting the sprites
		const [frontSprite, backSprite] = getSprites(item)

		label.innerHTML = `
                     <input type="checkbox" />
                        <div class="card ${bgColor} swap-off">
                            <h3 class="card-id">${id}</h3>
                            <img
                                src="${frontSprite}"
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
                                src="${backSprite}"
                                alt="${item.name}"
                                class="h-32 max-w-[91%]"
                            />
                            <h3 class="-mt-4 text-2xl font-semibold capitalize">${item.name}</h3>
                            <p class="w-10/12 font-medium text-center">
                                Abilities: ${abilities}
                            </p>
                        </div>`

		div.append(label)
		fragment.append(div)

		if (hoverSetting) {
			label.addEventListener('mouseenter', () => {
				label.children[0].checked = true
				console.log('fired')
			})
			label.addEventListener('mouseleave', () => {
				label.children[0].checked = false
			})
		}
	})

	pokemonContainerElement.append(fragment)
}

/**
 * Generates a function comment for the given function body.
 *
 * @param {object} item - The item to process.
 * @return {array} An array containing the types and abilities.
 */
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

/**
 * Returns the background color based on the given type.
 *
 * @param {string} type - The type of the background color.
 * @return {string} The corresponding background color.
 */
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

		case 'unknown':
			return 'bg-zinc-800'

		case 'shadow':
			return 'bg-zinc-900'
	}
}

/**
 * Fetches types from the PokeAPI and appends them to a select element.
 *
 * @return {Promise<void>} A Promise that resolves when the types are fetched and appended.
 */
const fetchTypes = async () => {
	const response = await fetch('https://pokeapi.co/api/v2/type')
	const data = await response.json()
	const types = data.results

	types.forEach((type) => {
		const option = document.createElement('option')
		option.value = type.name
		option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1)
		typeSelectElement.append(option)
	})
}

/**
 * Handles the selection of a type in the type select element.
 *
 * @return {undefined} This function does not return a value.
 */
const handleTypeSelect = () => {
	const selection = typeSelectElement.value

	if (selection === 'all') {
		noResultsElement.classList.add('hidden')
		fetchPokemon()
		filteredPokemon = pokemon
	} else {
		filteredPokemon = pokemon.filter(
			(item) => item.types[0].type.name === selection
		)

		if (filteredPokemon.length > 0) {
			noResultsElement.classList.add('hidden')
			renderPokemon(filteredPokemon)
		} else {
			noResultsElement.classList.remove('hidden')
			pokemonContainerElement.innerHTML = ''
		}
	}

	nameInputElement.value = ''
}

/**
 * Handles the search functionality.
 *
 * @return {undefined} There is no return value.
 */
const handleSearch = () => {
	const value = nameInputElement.value.toLowerCase()

	if (value === '') {
		renderPokemon(filteredPokemon)
	} else {
		if (filteredPokemon.length === 0) {
			filteredPokemon = pokemon
		}

		const temp = filteredPokemon.filter((item) =>
			item.name.toLowerCase().includes(value)
		)

		if (temp.length > 0) {
			noResultsElement.classList.add('hidden')
			renderPokemon(temp)
		} else {
			noResultsElement.classList.remove('hidden')
			pokemonContainerElement.innerHTML = ''
		}
	}
}

/**
 * Handles the selection of a generation.
 *
 * @param {type} - None
 * @return {type} - None
 */
const handleGenerationSelect = () => {
	currGen = generationSelectElement.value
	fetchPokemon()
	nameInputElement.value = ''
	typeSelectElement.value = 'all'
}

/**
 * Retrieves the sprites of an item.
 *
 * @param {Object} item - The item object.
 * @return {Array} An array containing the front default and front shiny sprites.
 */
const getSprites = (item) => {
	if (
		currGen === 'one' ||
		currGen === 'two' ||
		currGen === 'three' ||
		currGen === 'four' ||
		currGen === 'five'
	) {
		return [
			item.sprites.other.dream_world.front_default,
			item.sprites.other.home.front_shiny,
		]
	} else {
		return [
			item.sprites.other.home.front_default,
			item.sprites.other.home.front_shiny,
		]
	}
}

/**
 * Sets the theme based on the selected value in the theme select element.
 *
 * @return {undefined} No return value.
 */
const handleThemeSelect = () => {
	const currSelection = themeSelectElement.value
	if (currSelection === 'dark') {
		document.documentElement.setAttribute('data-theme', 'dracula')
		theme = 'dark'
	} else {
		document.documentElement.setAttribute('data-theme', 'emerald')
		theme = 'light'
	}

	localStorage.setItem('theme', theme)
}

/**
 * Sets the selected option in the theme select element based on the value stored in local storage.
 *
 * @param {void}
 * @return {void}
 */
const setThemeSelect = () => {
	const theme = localStorage.getItem('theme')
	themeSelectElement.children[theme === 'light' ? 0 : 1].selected = true
}

/**
 * Handles the change event for the hover setting.
 *
 * @param {none} none - This function does not take any parameters.
 * @return {none} This function does not return any value.
 */
const handleHoverChange = () => {
	const currSelection = enableHoverElement.checked
	if (currSelection === true) {
		hoverSetting = true
	} else {
		hoverSetting = false
	}

	renderPokemon()

	localStorage.setItem('hover', hoverSetting)
}

/**
 * Sets the value of the hover checkbox based on the value stored in localStorage.
 *
 * @returns {void}
 */
const setHoverCheckbox = () => {
	const hover = localStorage.getItem('hover')
	if (hover === 'true') {
		enableHoverElement.checked = true
	} else {
		enableHoverElement.checked = false
	}
}

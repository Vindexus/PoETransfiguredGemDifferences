// This is the code I used in chrome dev tools to get the JSON of the skills
// that I then just pasted into the JSON files
(async function (){
	const numPopupsLoaded = document.querySelectorAll('.itemPopupContainer').length

	if (numPopupsLoaded < 10) {
		console.error(`Not enough popups were loaded. Slowly scroll down the page for them to get loaded, then run the scriplet. ZOOM OUT is good.`)
		return
	}

	const gems = {}
	const popups = document.querySelectorAll('.itemPopupContainer')
	popups.forEach((popup) => {
		const mods = popup.querySelectorAll('.explicitMod .lc')
		mods.forEach((mod) => {
			if (!mod.classList.contains('added-new-line')) {
				mod.innerHTML += '\n'
				mod.classList.add('added-new-line')
			}
		})
		let lines = popup.innerText.split('\n').map(x => x.trim()).filter(x => !!x)
		const name = lines[0]

		// Skip supports
		if (name.indexOf('Support') >= 0) {
			return
		}

		// Strip out Vaal Versions
		if (lines[1].indexOf('Vaal') >= 0) {
			console.log('----', name)
			console.log('Found Vaal in ', lines[1])
			lines[1] = lines[1].replace(', Vaal', '')

			const startIndex = lines.findIndex(x => x.substring(0, 4) === 'Vaal')
			console.log('startIndex', startIndex)
			console.log('startIndex')
			console.log('lines before', lines)
			lines.length = startIndex
			console.log('lines after', lines)
		}

		const text = lines.join('\n')
		gems[name] = text
	})

	const names = Object.keys(gems)
	console.log(JSON.stringify(gems, null, 2))
	console.log('Found ' + names.length + ' gem popups on the page')
	console.log('Shield crush?', names.includes('Shield Crush'))

	if (names.length < 100) {
		console.log('There should be at least 100. They dont load unless you scroll down the page.')
	}

})()

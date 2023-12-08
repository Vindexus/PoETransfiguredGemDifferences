const fs = require('fs')
const origJSON = fs.readFileSync('./data/originals.json')
const originals = JSON.parse(origJSON)

const versionToWrite = process.argv[2]

if (!['original', 'transfigured'].includes(versionToWrite)) {
	console.log('Gotta say which version to write to the files. "node index.js original" or "node index.js transfigured"')
	process.exit(1)
}

let transfigured = {}

for (let i = 1; i <= 5; i++) {
	const jsonStr = fs.readFileSync('./data/transfigured' + i + '.json')
	const json = JSON.parse(jsonStr)
	transfigured = {
		...transfigured,
		...json,
	}
}

const originalsByLength = Object.keys(originals).sort((a,b) => {
	return a.length > b.length ? -1 : 1
})
function findOriginal (name) {
	return originalsByLength.find(original => {
		return name.toLowerCase().indexOf(original.toLowerCase()) === 0
	})
}

/**
console.log('Find Shield Crush', findOriginal('Shield Crush of the Warchief'))
process.exit(0)
/**/

const failed = []

const transNames = Object.keys(transfigured)
transNames.forEach((name) => {
	const orig = findOriginal(name)
	if (!orig) {
		failed.push(`Could not find the original skill for ${name}`)
		return
	}
	const originalText = originals[orig]
	const filename = name.toLowerCase().split(/\W/g).join('_') + '.txt'
	console.log(`Write ${versionToWrite} to ${filename}`)
	const transText = transfigured[name]
	const contents = versionToWrite === 'original' ? originalText : transText
	fs.writeFileSync('./gems/' + filename, contents, 'utf-8')
})

if (failed.length) {
	console.log('XXXXERRORSXXXX')
	console.log(`${failed.length} failures from ${transNames.length} transfigured gems`)
	console.log(failed)
}

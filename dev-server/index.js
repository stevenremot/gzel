const express = require('express')
const Bundler = require('parcel-bundler')
const path = require('path')

const wasmFile = path.join(process.cwd(), process.argv[2])

const file = path.join(__dirname, 'static', 'index.html')
const bundler = new Bundler(file, {
	outFile: 'index.html',
	pubblicUrl: '/',
	watch: true,
})

const app = express();

app.use('/main.wasm', (req, res) => {
	res.sendFile(wasmFile)
})
app.use(bundler.middleware())

app.listen(3000, () => console.log('Listening on port 3000'))

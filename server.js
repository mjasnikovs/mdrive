const fs = require('fs'),
	program = require('commander'),
	net  = require('net'),
	mdrive = {host:'192.168.0.117', port: 503},
	asciiNewLine = String.fromCharCode(13)

const paranymphSync = function(l, c) {
    l.shift()((e, r) => {
        if (e) return c(e, r); l.push(r)
        if (typeof l[0] !== 'function') return c(null, l[l.length-1]); arguments.callee(l, c)
    },l[l.length-1])
}	

program
  .version('0.0.1')
  .option('-t, --test', 'Test connection')
  .option('-h, --home', 'Homing with hardlock')
  .option('-m, --move [distance]', 'Move to position [distance] cm')
  .parse(process.argv)

if (program.test) {
	const testClient = net.createConnection(mdrive, () => {
		console.log('\x1b[42m %s \x1b[0m connection to mdrive', mdrive.host)
		testClient.end()
	})

	testClient.setEncoding('ascii')

	testClient.on('end', () => {
		console.log('\x1b[41m %s \x1b[0m disconnected from mdrive', mdrive.host)
	})
}

if (program.home) {
	const homeClient = net.createConnection(mdrive, () => {
		console.log('\x1b[42m %s \x1b[0m connection to mdrive', mdrive.host)
		paranymphSync([
			(callback) => {
				homeClient.write('R4 = 0'+asciiNewLine)
				callback(null, null)
			},
			callback => setTimeout(() => callback(null, null), 500),
			(callback) => {
				homeClient.write('EX 1'+asciiNewLine)
				callback(null, null)
			}
		],
		(err, result) => {
			console.log('data <= Move END')
		})
	})

	homeClient.setEncoding('ascii')

	homeClient.on('end', () => {
		console.log('\x1b[41m %s \x1b[0m disconnected from mdrive', mdrive.host)
	})
	
	homeClient.on('data', (data) => {
		console.log('data => ', '"'+data.trim()+'"')
  	})
}

if (program.move) {
	const client = net.createConnection(mdrive, () => {
		console.log('\x1b[42m %s \x1b[0m connection to mdrive', mdrive.host)
		paranymphSync([
			(callback) => {
				client.write('R1 = 10000000'+asciiNewLine)
				callback(null, null)
			},
			callback => setTimeout(() => callback(null, null), 500),
			(callback) => {
				client.write('EX 1'+asciiNewLine)
				callback(null, null)
			}
		],
		(err, result) => {
			console.log('data <= Move END')
		})
	})

	client.setEncoding('ascii')

	client.on('end', () => {
		console.log('\x1b[41m %s \x1b[0m disconnected from mdrive', mdrive.host)
	})
	
	client.on('data', (data) => {
		console.log('data => ', '"'+data.trim()+'"')
  	})
}
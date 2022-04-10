<script>
	import { Blockchain } from "./blockchain"
	import { upid, peerid } from "./id-generator"

	let msg = ""
	let chats = new Blockchain()
	let name = ""

	class Webpeer{
		constructor(url){
			this.peer = new WebSocket(url)
		}
		on(handle, callback){
			this.peer.onmessage = res => {
				const json = JSON.parse(res.data)
				if(json.on == handle)
					callback(json.data)
			}
		}
		emit(handle, data){
			this.peer.send(JSON.stringify({
				on: handle, data: data
			}))
		}
	}

	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB

	if (!indexedDB) {
		console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
	}

	var request = indexedDB.open("chains", 3)
	var db, books

	request.onerror = event => {
		console.log("Database error: " + event.target.errorCode)
	};
	request.onsuccess = event => {
		db = event.target.result
		books = db.transaction("chats", "readwrite").objectStore("chats")
		if (!db.objectStoreNames.contains('chats')) {
			db.createObjectStore('chats')
		}
		books.getAll().onsuccess = event => event.target.result.forEach(e => {
			chats.addBlock(e)
			chats = chats
		})
	}
	request.onupgradeneeded = event => {
		db = event.target.result
	}



	var passpharse = localStorage.getItem("upid") || upid()
	var netaddress = peerid(passpharse)
	localStorage.setItem("upid", passpharse)
	console.log(passpharse, netaddress)

	const client = new Webpeer('ws://'+location.hostname+':3000');

	client.on("chat", res => {
		chats.addBlock(res)
		chats = chats
		console.log(res)
	})

	function sent(){
		client.emit("chat", { id: netaddress, data: msg })

		books = db.transaction("chats", "readwrite").objectStore("chats")
		let request = books.add({ id: netaddress, data: msg }, chats.chain.length.toString())
		request.onsuccess = () => console.log("Book added to the store", request.result)
		request.onerror = () => console.log("Error", request.error)
	}
</script>

<main>
	<h1>Hello {name}!</h1>
	<input bind:value={msg} />
	<button on:click={sent}></button>
	<ul>
		{ #each chats.chain as chat }
		<li>{chat.data.id}: {chat.data.data}</li>
		{ /each }
	</ul>
</main>

<style>
	main {
		text-align: left;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
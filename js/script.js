const SERVER_TOKEN = "BDK5LZ9T_Xfl6zmZxyfdJlaiHK-dUzY883tykHDXj1gmCcDrTfCS24eMr0YaqFVEgXQG3QzmK5HEEjqjaIvUBxo"

function urlBase64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/-/g, '+')
		.replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

// Register service worker
function registerServiceWorker() {
	return navigator.serviceWorker.register('service-worker.js')
		.then((registration) => {
			console.log('Registrasi service worker berhasil.');
			return registration;
		})
		.catch((err) => {
			console.error('Registrasi service worker gagal.', err);
		});
}

// Meminta ijin menggunakan Notification API
function requestPermission() {
	Notification.requestPermission().then(function (result) {
		if (result === 'denied') {
			console.log('Fitur notifikasi tidak diijinkan.');
			return;
		} else if (result === 'default') {
			console.error('Pengguna menutup kotak dialog permintaan ijin.');
			return;
		}

		console.log('Fitur notifikasi diijinkan.');
	});
	if (('PushManager' in window)) {
		navigator.serviceWorker.getRegistration().then((registration) => {
			registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(SERVER_TOKEN)
			}).then((subscribe) => {
				console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
				console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
					null, new Uint8Array(subscribe.getKey('p256dh')))));
				console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
					null, new Uint8Array(subscribe.getKey('auth')))));
			}).catch((e) => {
				console.error('Tidak dapat melakukan subscribe ', e.message);
			});
		});
	}
}

// Periksa service worker
window.addEventListener('load', () => {
	if (!('serviceWorker' in navigator)) {
		console.log("Service worker tidak didukung browser ini.");
	} else {
		registerServiceWorker();
	}

	if ("Notification" in window) {
		requestPermission();
	} else {
		console.error("Browser tidak mendukung notifikasi.");
	}

})

function loadNav() {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState === 4) {
			if (this.status !== 200) return;

			// Muat daftar tautan menu
			document.querySelectorAll(".topnav, .sidenav")
				.forEach((elm) => elm.innerHTML = xhttp.responseText);

			// Daftarkan event listener untuk setiap tautan menu
			document.querySelectorAll('.sidenav a, .topnav a')
				.forEach((elm) => {
					elm.addEventListener('click', (event) => {
						// Tutup sidenav
						let sidenav = document.querySelector('.sidenav');
						M.Sidenav.getInstance(sidenav).close();

						// Muat konten halaman yang dipanggil 
						page = event.target.getAttribute('href').substr(1);
					});
				});
		}
	};
	xhttp.open("GET", 'nav.html', true);
	xhttp.send();
}

document.addEventListener('DOMContentLoaded', () => {

	// SIDEBAR NAVIGATION
	let elems = document.querySelectorAll('.sidenav');
	M.Sidenav.init(elems);
	loadNav();
});

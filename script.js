let totalGIF = 44;
let device;
let tft;
let success = "#D1E7DD";
let failed = "#F8D7DA";
let uuidService = "dee13011-14d8-4e12-94af-a6edfeaa1af9";
let uuidChar = "dee13012-14d8-4e12-94af-a6edfeaa1af9";
function showAlert(color, text) {
    var alertDiv = document.querySelector('.alert');
    alertDiv.classList.remove('hidden');
    alertDiv.style.backgroundColor = color;
    alertDiv.querySelector('p').innerText = text;
    setTimeout(function () {
        alertDiv.classList.add('hidden');
    }, 3000);
}
function generateSwiperSlides(numSlides) {
    var swiperWrapper = document.querySelector('.swiper-wrapper');
    for (var i = 1; i <= numSlides; i++) {
        var div = document.createElement('div');
        div.classList.add('swiper-slide');
        div.dataset.value = i;
        var img = document.createElement('img');
        img.src = 'GIF/' + i + '.gif';
        div.appendChild(img);
        swiperWrapper.appendChild(div);
    }
}
async function changegif(newValue) {
    if (device && device.gatt && device.gatt.connected && tft) {
        try {
            await tft.writeValue(new TextEncoder().encode(newValue));
            console.log('Nilai telah diubah menjadi:', newValue);
            showAlert(success, 'Gif Sedang Di Update!');
        } catch (error) {
            showAlert(failed, 'Gif Gagal DI Update!');
            console.error('Gagal mengubah nilai:', error);
        }
    } else {
        showAlert(failed, 'Tidak Ada Device Terhubung, Harap Reload Halaman!');

    }
}
function showSwiper() {
    generateSwiperSlides(totalGIF);
    var swiper = new Swiper(".mySwiper", {
        effect: "cube",
        grabCursor: true,
        loop: true,
        cubeEffect: {
            shadow: true,
            slideShadows: true,
            shadowOffset: 30,
            shadowScale: 0.94,
        },
        on: {
            doubleTap: function () {
                var activeSlide = this.slides[this.activeIndex];
                var value = activeSlide.getAttribute('data-value');
                console.log('Nilai data-value:', value);
                console.log('Double tap terdeteksi!');
                changegif(value);
            }
        }
    });
}
async function connect() {
    var connect = document.querySelector('.connect');
    var swiper = document.querySelector('.swiper');
    try {
        device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [uuidService] }]
        });
        document.getElementById("deviceValue").value = device.name;
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(uuidService);
        tft = await service.getCharacteristic(uuidChar);
        console.log('Connected to ESP32');
        connect.classList.add('hidden');
        swiper.classList.remove('hidden');
        showSwiper();
        showAlert(success, 'Device Terhubung!');
    } catch (error) {
        console.error('Error connecting to ESP32:', error);
        showAlert(failed, 'Device Gagal Terhubung!');
    }
}

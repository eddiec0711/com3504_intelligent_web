let camera = null;
let canvas = null;
let localMediaStream = null;
let ctx;

function initUpload() {
    camera = document.querySelector('video');
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    navigator.getUserMedia({video: {facingMode: 'user'}}, function(stream) {
        camera.srcObject = stream;
        localMediaStream = stream;
    }, (err => console.log(err)));
}

function snapshot() {
    if (localMediaStream) {
        confirmImage(camera);
    }
}

function confirmImage(camera) {
    if (camera) {
        loadImage(camera, camera.videoWidth, camera.videoHeight);
    }
    else {
        let img = new Image();
        img.onload = function() {
            loadImage(img, img.width, img.height);
        }
        img.crossOrigin = 'anonymous';
        img.src = document.getElementById('image_url').value
    }
}

function loadImage(elem, elemW, elemH) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = 'block';

    let scale = Math.min(canvas.width / elemW, canvas.height / elemH);
    // get the top left position of the image
    let x = (canvas.width / 2) - (elemW / 2) * scale;
    let y = (canvas.height / 2) - (elemH / 2) * scale;
    ctx.drawImage(elem, x, y, elemW * scale, elemH * scale);
}

function uploadImage() {
    let title = document.getElementById('title').value
    let author = document.getElementById('author').value
    let description = document.getElementById('description').value

    let imageBlob = document.getElementById('canvas').toDataURL();
    savePic(imageBlob, title, author, description);
}

function savePic(imageBlob, title, author, description) {
    let data = {imageBlob: imageBlob, title: title, author: author, description: description};
    $.ajax({
        dataType: "json",
        url: '/upload_image',
        type: "POST",
        data: data,
        success: function (dataR) {
            alert('Image successfully saved')
        },
        error: function (err) {
            alert('Error: ' + err.status + ':' + err.statusText)
        }
    });
}

function goBack() {
    window.location="/"
}
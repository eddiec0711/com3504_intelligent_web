let camera;
let canvas;
let localMediaStream;
let ctx;
let shot = false;

/**
 * called by body onload in /upload
 * for loading camera and canvas
 */
function initUpload() {
    camera = document.querySelector('video');
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    navigator.getUserMedia({video: {facingMode: 'user'}}, function(stream) {
        camera.srcObject = stream;
        localMediaStream = stream;
    }, (err => console.log(err)));
}

/**
 * capture image using camera
 */
function snapshot() {
    if (localMediaStream) {
        confirmImage(camera);
    }
}

/**
 * load captured picture to canvas
 * @param camera
 */
function confirmImage(camera) {
    let elemW = camera.videoWidth
    let elemH = camera.videoHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let scale = Math.min(canvas.width / elemW, canvas.height / elemH);
    // get the top left position of the image
    let x = (canvas.width / 2) - (elemW / 2) * scale;
    let y = (canvas.height / 2) - (elemH / 2) * scale;
    ctx.drawImage(camera, x, y, elemW * scale, elemH * scale);
    shot = true;
}

/**
 * load parameters for uploading image
 */
function uploadImage() {
    let title = document.getElementById('title').value
    let author = document.getElementById('author').value
    let description = document.getElementById('description').value

    let imageBlob = document.getElementById('canvas').toDataURL();
    if (shot) { // if image taken
        saveImage(imageBlob, title, author, description);
    }
    else {
        alert("Picture missing");
    }
}

/**
 * ajax query to upload image to server
 * @param imageBlob
 * @param title
 * @param author
 * @param description
 */
function saveImage(imageBlob, title, author, description) {
    let data = {imageBlob: imageBlob, title: title, author: author, description: description};
    $.ajax({
        dataType: "json",
        url: '/upload_image',
        type: "POST",
        data: data,
        success: function (dataR) {
            alert('Image successfully saved as ' + dataR.filepath )
        },
        error: function (err) {
            alert('Error: ' + err.status + ':' + err.statusText)
        }
    });
}

/**
 * redirecting to homepage
 */
function goBack() {
    window.location="/"
}
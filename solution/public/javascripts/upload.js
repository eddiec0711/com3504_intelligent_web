let camera = null;
let canvas = null;
let localMediaStream = null;
let ctx;

function init() {
    // camera = document.querySelector('video');
    // canvas = document.querySelector('canvas');
    // ctx = canvas.getContext('2d');
    // navigator.getUserMedia({video: {facingMode: 'user'}}, function(stream) {
    //     camera.srcObject = stream;
    //     localMediaStream = stream;
    // }, (err => console.log(err)));
}

function snapshot() {
    if (localMediaStream) {
        canvas.style.display = 'block';
        ctx.drawImage(camera, 0, 0);
        camera.style.display = 'none';
    }
}

function confirmImage() {
    let imageUrl = document.getElementById('image_url').value
    document.getElementById('image').src = imageUrl;
}

function imgToBase64() {
    let img = document.getElementById('image')
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    // get the top left position of the image
    let x = (canvas.width / 2) - (img.width / 2) * scale;
    let y = (canvas.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    let dataURL = canvas.toDataURL();

    return dataURL
}

async function uploadImage() {
    let title = document.getElementById('title').value
    let author = document.getElementById('author').value
    let description = document.getElementById('description').value

    let imageBlob = await imgToBase64()
    // let imageBlob = await confirmImage();
    await savePic(imageBlob, title, author, description);
}

function savePic(imageBlob, title, author, description) {
    let data = {imageBlob: imageBlob, title: title, author: author, description: description};
    $.ajax({
        dataType: "json",
        url: '/upload_image',
        type: "POST",
        data: data,
        success: function (dataR) {
            console.log('Image save as ' + dataR.file);
        },
        error: function (err) {
            console.log('Error: ' + err.status + ':' + err.statusText);
        }
    });
}

function goBack() {
    window.location="/"
}
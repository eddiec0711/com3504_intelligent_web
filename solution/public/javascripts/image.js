let camera = null;
let canvas = null;
let localMediaStream = null;
let ctx;

function init() {
    camera = document.querySelector('video');
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    camera.addEventListener('click', snapshot, false);
    navigator.getUserMedia({video: {facingMode: 'user'}}, function(stream) {
        camera.srcObject = stream;
        localMediaStream = stream;
    }, errorCallback);
}

function errorCallback() {console.log('error');}

function snapshot() {
    if (localMediaStream) {
        canvas.style.display = 'block';
        ctx.drawImage(camera, 0, 0);
        // document.getElementById('photo').src = canvas.toDataURL('image/png');
        camera.style.display = 'none';
        document.getElementById('button-container').style.display = 'block';
    }
}

function savePic() {
    var imageBlob = canvas.toDataURL();
    var data = {imageBlob: imageBlob};
    $.ajax({
        dataType: "json",
        url: '/upload_image',
        type: "POST",
        data: data,
        success: function (dataR) {
            console.log('image uploaded');
            // alert('Filepath' + ': ' + data.path)
            document.getElementById('link').innerHTML = 'Filepath: ' + dataR.path;
        },
        error: function (err) {
            alert('Error: ' + err.status + ':' + err.statusText);
        }
    });
}

function takePic() {
    document.getElementById('button-container').style.display = 'none';
    document.getElementById('link').innerHTML = '';
    camera.style.display = 'block';
    canvas.style.display = 'none';
}

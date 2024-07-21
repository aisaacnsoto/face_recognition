const elVideo = document.getElementById('video');

navigator.getMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

const cargarCamara = () => {
    navigator.getMedia(
        {
            video: true,
            audio: false,
        },
    
        stream => elVideo.srcObject = stream,
    
        // errorCallback *Opcional
        function (err) {
            console.log("Ocurrió el siguiente error: " + err);
        }
    );
}
    
Promise.all([
    faceapi.nets.ageGenderNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
]).then(cargarCamara);

elVideo.addEventListener('play', async () => {
    const canvas = faceapi.createCanvasFromMedia(elVideo);
    document.body.append(canvas);

    const displaySize = { width: elVideo.width, height: elVideo.height }
    // resize the overlay canvas to the input dimensions
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
        

        /* Display detected face bounding boxes */
        const detections = await faceapi.detectAllFaces(elVideo)
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender()
            .withFaceDescriptors();
        // resize the detected boxes in case your displayed image has a different size than the original
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        //limpiar el canvas
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

        // draw detections into the canvas
        faceapi.draw.drawDetections(canvas, resizedDetections)

        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    })
})
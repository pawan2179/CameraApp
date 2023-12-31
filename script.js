let recordFlag = false;
let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn")
let constraints =
{   video: true,
    audio: true
}

let recorder;
let chunks = [] //data chunks from stream
let timerId;
let counter = 0;
let timer = document.querySelector(".timer");

navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);

    recorder.addEventListener("start", (event) => {
        chunks = [];
        startTimer();
    });

    recorder.addEventListener("dataavailable", (event) => {
        chunks.push(event.data);
    });

    recorder.addEventListener("stop", (event) => {
        //convert chunk of data to video
        let blob = new Blob(chunks, { type: "video/mp4"});
        let videoUrl = URL.createObjectURL(blob);

        // let a = document.createElement("a");
        // a.href = videoUrl;
        // a.download = "stream.mp4";
        // a.click();

        // stopTimer();

        if(db) {
            let dbTransaction = db.transaction("video", "readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id: shortid(),
                blobData: blob
            }
            videoStore.add(videoEntry);
        }

        stopTimer();
    });
})

recordBtnCont.addEventListener("click", (e) => {
    if(!recorder)    return ;
    
    recordFlag = !recordFlag
    if(recordFlag) {
        //Start recording
        recorder.start();
        recordBtn.classList.add("scale-record");
    }
    else {
        recorder.stop();
        recordBtn.classList.remove("scale-record");
    }
})

let body = document.querySelector("body");

captureBtnCont.addEventListener("click", (event) => {
    let canvas = document.createElement("canvas");
    canvas.height = body.height;
    canvas.width = body.width;

    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    let imageUrl = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = imageUrl;
    a.download = "image.jpg"
    a.click();
})

function startTimer() {
    function displayTimer() {
        timer.style.display = "block";

        let totalSecs = counter;
        let hours = Number.parseInt(totalSecs/3600);
        totalSecs = totalSecs%3600;
        let minutes = Number.parseInt(totalSecs/60);
        totalSecs = totalSecs%60;

        hours = (hours < 10) ? `0${hours}`:hours;
        minutes = (minutes < 10) ? `0${minutes}`:minutes;
        totalSecs = (totalSecs < 10) ? `0${totalSecs}`:totalSecs;

        timer.innerText = `${hours}:${minutes}:${totalSecs}`;
        counter++;
    }

    timerId = setInterval(displayTimer, 1000);
}

function stopTimer() {
    clearInterval(timerId);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
}
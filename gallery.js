setTimeout(() => {
    console.log("timeout over");
    if (db) {
        let dbTransaction = db.transaction("video", "readonly");
        let videoStore = dbTransaction.objectStore("video");
        //Event driven
        let videoRequest = videoStore.getAll();
        let galleryCount = document.querySelector(".gallery-cont");
    
        videoRequest.onsuccess = (event) => {
            let videoResult = videoRequest.result;
            console.log("Video success");
            videoResult.forEach((videoObj) => {
                console.log("videoid", videoObj.id);
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                mediaElem.innerHTML = `
                <div class="media">
                    <video autoplay loop src="${url}"></video>
                </div>
                <div class="delete action-btn">Delete</div>
                <div class="download action-btn">Download</div>
                </div>
                `
                galleryCount.appendChild(mediaElem);

                let deleteBtn = mediaElem.querySelector(".delete");
                let downloadBtn = mediaElem.querySelector(".download");
                deleteBtn.addEventListener("click", deleteListener);

                downloadBtn.addEventListener("click", downloadListener);
            });
        }
    }
}, 100);


function deleteListener(event) {
    let elemId = event.target.parentElement.getAttribute("id");
    let dbTransaction = db.transaction("video", "readwrite");
    let videoStore = dbTransaction.objectStore("video");
    videoStore.delete(elemId);

    //removing from UI
    event.target.parentElement.remove();
}

function downloadListener(event) {
    let dbTransaction = db.transaction("video", "readwrite");
    let videStore = dbTransaction.objectStore("video");
    let id = event.target.parentElement.getAttribute("id");
    let videoRequest = videStore.get(id);

    videoRequest.onsuccess = (event) => {
        let videoResult = videoRequest.result;
        let url = URL.createObjectURL(videoResult.blobData);

        let link = document.createElement("a");
        link.href = url;
        link.download = "stream.mp4";
        link.click();

    }
}
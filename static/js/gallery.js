document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("gallery-image-modal");
    const modalImage = document.getElementById("gallery-modal-image");
    const modalCaption = document.querySelector(".gallery-modal-caption");
    const closeBtn = document.querySelector(".gallery-close");
    const prevBtn = document.querySelector(".gallery-prev");
    const nextBtn = document.querySelector(".gallery-next");

    let currentIndex = 0;
    const photos = Array.from(document.querySelectorAll(".gallery-photo-card"));

    // 打开模态框
    photos.forEach((photo, index) => {
        photo.addEventListener("click", () => {
            currentIndex = index;
            updateModal();
            modal.style.display = "flex";
        });
    });

    // 关闭模态框
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // 切换上一张
    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + photos.length) % photos.length;
        updateModal();
    });

    // 切换下一张
    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % photos.length;
        updateModal();
    });

    // 更新模态框内容
    function updateModal() {
        const photo = photos[currentIndex];
        const imageSrc = photo.querySelector(".gallery-image").src;
        const caption = photo.querySelector(".gallery-photo-caption").textContent;

        modalImage.src = imageSrc;
        modalCaption.textContent = caption;
    }
});
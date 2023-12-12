let currentImageIndex = 0;
let currentTabId;
let newImgWindow;

function removeImageClasses() {
  const currentImg = document.querySelector(".current-gallery-img");
  if (currentImg) {
    currentImg.classList.remove("right-image", "left-image");
  }
}

function createButtons() {
  if (!document.querySelector(".gallery-btn--prev")) {
    const prevBtn = document.createElement("button");
    prevBtn.setAttribute("class", "gallery-btn gallery-btn--prev");
    prevBtn.addEventListener("click", () => {
      changeImg("prev");
    });
    const prevImgIcon = document.createElement("i");
    prevImgIcon.setAttribute("class", "fa-solid fa-chevron-left");
    prevBtn.append(prevImgIcon);
    newImgWindow.append(prevBtn);
  }

  if (!document.querySelector(".gallery-btn--next")) {
    const nextBtn = document.createElement("button");
    nextBtn.setAttribute("class", "gallery-btn gallery-btn--next ");
    nextBtn.addEventListener("click", (e) => {
      changeImg("next");
    });
    const nextImgIcon = document.createElement("i");
    nextImgIcon.setAttribute("class", "fa-solid fa-chevron-right");
    nextBtn.append(nextImgIcon);
    newImgWindow.append(nextBtn);
  }
}

function createImageOverlay(element) {
  const existingOverlay = document.querySelector(".overlay-image");
  if (existingOverlay) {
    existingOverlay.innerHTML = "";
    existingOverlay.append(element);
    existingOverlay.setAttribute("data-visible", "true");
    newImgWindow = existingOverlay; // Update newImgWindow reference
  } else {
    newImgWindow = document.createElement("div");
    newImgWindow.setAttribute("class", "overlay-image");
    newImgWindow.setAttribute("data-visible", "true");
    document.body.append(newImgWindow);
    newImgWindow.append(element);
  }

  createButtons();

  newImgWindow.addEventListener("click", (e) => {
    if (e.target.matches(".overlay-image")) {
      newImgWindow.setAttribute("data-visible", "false");
      const firstChild = newImgWindow.firstElementChild;
      if (firstChild) {
        firstChild.remove();
      }
    }
  });
}

const galleryTabBtns = document.querySelectorAll(".tab-gallery__btn");

galleryTabBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    currentTabId = e.currentTarget.id;
    const filteredImgs = tabImages.filter((obj) => obj.id === currentTabId);
    const imgs = filteredImgs[0].images.map((img) => {
      const imgElement = document.createElement("img");
      imgElement.classList.add("tab-gallery__img");
      imgElement.setAttribute("loading", "lazy");
      imgElement.setAttribute("src", `/images/img (${img}).jpeg`);
      imgElement.setAttribute("alt", "image");

      const imgWrapper = document.createElement("figure");
      imgWrapper.classList.add("tab-gallery__img-wrapper");
      imgWrapper.appendChild(imgElement);

      return imgWrapper;
    });

    const galleryWrapper = document.querySelector(".tab-gallery__wrapper");
    galleryWrapper.innerHTML = "";

    imgs.forEach((img) => {
      img.addEventListener("click", (e) => {
        const splitPart = img.firstElementChild.src.split("/images/img%20(");
        const otherPart = splitPart[1].replace(").jpeg", "");
        displayImage(otherPart);
      });
      galleryWrapper.appendChild(img);
    });
  });
});

function displayImage(image) {
  removeImageClasses(); // Add this line

  currentImageIndex = tabImages
    .find((album) => album.id === currentTabId)
    .images.indexOf(image);

  const imgElement = document.createElement("img");
  imgElement.classList.add("current-gallery-img");
  imgElement.setAttribute("src", `images/img (${image}).jpeg`);
  createImageOverlay(imgElement);
}

function changeImg(changeDir) {
  const currentAlbum = tabImages.find((album) => album.id === currentTabId);
  const totalImages = currentAlbum.images.length;

  if (changeDir === "prev") {
    currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
  } else if (changeDir === "next") {
    currentImageIndex = (currentImageIndex + 1) % totalImages;
  }

  removeImageClasses();

  const newImage = currentAlbum.images[currentImageIndex];
  displayImage(newImage);

  const currentImg = document.querySelector(".current-gallery-img");
  if (changeDir === "prev") {
    currentImg.classList.add("left-image");
  } else if (changeDir === "next") {
    currentImg.classList.add("right-image");
  }
}

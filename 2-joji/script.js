let yOff;
let lastScrollTop = 0;

const ZOOM_THRESHOLD = 300;
const mainCircle = document.getElementById('main-circle');
const scrollIndicator = document.getElementById('scroll-indicator');

let zoomOutCalled = false;
let zoomInCalled = false;

const maxZoom = 'scale(3)';
const minZoom = 'scale(1)';
const maxMargin = '800px';
const minMargin = '100px';

const zoomOptions = {
  duration: 1000,
  fill: 'forwards',
  easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
};

const hideIndicator = () => {
  scrollIndicator.style.opacity = 0
};

const showIndicator = () => {
  scrollIndicator.style.opacity = 1
};

const zoomOut = () => {
  hideIndicator();

  keyframes = [
    { transform: maxZoom, marginTop: maxMargin },
    { transform: minZoom, marginTop: minMargin }
  ]

  mainCircle.animate(keyframes, zoomOptions);
}

const zoomIn = () => {
  keyframes = [
    { transform: minZoom, marginTop: minMargin  },
    { transform: maxZoom, marginTop: maxMargin  }
  ]

  const zoomAni = mainCircle.animate(keyframes, zoomOptions);

  zoomAni.finished.then(() => showIndicator());
}

const onWindowScroll = async () => {
  yOff = window.pageYOffset || document.documentElement.scrollTop;
  try {
    await document.getElementById('onam_pattu')?.play()
  } catch (err) {}
  canZoom = (yOff > 0 && yOff < ZOOM_THRESHOLD);

  if (canZoom) {
    if (yOff > lastScrollTop) {
      // downscroll code
      if (zoomInCalled) {
        zoomInCalled = false;
      }

      if (!zoomOutCalled) {
        zoomOutCalled = true;
        zoomOut();
      }
    } else {
      // upscroll code
      if (zoomOutCalled) {
        zoomOutCalled = false;
      }

      if (!zoomInCalled) {
        zoomInCalled = true;
        zoomIn();
      }
    }

    lastScrollTop = yOff <= 0 ? 0 : yOff;
  }
}

document.addEventListener('scroll', onWindowScroll);
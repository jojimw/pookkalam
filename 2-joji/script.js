let yOff;
let lastScrollTop = 0;

const ZOOM_THRESHOLD = 300;
const mainCircle = document.getElementById('main-circle');
const scrollIndicator = document.getElementById('scroll-indicator');
const happyOnam = document.getElementById('happy_onam');

let zoomOutCalled = false;
let zoomInCalled = false;
let wasSongPlayed = false;

const maxZoom = 'scale(3)';
const minZoom = 'scale(1)';
const maxMargin = '800px';
const minMargin = '100px';

const colors = ['#A5C500', '#709D01', '#FDA404', '#F77D0B', '#FACC09', '#9bb94d', '#8A3016', '#CF411F', '#F4411F', '#FF8350'];

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

const showHappyOnam = () => {
  happyOnam.style.display = 'block';
};

const zoomOut = () => {
  hideIndicator();

  keyframes = [
    { transform: maxZoom, marginTop: maxMargin },
    { transform: minZoom, marginTop: minMargin }
  ]

  const zoomAni = mainCircle.animate(keyframes, zoomOptions);

  zoomAni.finished.then(() => {
    hideIndicator();
    showHappyOnam();
  });
}

const onScrollIndicatorClick = () => {
  zoomOut();

  try {
    if (!wasSongPlayed) {
      document.getElementById('onam_pattu')?.play();
    }
  } catch (err) {}
}

const zoomIn = () => {
  keyframes = [
    { transform: minZoom, marginTop: minMargin  },
    { transform: maxZoom, marginTop: maxMargin  }
  ]

  const zoomAni = mainCircle.animate(keyframes, zoomOptions);

  zoomAni.finished.then(() => showIndicator());
}

const addPaintBackDropElements = () => {
  const node = document.createElement('div');
  node.style.position = 'absolute';
  const nodeRandom = Math.random();
  const randomInt = Math.floor(nodeRandom * 10);
  const nodeColor = colors[randomInt];
  const nodeWidth = `9px`;
  const nodeHeight = `2px`;
  const nodeBorderRad = `1px`;
  node.style.top = `${nodeRandom * 2000}px`;
  node.style.left = `${Math.random() * 2000}px`;
  node.style.width = nodeWidth;
  node.style.height = nodeHeight;
  node.style.borderRadius = nodeBorderRad;
  node.style.backgroundColor = nodeColor;
  node.style.transform = 'rotate(90deg)';
  const nodeBefore = document.createElement('div');
  nodeBefore.style.position = 'absolute';
  nodeBefore.style.width = nodeWidth;
  nodeBefore.style.height = nodeHeight;
  nodeBefore.style.borderRadius = nodeBorderRad;
  nodeBefore.style.backgroundColor = nodeColor;
  nodeBefore.style.transform = 'rotate(-55deg)';
  const nodeAfter = document.createElement('div');
  nodeAfter.style.position = 'absolute';
  nodeAfter.style.width = nodeWidth;
  nodeAfter.style.height = nodeHeight;
  nodeAfter.style.borderRadius = nodeBorderRad;
  nodeAfter.style.backgroundColor = nodeColor;
  nodeAfter.style.transform = 'rotate(55deg)';
  node.appendChild(nodeBefore);
  node.appendChild(nodeAfter);
  node.style.zIndex = -1;
  const parentNode = document.getElementById('page-wrapper');
  if (parentNode) parentNode.appendChild(node);
}

const getColorSpots = () => {
  let i = 0;
  while (i < 500) {
    addPaintBackDropElements();
    i += 1;
  }
};

const onWindowScroll = async () => {
  yOff = window.pageYOffset || document.documentElement.scrollTop;
  try {
    if (!wasSongPlayed) {
      await document.getElementById('onam_pattu')?.play();
    }
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
window.onload = getColorSpots;
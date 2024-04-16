import Color from 'pigment';

// https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color

export function pickTextColorBasedOnBgColor(bgColor) {
  var color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  var uicolors = [r / 255, g / 255, b / 255];
  var c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return L > 0.179 ? '#000000' : '#FFFFFF';
}

export function generateRandomColorPalette(numColors) {
  const palette = new Set();

  while (palette.size < numColors) {
    const color = generateRandomColor(numColors);
    palette.add(color);
  }

  // Sort the colors based on the golden ratio
  const sortedPalette = Array.from(palette).sort((a, b) => {
    const hueA = getHueFromColor(a);
    const hueB = getHueFromColor(b);

    const goldenRatio = 0.618033988749895;
    const angleA = (hueA * goldenRatio) % 360;
    const angleB = (hueB * goldenRatio) % 360;

    return angleA - angleB;
  });

  return sortedPalette;
}

function hslDistance(color1, color2) {
  const hsl1 = color1.tohsl().match(/\d+/g).map(Number);
  const hsl2 = color2.tohsl().match(/\d+/g).map(Number);

  const hDiff = Math.min(Math.abs(hsl1[0] - hsl2[0]), 360 - Math.abs(hsl1[0] - hsl2[0])) / 180;
  const sDiff = Math.abs(hsl1[1] - hsl2[1]) / 100;
  const lDiff = Math.abs(hsl1[2] - hsl2[2]) / 100;

  return Math.sqrt(hDiff * hDiff + sDiff * sDiff + lDiff * lDiff);
}

export function generateRandomColorPaletteWithLockedColors(userColors) {
  const numColors = userColors.length;
  const numPalettes = 20;

  let closestPalette = null;
  let minDistance = Infinity;

  for (let i = 0; i < numPalettes; i++) {
    const randomPalette = generateRandomColorPalette(numColors);
    let distance = 0;
    for (let j = 0; j < numColors; j++) {
      const userColor = new Color(userColors[j].color);
      const randomColor = new Color(randomPalette[j]);
      if (userColors[j].locked) {
        distance += hslDistance(userColor, randomColor);
      }
    }

    if (distance < minDistance) {
      minDistance = distance;
      closestPalette = randomPalette;
    }
  }
  const colorSet = new Set();
  const recommendedColors = userColors.map((color, index) => {
    if (color.locked) {
      colorSet.add(color.color);
      return color;
    } else {
      let newColor = generateRandomColor(numColors, closestPalette[index]);
      while (colorSet.has(newColor)) {
        newColor = Color.random().tohex();
      }
      colorSet.add(newColor);
      return { ...color, color: newColor, locked: false };
    }
  });

  return recommendedColors;
}

function generateRandomColor(numColors, referenceColor = null) {
  const randomNum = Math.random();

  if (randomNum < 0.3 / numColors) {
    return Math.random() < 0.5 ? '#000000' : '#FFFFFF';
  } else if (randomNum < 0.5 / numColors) {
    const grayValue = Math.floor(Math.random() * 256);
    return new Color(`rgb(${grayValue}, ${grayValue}, ${grayValue})`).tohex();
  } else {
    return referenceColor || generateRandomHSLColor();
  }
}

function generateRandomHSLColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 50) + 50; // Between 50% and 100%
  const lightness = Math.floor(Math.random() * 30) + 70; // Between 60% and 80%
  const hex = new Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`).tohex();
  if (!hex) {
    throw new Error('Invalid color');
  }
  return hex;
}

function getHueFromColor(color) {
  return new Color(color).tohsl().match(/\d+/g).map(Number)[0];
}

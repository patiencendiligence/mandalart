const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(width, height, drawCallback) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8);
  ihdrData.writeUInt8(6, 9);
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  
  const ihdrCrc = crc32(Buffer.concat([Buffer.from('IHDR'), ihdrData]));
  const ihdrChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 13]),
    Buffer.from('IHDR'),
    ihdrData,
    ihdrCrc
  ]);
  
  const pixels = new Uint8Array(width * height * 4);
  drawCallback(pixels, width, height);
  
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      rawData.push(pixels[idx], pixels[idx + 1], pixels[idx + 2], pixels[idx + 3]);
    }
  }
  
  const compressed = zlib.deflateSync(Buffer.from(rawData));
  const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  const idatLength = Buffer.alloc(4);
  idatLength.writeUInt32BE(compressed.length, 0);
  const idatChunk = Buffer.concat([idatLength, Buffer.from('IDAT'), compressed, idatCrc]);
  
  const iendCrc = crc32(Buffer.from('IEND'));
  const iendChunk = Buffer.concat([Buffer.from([0, 0, 0, 0]), Buffer.from('IEND'), iendCrc]);
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(data) {
  let crc = 0xFFFFFFFF;
  const table = [];
  
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  
  const result = Buffer.alloc(4);
  result.writeUInt32BE((crc ^ 0xFFFFFFFF) >>> 0, 0);
  return result;
}

function setPixel(pixels, width, x, y, r, g, b, a = 255) {
  const idx = (y * width + x) * 4;
  pixels[idx] = r;
  pixels[idx + 1] = g;
  pixels[idx + 2] = b;
  pixels[idx + 3] = a;
}

function fillRect(pixels, width, height, x1, y1, w, h, r, g, b, a = 255) {
  for (let y = y1; y < Math.min(y1 + h, height); y++) {
    for (let x = x1; x < Math.min(x1 + w, width); x++) {
      setPixel(pixels, width, x, y, r, g, b, a);
    }
  }
}

function fillRoundRect(pixels, width, height, x1, y1, w, h, radius, r, g, b, a = 255) {
  for (let y = y1; y < Math.min(y1 + h, height); y++) {
    for (let x = x1; x < Math.min(x1 + w, width); x++) {
      const relX = x - x1;
      const relY = y - y1;
      
      let inside = true;
      
      if (relX < radius && relY < radius) {
        const dx = radius - relX;
        const dy = radius - relY;
        inside = dx * dx + dy * dy <= radius * radius;
      } else if (relX >= w - radius && relY < radius) {
        const dx = relX - (w - radius - 1);
        const dy = radius - relY;
        inside = dx * dx + dy * dy <= radius * radius;
      } else if (relX < radius && relY >= h - radius) {
        const dx = radius - relX;
        const dy = relY - (h - radius - 1);
        inside = dx * dx + dy * dy <= radius * radius;
      } else if (relX >= w - radius && relY >= h - radius) {
        const dx = relX - (w - radius - 1);
        const dy = relY - (h - radius - 1);
        inside = dx * dx + dy * dy <= radius * radius;
      }
      
      if (inside) {
        setPixel(pixels, width, x, y, r, g, b, a);
      }
    }
  }
}

// 위젯 미리보기 - 기본 (3x2)
function drawWidgetPreview(pixels, width, height) {
  // 배경
  fillRoundRect(pixels, width, height, 0, 0, width, height, 24, 232, 232, 233);
  
  // 헤더 영역
  fillRect(pixels, width, height, 24, 20, 80, 20, 90, 106, 122);
  
  // 메인 목표 영역 (중앙)
  fillRoundRect(pixels, width, height, 24, 50, width - 48, 40, 8, 255, 255, 255, 128);
  
  // 진행률 바 배경
  fillRoundRect(pixels, width, height, 24, height - 30, width - 48, 8, 4, 90, 154, 200, 51);
  
  // 진행률 바 (45%)
  const progressWidth = Math.floor((width - 48) * 0.45);
  fillRoundRect(pixels, width, height, 24, height - 30, progressWidth, 8, 4, 90, 154, 200);
}

// 위젯 미리보기 - 소형 (2x2)
function drawSmallWidgetPreview(pixels, width, height) {
  // 배경
  fillRoundRect(pixels, width, height, 0, 0, width, height, 20, 232, 232, 233);
  
  // 타이틀
  fillRect(pixels, width, height, width / 2 - 30, 15, 60, 12, 138, 154, 170);
  
  // 목표 텍스트 영역
  fillRoundRect(pixels, width, height, 15, 35, width - 30, 30, 6, 255, 255, 255, 128);
  
  // 진행률 텍스트
  fillRect(pixels, width, height, width / 2 - 20, height - 35, 40, 20, 90, 154, 200);
}

// 생성
const assetsDir = path.join(__dirname, '..', 'assets');

console.log('위젯 미리보기 이미지 생성 중...');

// 기본 위젯 미리보기 (Android: 250x110 dp, iOS는 비슷한 비율)
const widgetPreview = createPNG(500, 220, drawWidgetPreview);
fs.writeFileSync(path.join(assetsDir, 'widget-preview.png'), widgetPreview);
console.log('생성됨: widget-preview.png (500x220)');

// 소형 위젯 미리보기 (110x110 dp)
const smallWidgetPreview = createPNG(220, 220, drawSmallWidgetPreview);
fs.writeFileSync(path.join(assetsDir, 'widget-preview-small.png'), smallWidgetPreview);
console.log('생성됨: widget-preview-small.png (220x220)');

console.log('위젯 미리보기 생성 완료!');

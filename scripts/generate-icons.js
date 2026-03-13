const fs = require('fs');
const path = require('path');

// 간단한 1x1 투명 PNG (최소 유효 PNG)
// 실제 앱 아이콘은 디자이너가 만들어야 하지만, 빌드를 위한 placeholder
const createSimplePNG = (size) => {
  // PNG 시그니처
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR 청크 (이미지 헤더)
  const width = size;
  const height = size;
  const bitDepth = 8;
  const colorType = 6; // RGBA
  const compression = 0;
  const filter = 0;
  const interlace = 0;
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(bitDepth, 8);
  ihdrData.writeUInt8(colorType, 9);
  ihdrData.writeUInt8(compression, 10);
  ihdrData.writeUInt8(filter, 11);
  ihdrData.writeUInt8(interlace, 12);
  
  const ihdrCrc = crc32(Buffer.concat([Buffer.from('IHDR'), ihdrData]));
  const ihdrChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 13]), // length
    Buffer.from('IHDR'),
    ihdrData,
    ihdrCrc
  ]);
  
  // IDAT 청크 (이미지 데이터) - 단색 배경
  const zlib = require('zlib');
  
  // 만다라트 테마 색상 (연한 회색 배경에 그리드 패턴)
  const rawData = [];
  const bgColor = [232, 232, 233, 255]; // #e8e8e9
  const gridColor = [180, 180, 185, 255]; // 그리드 선
  const accentColor = [90, 154, 200, 255]; // 강조색
  
  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < width; x++) {
      // 9x9 그리드 패턴 생성
      const cellSize = Math.floor(size / 9);
      const isGridLine = (x % cellSize < 1) || (y % cellSize < 1);
      const is3x3Border = (x % (cellSize * 3) < 2) || (y % (cellSize * 3) < 2);
      const isCenter = x >= cellSize * 4 && x < cellSize * 5 && y >= cellSize * 4 && y < cellSize * 5;
      
      let color;
      if (isCenter) {
        color = accentColor;
      } else if (is3x3Border) {
        color = gridColor;
      } else if (isGridLine) {
        color = [200, 200, 205, 255];
      } else {
        color = bgColor;
      }
      
      rawData.push(...color);
    }
  }
  
  const compressed = zlib.deflateSync(Buffer.from(rawData));
  const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  const idatLength = Buffer.alloc(4);
  idatLength.writeUInt32BE(compressed.length, 0);
  const idatChunk = Buffer.concat([
    idatLength,
    Buffer.from('IDAT'),
    compressed,
    idatCrc
  ]);
  
  // IEND 청크
  const iendCrc = crc32(Buffer.from('IEND'));
  const iendChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 0]),
    Buffer.from('IEND'),
    iendCrc
  ]);
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
};

// CRC32 계산
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

// 아이콘 생성
const assetsDir = path.join(__dirname, '..', 'assets');
const chromeIconsDir = path.join(__dirname, '..', 'chrome-extension', 'icons');

// 필요한 디렉토리 생성
if (!fs.existsSync(chromeIconsDir)) {
  fs.mkdirSync(chromeIconsDir, { recursive: true });
}

// 다양한 크기의 아이콘 생성
const sizes = {
  'icon.png': 1024,
  'adaptive-icon.png': 1024,
  'favicon.png': 48,
  'splash.png': 1284,
};

const chromeSizes = {
  'icon16.png': 16,
  'icon48.png': 48,
  'icon128.png': 128,
};

console.log('아이콘 생성 중...');

for (const [filename, size] of Object.entries(sizes)) {
  const iconPath = path.join(assetsDir, filename);
  const png = createSimplePNG(size);
  fs.writeFileSync(iconPath, png);
  console.log(`생성됨: ${filename} (${size}x${size})`);
}

for (const [filename, size] of Object.entries(chromeSizes)) {
  const iconPath = path.join(chromeIconsDir, filename);
  const png = createSimplePNG(size);
  fs.writeFileSync(iconPath, png);
  console.log(`생성됨: chrome-extension/icons/${filename} (${size}x${size})`);
}

console.log('아이콘 생성 완료!');

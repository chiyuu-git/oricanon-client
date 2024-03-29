/**
 * covert canvas to image
 * and save the image file
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// check if support sth.
const $support = (function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    return {
        canvas: !!ctx,
        imageData: !!ctx.getImageData,
        dataURL: !!canvas.toDataURL,
        btoa: !!window.btoa,
    };
}());

const downloadMime = 'image/octet-stream';

function scaleCanvas(canvas, width, height) {
    const w = canvas.width;
    const h = canvas.height;
    if (width == undefined) {
        width = w;
    }
    if (height == undefined) {
        height = h;
    }

    const retCanvas = document.createElement('canvas');
    const retCtx = retCanvas.getContext('2d');
    retCanvas.width = width;
    retCanvas.height = height;
    retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
    return retCanvas;
}

function getDataURL(canvas, type, width, height) {
    canvas = scaleCanvas(canvas, width, height);
    return canvas.toDataURL(type);
}

function saveFile(strData, fileName) {
    // document.location.href = strData;

    const downloadElement = document.createElement('a');
    downloadElement.href = strData;
    // 下载后文件名
    downloadElement.download = `${fileName}.png`;
    document.body.append(downloadElement);
    // 触发点击下载
    downloadElement.click();
    // 下载完成移除元素
    downloadElement.remove();
}

function genImage(strData) {
    const img = document.createElement('img');
    img.src = strData;
    return img;
}
function fixType(type) {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
    const r = type.match(/png|jpeg|bmp|gif/)[0];
    return `image/${r}`;
}
function encodeData(data) {
    if (!window.btoa) {
        throw 'btoa undefined';
    }
    let str = '';
    if (typeof data === 'string') {
        str = data;
    }
    else {
        for (const datum of data) {
            str += String.fromCharCode(datum);
        }
    }

    return btoa(str);
}
function getImageData(canvas) {
    const w = canvas.width;
    const h = canvas.height;
    return canvas.getContext('2d').getImageData(0, 0, w, h);
}
function makeURI(strData, type) {
    return `data:${type};base64,${strData}`;
}

/**
 * create bitmap image
 * 按照规则生成图片响应头和响应体
 */
const genBitmapImage = function (oData) {
    //
    // BITMAPFILEHEADER: http://msdn.microsoft.com/en-us/library/windows/desktop/dd183374(v=vs.85).aspx
    // BITMAPINFOHEADER: http://msdn.microsoft.com/en-us/library/dd183376.aspx
    //

    const biWidth = oData.width;
    const biHeight	= oData.height;
    const biSizeImage = biWidth * biHeight * 3;
    const bfSize = biSizeImage + 54; // total header size = 54 bytes

    //
    //  typedef struct tagBITMAPFILEHEADER {
    //  	WORD bfType;
    //  	DWORD bfSize;
    //  	WORD bfReserved1;
    //  	WORD bfReserved2;
    //  	DWORD bfOffBits;
    //  } BITMAPFILEHEADER;
    //
    const BITMAPFILEHEADER = [
        // WORD bfType -- The file type signature; must be "BM"
        0x42,
        0x4D,
        // DWORD bfSize -- The size, in bytes, of the bitmap file
        bfSize & 0xFF,
        bfSize >> 8 & 0xFF,
        bfSize >> 16 & 0xFF,
        bfSize >> 24 & 0xFF,
        // WORD bfReserved1 -- Reserved; must be zero
        0,
        0,
        // WORD bfReserved2 -- Reserved; must be zero
        0,
        0,
        // DWORD bfOffBits -- The offset, in bytes, from the beginning of the BITMAPFILEHEADER structure to the bitmap bits.
        54,
        0,
        0,
        0,
    ];

    //
    //  typedef struct tagBITMAPINFOHEADER {
    //  	DWORD biSize;
    //  	LONG  biWidth;
    //  	LONG  biHeight;
    //  	WORD  biPlanes;
    //  	WORD  biBitCount;
    //  	DWORD biCompression;
    //  	DWORD biSizeImage;
    //  	LONG  biXPelsPerMeter;
    //  	LONG  biYPelsPerMeter;
    //  	DWORD biClrUsed;
    //  	DWORD biClrImportant;
    //  } BITMAPINFOHEADER, *PBITMAPINFOHEADER;
    //
    const BITMAPINFOHEADER = [
        // DWORD biSize -- The number of bytes required by the structure
        40,
        0,
        0,
        0,
        // LONG biWidth -- The width of the bitmap, in pixels
        biWidth & 0xFF,
        biWidth >> 8 & 0xFF,
        biWidth >> 16 & 0xFF,
        biWidth >> 24 & 0xFF,
        // LONG biHeight -- The height of the bitmap, in pixels
        biHeight & 0xFF,
        biHeight >> 8 & 0xFF,
        biHeight >> 16 & 0xFF,
        biHeight >> 24 & 0xFF,
        // WORD biPlanes -- The number of planes for the target device. This value must be set to 1
        1,
        0,
        // WORD biBitCount -- The number of bits-per-pixel, 24 bits-per-pixel -- the bitmap
        // has a maximum of 2^24 colors (16777216, Truecolor)
        24,
        0,
        // DWORD biCompression -- The type of compression, BI_RGB (code 0) -- uncompressed
        0,
        0,
        0,
        0,
        // DWORD biSizeImage -- The size, in bytes, of the image. This may be set to zero for BI_RGB bitmaps
        biSizeImage & 0xFF,
        biSizeImage >> 8 & 0xFF,
        biSizeImage >> 16 & 0xFF,
        biSizeImage >> 24 & 0xFF,
        // LONG biXPelsPerMeter, unused
        0,
        0,
        0,
        0,
        // LONG biYPelsPerMeter, unused
        0,
        0,
        0,
        0,
        // DWORD biClrUsed, the number of color indexes of palette, unused
        0,
        0,
        0,
        0,
        // DWORD biClrImportant, unused
        0,
        0,
        0,
        0,
    ];

    const iPadding = (4 - ((biWidth * 3) % 4)) % 4;

    const aImgData = oData.data;

    let strPixelData = '';
    const biWidth4 = biWidth << 2;
    let y = biHeight;
    const { fromCharCode } = String;

    do {
        const iOffsetY = biWidth4 * (y - 1);
        let strPixelRow = '';
        for (let x = 0; x < biWidth; x++) {
            const iOffsetX = x << 2;
            strPixelRow += fromCharCode(aImgData[iOffsetY + iOffsetX + 2])
                            + fromCharCode(aImgData[iOffsetY + iOffsetX + 1])
                            + fromCharCode(aImgData[iOffsetY + iOffsetX]);
        }

        for (let c = 0; c < iPadding; c++) {
            strPixelRow += String.fromCharCode(0);
        }

        strPixelData += strPixelRow;
    } while (--y);

    const strEncoded = encodeData(BITMAPFILEHEADER.concat(BITMAPINFOHEADER)) + encodeData(strPixelData);

    return strEncoded;
};

/**
 * saveAsImage
 * @param canvasElement
 * @param {String} image type
 * @param {Number} [optional] png width
 * @param {Number} [optional] png height
 */
const saveAsImage = function (canvas, width, height, type, fileName) {
    if ($support.canvas && $support.dataURL) {
        if (typeof canvas === 'string') {
            canvas = document.getElementById(canvas);
        }
        if (type == undefined) {
            type = 'png';
        }
        type = fixType(type);
        if (/bmp/.test(type)) {
            const data = getImageData(scaleCanvas(canvas, width, height));
            var strData = genBitmapImage(data);
            saveFile(makeURI(strData, downloadMime));
        }
        else {
            var strData = getDataURL(canvas, type, width, height);
            saveFile(strData.replace(type, downloadMime), fileName);
        }
    }
};

const convertToImage = function (canvas, width, height, type) {
    if ($support.canvas && $support.dataURL) {
        if (typeof canvas === 'string') {
            canvas = document.getElementById(canvas);
        }
        if (type == undefined) {
            type = 'png';
        }
        type = fixType(type);

        if (/bmp/.test(type)) {
            const data = getImageData(scaleCanvas(canvas, width, height));
            var strData = genBitmapImage(data);
            return genImage(makeURI(strData, 'image/bmp'));
        }
        var strData = getDataURL(canvas, type, width, height);
        return genImage(strData);
    }
};

export default {
    saveAsImage,
    saveAsPNG(canvas, width, height, fileName) {
        return saveAsImage(canvas, width, height, 'png', fileName);
    },
    saveAsJPEG(canvas, width, height) {
        return saveAsImage(canvas, width, height, 'jpeg');
    },
    saveAsGIF(canvas, width, height) {
        return saveAsImage(canvas, width, height, 'gif');
    },
    saveAsBMP(canvas, width, height) {
        return saveAsImage(canvas, width, height, 'bmp');
    },

    convertToImage,
    convertToPNG(canvas, width, height) {
        return convertToImage(canvas, width, height, 'png');
    },
    convertToJPEG(canvas, width, height) {
        return convertToImage(canvas, width, height, 'jpeg');
    },
    convertToGIF(canvas, width, height) {
        return convertToImage(canvas, width, height, 'gif');
    },
    convertToBMP(canvas, width, height) {
        return convertToImage(canvas, width, height, 'bmp');
    },
};

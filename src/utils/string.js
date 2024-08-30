export function getFileNameAndType(url) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const regex = /\/([^\/]+)$/;
    const match = pathname.match(regex);
    if (match && match.length > 1) {
        const fileName = match[1];
        const fileNameParts = fileName.split('.');
        const fileType = fileNameParts.length > 1 ? fileNameParts.pop() : null;
        return {
            fileName: fileName,
            fileType: fileType
        };
    } else {
        return {
            fileName: null,
            fileType: null
        };
    }
}

export function isImageFile(filename) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff'];
    const fileExtension = filename.split('.').pop().toLowerCase();
    return imageExtensions.includes(fileExtension);
}
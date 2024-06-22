export function getFileNameAndType(url) {
    const regex = /\/([^\/?#]+)$/i;
    const match = url.match(regex);

    if (match && match.length > 1) {
        const fileName = match[1];
        const fileType = fileName.split('.').pop();
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
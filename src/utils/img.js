export function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const arrayBuffer = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        arrayBuffer[i] = binaryString.charCodeAt(i);
    }
    return arrayBuffer.buffer
}
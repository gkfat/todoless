import { v4 } from 'uuid';

function getUuid() {
    return v4();
}

function getBase64Uuid() {
    return Buffer.from(getUuid()).toString('base64');
}

export { getBase64Uuid };
// const CLOUD_NAME = "daahi2yaz"
// const UPLOAD_PRESET = '618972539517621'
// const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

const CLOUD_NAME = "dcwibf9o5"
const UPLOAD_PRESET = 'vt0iqgff'
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`


const upload = (file) => {
    const formData = new FormData();
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET);

    return fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(({url}) => ({url}))
    .catch(error => console.error(error))
}

export default {
    upload
}

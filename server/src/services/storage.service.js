const ImageKit = require("@imagekit/nodejs")
const { v4: uuid } = require("uuid")

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

async function uploadFile(file, folder = "dustImage") {
  try {
    const result = await imagekit.files.upload({
      file: file.toString("base64"),  
      fileName: uuid(),
      folder: folder
    })

    return result.url
  } catch (error) {
    console.log("Image upload error:", error.message)
    throw new Error("Image upload failed")
  }
}

module.exports = { uploadFile }

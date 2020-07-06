import React, { useState } from 'react'
// import logo from './logo.svg'
import './App.css'

import Application from './Components/Application'
import UserProvider from './providers/UserProvider'

import { storage } from './firebase'

function App() {
  // React Firebase Image Upload tutorial:
  // https://dev.to/itnext/how-to-do-image-upload-with-firebase-in-react-cpj
  const allInputs = { imgUrl: '' }
  const [imageAsFile, setImageAsFile] = useState('')
  const [imageAsUrl, setImageAsUrl] = useState(allInputs)

  console.log('IMAGE AS FILE:')
  console.log(imageAsFile)

  const handleImageAsFile = e => {
    const image = e.target.files[0]
    setImageAsFile(imageFile => image)
  }

  const handleFireBaseUpload = e => {
    e.preventDefault()
    console.log('start of upload')
    // async magic goes here...
    if (imageAsFile === '') {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`)
    }
    const uploadTask = storage.ref(`/images/${imageAsFile.name}`).put(imageAsFile)
  }

  return (
    <UserProvider>
      <Application />
      <div>READY FOR IMAGE UPLOAD</div>
      <form onSubmit={handleFireBaseUpload}>
        <input type="file" onChange={handleImageAsFile} />
        <button>upload to firebase</button>
      </form>
    </UserProvider>
  )
}

export default App

import React, { useState, useContext } from 'react'
// import logo from './logo.svg'

import firebase from 'firebase'
// import * as firebase from 'firebase/app'

import { storage } from '../firebase'

import { UserContext } from '../providers/UserProvider'

// const admin = require('firebase-admin')
// import { admin } from 'firebase-admin'

// const serviceAccount = require('../private/serviceAccountKey.json')
// import serviceAccount from '../private/serviceAccountKey.json'

import { firestore } from '../firebase'

const FileUpload = props => {
  // React Firebase Image Upload tutorial:
  // https://dev.to/itnext/how-to-do-image-upload-with-firebase-in-react-cpj
  const allInputs = { imgUrl: '' }
  const [imageAsFile, setImageAsFile] = useState('')
  const [imageAsUrl, setImageAsUrl] = useState(allInputs)

  console.log('IMAGE AS FILE:')
  console.log(imageAsFile)

  console.log('IMAGE AS URL:')
  console.log(imageAsUrl)

  const user = useContext(UserContext)
  console.log('FILE UPLOAD > USER:')
  console.log(user)

  const handleImageAsFile = e => {
    console.log('HANDLE IMAGE AS FILE > EVENT target files:')
    console.log(e.target.files)
    const image = e.target.files[0]
    console.log('HANDLE IMAGE AS FILE > IMAGE:')
    console.log(image)
    setImageAsFile(imageFile => image)
  }

  const handleFireBaseUpload = e => {
    e.preventDefault()
    console.log('start of upload')
    // async magic goes here...
    if (imageAsFile === '') {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`)
    }

    // File gets uploaded on execution of this line:
    // https://firebase.google.com/docs/reference/js/firebase.storage.Reference
    const uploadTask = storage.ref(`/images/${imageAsFile.name}`).put(imageAsFile)

    // Show the status of the upload as it's happening
    // Full example: https://firebase.google.com/docs/storage/web/upload-files#full_example
    uploadTask.on(
      'state_changed',
      snapShot => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot)
      },
      err => {
        //catches the errors
        console.log(err)
      },
      () => {
        console.log('UPLOAD STARTING > IMAGE AS FILE:')
        console.log(imageAsFile)
        console.log(typeof imageAsFile)

        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref('images')
          .child(imageAsFile.name)
          .getDownloadURL()
          .then(async fireBaseUrl => {
            setImageAsUrl(prevObject => ({ ...prevObject, imgUrl: fireBaseUrl }))

            const data = {
              name: imageAsFile.name,
              lastModified: imageAsFile.lastModified,
              lastModifiedDate: imageAsFile.lastModifiedDate,
              size: imageAsFile.size,
              type: imageAsFile.type,
              url: fireBaseUrl,
              uploadedByUser: user.uid,
              users: [user.uid],
              // createdAt: firebase.database.ServerValue.TIMESTAMP
              createdAt: firebase.firestore.Timestamp.fromDate(new Date())
            }
            console.log('UPLOAD DONE > DATA TO BE ADDED:')
            console.log(data)

            console.log('UPLOAD DONE > FIREBASE DATABASE:')
            console.log(firebase.database)

            // const admin = require('firebase-admin')
            // admin.initializeApp({
            //   credential: admin.credential.cert(serviceAccount)
            // })

            // const db = admin.firestore()

            firestore.settings({
              timestampsInSnapshots: true
            })

            const res = await firestore.collection('images').add(data)
            console.log('FILE UPLOAD > COMPLETE > SET DATA > RESPONSE:')
            console.log(res)
            console.log('ID: ' + res.id)
          })
      }
    )
  }

  return (
    <>
      <div>READY FOR IMAGE UPLOAD</div>
      <form onSubmit={handleFireBaseUpload}>
        <input type="file" onChange={handleImageAsFile} />
        <button>upload to firebase</button>
      </form>
      {imageAsUrl.imgUrl && <img src={imageAsUrl.imgUrl} alt={imageAsUrl} />}
    </>
  )
}

export default FileUpload

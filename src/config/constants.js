import firebase from 'firebase'
import { firebaseConfig } from './config'

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth
export const db = firebase.database()

export const reservedBoardSlug = ['trash', 'signup', 'signin', 'signout']

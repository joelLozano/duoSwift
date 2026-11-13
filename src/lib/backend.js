// Capa de persistencia: usa Firebase (Auth + Firestore) si hay configuración en .env.local,
// o un "modo local" basado en localStorage para poder usar la app sin configurar nada.

const env = import.meta.env
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

/* ---------------------------- Firebase ---------------------------- */
let fbPromise = null
function fb() {
  if (!fbPromise) {
    fbPromise = (async () => {
      const [{ initializeApp }, authMod, fsMod] = await Promise.all([
        import('firebase/app'),
        import('firebase/auth'),
        import('firebase/firestore'),
      ])
      const app = initializeApp(firebaseConfig)
      return { app, auth: authMod.getAuth(app), db: fsMod.getFirestore(app), authMod, fsMod }
    })()
  }
  return fbPromise
}

const mapFbUser = (u) => (u ? { uid: u.uid, name: u.displayName || u.email?.split('@')[0] || 'Swifter', email: u.email } : null)

const fbErrors = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'No existe una cuenta con ese correo.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-email': 'El correo no es válido.',
  'auth/popup-closed-by-user': 'Se cerró la ventana de Google.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
}
const friendly = (e) => new Error(fbErrors[e?.code] || e?.message || 'Ocurrió un error.')

/* ---------------------------- Modo local ---------------------------- */
const LS_USERS = 'duoswift:users'
const LS_SESSION = 'duoswift:session'
const lsGet = (k, d) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d }
}
const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v))
const listeners = new Set()
const emitLocal = () => {
  const uid = lsGet(LS_SESSION, null)
  const users = lsGet(LS_USERS, {})
  const u = Object.values(users).find((x) => x.uid === uid)
  const user = u ? { uid: u.uid, name: u.name, email: u.email } : null
  listeners.forEach((cb) => cb(user))
}
async function hash(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

/* ---------------------------- API pública ---------------------------- */
export function onAuthChange(cb) {
  if (firebaseEnabled) {
    let unsub = () => {}
    let cancelled = false
    fb().then(({ auth, authMod }) => {
      if (!cancelled) unsub = authMod.onAuthStateChanged(auth, (u) => cb(mapFbUser(u)))
    })
    return () => { cancelled = true; unsub() }
  }
  listeners.add(cb)
  emitLocal()
  return () => listeners.delete(cb)
}

export async function signUp(name, email, password) {
  email = email.trim().toLowerCase()
  if (firebaseEnabled) {
    const { auth, authMod } = await fb()
    try {
      const cred = await authMod.createUserWithEmailAndPassword(auth, email, password)
      await authMod.updateProfile(cred.user, { displayName: name })
      return mapFbUser({ ...cred.user, displayName: name })
    } catch (e) { throw friendly(e) }
  }
  const users = lsGet(LS_USERS, {})
  if (users[email]) throw new Error('Ya existe una cuenta con ese correo.')
  if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.')
  const uid = 'local-' + crypto.randomUUID()
  users[email] = { uid, name, email, hash: await hash(email + ':' + password) }
  lsSet(LS_USERS, users)
  lsSet(LS_SESSION, uid)
  emitLocal()
}

export async function signIn(email, password) {
  email = email.trim().toLowerCase()
  if (firebaseEnabled) {
    const { auth, authMod } = await fb()
    try { await authMod.signInWithEmailAndPassword(auth, email, password) } catch (e) { throw friendly(e) }
    return
  }
  const u = lsGet(LS_USERS, {})[email]
  if (!u || u.hash !== (await hash(email + ':' + password))) throw new Error('Correo o contraseña incorrectos.')
  lsSet(LS_SESSION, u.uid)
  emitLocal()
}

export async function signInWithGoogle() {
  if (!firebaseEnabled) throw new Error('Google requiere configurar Firebase.')
  const { auth, authMod } = await fb()
  try { await authMod.signInWithPopup(auth, new authMod.GoogleAuthProvider()) } catch (e) { throw friendly(e) }
}

export async function resetPassword(email) {
  if (!firebaseEnabled) throw new Error('La recuperación por correo requiere Firebase.')
  const { auth, authMod } = await fb()
  try { await authMod.sendPasswordResetEmail(auth, email.trim()) } catch (e) { throw friendly(e) }
}

export async function signOut() {
  if (firebaseEnabled) {
    const { auth, authMod } = await fb()
    return authMod.signOut(auth)
  }
  localStorage.removeItem(LS_SESSION)
  emitLocal()
}

const progressKey = (uid) => `duoswift:progress:${uid}`

export async function loadProgress(uid) {
  const cached = lsGet(progressKey(uid), null)
  if (!firebaseEnabled) return cached
  try {
    const { db, fsMod } = await fb()
    const snap = await fsMod.getDoc(fsMod.doc(db, 'users', uid))
    const remote = snap.exists() ? snap.data().progress : null
    // Usa la versión más reciente (permite progreso offline)
    if (remote && (!cached || (remote.updatedAt || 0) >= (cached.updatedAt || 0))) return remote
    return cached
  } catch (e) {
    console.warn('No se pudo leer Firestore, usando caché local', e)
    return cached
  }
}

export async function saveProgress(uid, progress, profile = {}) {
  lsSet(progressKey(uid), progress)
  if (!firebaseEnabled) return
  try {
    const { db, fsMod } = await fb()
    await fsMod.setDoc(
      fsMod.doc(db, 'users', uid),
      { progress, name: profile.name || null, updatedAt: fsMod.serverTimestamp() },
      { merge: true },
    )
  } catch (e) {
    console.warn('No se pudo guardar en Firestore (queda en caché local)', e)
  }
}

export async function resetProgress(uid) {
  localStorage.removeItem(progressKey(uid))
  if (!firebaseEnabled) return
  const { db, fsMod } = await fb()
  await fsMod.setDoc(fsMod.doc(db, 'users', uid), { progress: null }, { merge: true })
}

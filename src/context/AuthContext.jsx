import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthChange } from '../lib/backend.js'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = cargando
  useEffect(() => onAuthChange(setUser), [])
  return <AuthCtx.Provider value={{ user, loading: user === undefined }}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)

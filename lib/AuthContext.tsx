'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { UserData } from './types/auth.types'
import { authService } from './services/auth.service'



interface AuthContextType {
    user: UserData | null
    setUser: (user: UserData | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await authService.me();
                setUser(data.user);
            } catch {
                setUser(null);
            }
        }

        fetchUser();

    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}

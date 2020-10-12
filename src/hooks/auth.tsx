import React, {createContext, useCallback, useState, useContext, useEffect} from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

interface SignInCredentials {
    email: string;
    password:string;
}

interface AuthContextData {
    user: object;
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void
}

interface AuthState {
    token:string;
    user: object;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({children})=>{
    const [data, setData] = useState<AuthState>({} as AuthState);

    useEffect(()=>{
        async function loadStorageData(): Promise<void>{

            const [token, user] = await AsyncStorage.multiGet(['@GoBarber:token','@GoBarber:user']);
    
            if(token[1] && user[1]){
                setData({token:token[1], user: JSON.parse(user[1])})
            }
    
            
        }

        loadStorageData();
    }, []);

    const signIn = useCallback(async ({email, password})=>{
        const response = await api.post('/sessions', {email, password});

        const {token, user}  = response.data;

        await AsyncStorage.multiSet([
            ['@GoBarber:token', token],
            ['@GoBarber:user', JSON.stringify(user)]
        ])
 
        setData({token, user});
    }, []);

    const signOut = useCallback(async ()=>{
        await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user'])
    }, []);

    return (
        <AuthContext.Provider value={{user: data.user, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if(!context){
        throw new Error('Context must be used within an AuthProvider');
    }

    return context;
}
import React, { Children } from 'react';
import {AuthProvider} from './auth';

const AppProviders: React.FC = ({children})=>{
    return(
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}

export default AppProviders;
import React, {useCallback, useRef} from 'react';
import {View, Image, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import {useAuth} from '../../hooks/auth';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

interface SignInProps {
    email:string;
    password:string;
}


import {Container, Title, ForgotPassword, ForgotPasswordText, CreateAccountButton, CreateAccountButtonText} from './styles';

const SignIn: React.FC = ()=>{
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);

    const passwordInputRef = useRef<TextInput>(null);

    const {signIn, user} = useAuth();

    console.log(user);

    const handleSignIn = useCallback(async (data:SignInProps)=>{
        try {
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                email: Yup.string().required("Email obrigatório").email("Digite um email válido"),
                password: Yup.string().required("Senha obrigatória")
            })

            await schema.validate(data, {
                abortEarly: false
            })

            await signIn({email:data.email, password:data.password});
        }catch(err){
            if(err instanceof Yup.ValidationError){
                const errors = getValidationErrors(err);

                formRef.current?.setErrors(errors);

                return;
            }

            Alert.alert("Erro na autenticação","Ocorreu um erro ao fazer o login. Cheque as credencias")
        }
    }, [signIn]);

    return(
        <>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : undefined} enabled>
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{flex:1}}>
                    <Container>
                        <Image source={logoImg} />

                        <View>
                            <Title>Faça seu logon</Title>
                        </View>

                        <Form ref={formRef} onSubmit={handleSignIn}>
                            <Input name="email" icon="mail" placeholder="Email" autoCorrect={false} autoCapitalize="none" keyboardType="email-address" returnKeyType="next" onSubmitEditing={()=>{passwordInputRef.current?.focus()}} />
                            <Input ref={passwordInputRef} name="password" icon="lock" placeholder="Senha" autoCorrect={false} autoCapitalize="none" secureTextEntry returnKeyType="send" onSubmitEditing={()=>{formRef.current?.submitForm()}} />
                        </Form>
                        <Button onPress={()=>{formRef.current?.submitForm()}}>Entrar</Button>

                        <ForgotPassword onPress={()=>{}}>
                            <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
                        </ForgotPassword>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>

            <CreateAccountButton onPress={()=> navigation.navigate("SignUp")}>
                <Icon name="log-in" size={20} color="#ff9000" />
                <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
            </CreateAccountButton>
        </>
    );
}

export default SignIn;
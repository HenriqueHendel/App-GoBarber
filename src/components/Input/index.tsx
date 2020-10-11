import React, {useState, useEffect, useCallback, useRef, useImperativeHandle, forwardRef} from 'react';
import {TextInputProps} from 'react-native';
import {useField} from '@unform/core';


import {Container, TextInput, Icon} from './styles';

interface InputProps extends TextInputProps {
    name:string;
    icon: string;
}

interface InputValueReference {
    value: string;
}

interface InputRef {
    focus(): void;
}

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = ({name, icon, ...rest}, ref) => {
    const {registerField, defaultValue='', fieldName, error} = useField(name);
    const inputValueRef = useRef<InputValueReference>({value: defaultValue});
    const inputElementRef = useRef<any>(null);

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const handleInputFocus = useCallback(()=>{
        setIsFocused(true)
    }, []);

    const handleInputBlur = useCallback(()=>{
        setIsFocused(false);

        setIsFilled(!!inputValueRef.current.value);

    }, []);

    useImperativeHandle(ref, ()=>({
        focus(){
            inputElementRef.current.focus();
        }
    }))

    useEffect(()=>{
        registerField<string>({
            name: fieldName,
            ref: inputValueRef.current,
            path: 'value',
            setValue(ref:any, value){
                inputValueRef.current.value = value;
                inputElementRef.current.setNativeProps({text:value})
            },
            clearValue() {
                inputValueRef.current.value = '';
                inputElementRef.current.clear();
            }
        })
    }, [fieldName, registerField])

    return(
        <Container isFocused={isFocused} isErrored={!!error}>
            <Icon name={icon} size={20} color={isFocused || isFilled ? "#ff9000" : "#666360"} />

            <TextInput 
            ref={inputElementRef}
            keyboardAppearance="dark"
            placeholderTextColor="#666360"
            defaultValue={defaultValue}
            onChangeText={value => inputValueRef.current.value = value}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            {...rest}
        />
        </Container>
    );
}

export default forwardRef(Input);
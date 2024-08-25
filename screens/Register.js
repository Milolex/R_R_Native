import { StyleSheet, Text, View, Dimensions, TextInput, Button, TouchableOpacity ,PixelRatio} from 'react-native';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { create_User, insert_Data ,login_Usser} from '../SupaConsult';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register() {
    const windowHeight = Dimensions.get('window').height;
    const rectangleHeight = windowHeight / 2;
    const navigation = useNavigation();
    const [credentials, setCredentials] = useState({
        firstName: '',
        secondName: '',
        firstLastName: '',
        secondLastName: '',
        email: '',
        password: '',
        confirmPass: '',
    });

    const handleInputChange = (name, value) => {
        setCredentials({ ...credentials, [name]: value });
    };

    return (
        <View style={styles.container}>
            <LottieView
                source={require('../assets/regisAnim.json')}
                autoPlay
                loop
                style={{
                    width: rectangleHeight/2,
                    height: rectangleHeight/2,
                    position: 'absolute',
                    top: 0,
                    marginTop: '20%',
                }}
                
            />
            <View style={styles.decora}>
                <TextInput style={styles.intputFirstName}
                    placeholder="Pri. Nombre"
                    keyboardType="default"
                    value = {credentials.firstName}
                    onChangeText={(text) => handleInputChange('firstName', text)}
                />
                <TextInput style={styles.intputSecondName}
                    placeholder="Seg. Nombre"
                    keyboardType="default"
                    value = {credentials.secondName}
                    onChangeText={(text) => handleInputChange('secondName', text)}
                />
                <TextInput style={styles.intputFirstLastName}
                    placeholder="Pri. Apellido"
                    keyboardType="default"
                    value = {credentials.firstLastName}
                    onChangeText={(text) => handleInputChange('firstLastName', text)}
                />
                <TextInput style={styles.intputSecondLastName}
                    placeholder="Seg. Apellido"
                    keyboardType="default"
                    value = {credentials.secondLastName}
                    onChangeText={(text) => handleInputChange('secondLastName', text)}
                />
                <TextInput style={styles.intputEmail}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    value = {credentials.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                />
                <TextInput style={styles.intputPasswoord}
                    secureTextEntry = {true}
                    placeholder="Contraseña"
                    textContentType="password"
                    value = {credentials.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                />
                <TextInput style={styles.intputConfPasswoord}
                    secureTextEntry = {true}
                    placeholder="Confirmar contraseña"
                    textContentType="password"
                    value = {credentials.confirmPass}
                    onChangeText={(text) => handleInputChange('confirmPass', text)}

                />
                <TouchableOpacity
                    style={styles.botonRegistrar}
                    onPress={async() => {
                        if (credentials.password === credentials.confirmPass){
                            try{
                                
                                await create_User(credentials.email, credentials.password)
                                await login_Usser(credentials.email, credentials.password)
                                const uuid = await AsyncStorage.getItem('userUid');  
                                const dato = {
                                    uid: uuid,
                                    first_name: credentials.firstName ,
                                    second_name: credentials.secondName,
                                    first_last_name: credentials.firstLastName,
                                    second_last_name: credentials.secondLastName,
                                    correo: credentials.email,
                                    tipoUser: 'Usuario',
                                }
                                await insert_Data('inf_usuarios_t', dato)
                                //navigation.navigate('Rutas');
                            }catch(e){
                                alert(e)
                            }
                
                            
                            
                        }else{
                            alert('Las contraseñas no coinciden')
                        }
                    }}
                >
                    <Text>Registrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    decora:{
        width: (Dimensions.get('window').width)-20,
        height:(Dimensions.get('window').height)/2,
        backgroundColor: '#3B6D7B',
        position: 'absolute',
        bottom:0,
        left:0,
        marginRight: 10,
        borderTopRightRadius: 50,
        alignItems:'center',
    },
    intputFirstName:{
        position: 'absolute',
        width: (Dimensions.get('window').width)/2.5,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingLeft: 10,
        left:0,
        marginLeft: 20,
        marginTop: 40,
    },
    intputSecondName:{
        position: 'absolute',
        width: (Dimensions.get('window').width)/2.5,
        height: 40,
        backgroundColor: 'white',
        marginRight: 20,
        borderRadius: 10,
        paddingLeft: 10,
        right:0,
        marginTop: 40,
    },
    intputFirstLastName:{
        position: 'absolute',
        width: (Dimensions.get('window').width)/2.5,
        height: 40,
        backgroundColor: 'white',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 100,
        borderRadius: 10,
        paddingLeft: 10,
        left:0,
    },
    intputSecondLastName:{
        position: 'absolute',
        width: (Dimensions.get('window').width)/2.5,
        height: 40,
        backgroundColor: 'white',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 100,
        borderRadius: 10,
        paddingLeft: 10,
        right:0,
    },
    intputEmail:{
        position: 'absolute',
        width: (Dimensions.get('window').width)-65,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingLeft: 10,
        marginTop: 160,
    },
    intputPasswoord:{
        position: 'absolute',
        width: (Dimensions.get('window').width)/2.5,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingLeft: 10,
        marginTop: 220,
        left:0,
        marginLeft: 20,
    },
    intputConfPasswoord:{
        position: 'absolute',
        width: (Dimensions.get('window').width)/2.5,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingLeft: 10,
        marginTop: 220,
        right:0,
        marginRight: 20,
    },
    botonRegistrar: {
        width: "30%",
        height: "10%",
        borderRadius:20,
        backgroundColor: '#fffff6',
        marginTop: 270,
        position:'absolute',
        bottom:0,
        alignItems:'center',
        justifyContent:'center',
        marginBottom:60,
        right:0,
        marginRight:20,
    },


    
});

import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, PixelRatio, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import React, { useState, useEffect } from 'react';
import { login_Usser } from '../SupaConsult'; 
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
    const windowHeight = Dimensions.get('window').height;
    const rectangleHeight = windowHeight / 2;
    const navigation = useNavigation();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permiso denegado', 'Permiso de ubicación no concedido');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;

                let response = await Location.reverseGeocodeAsync({ latitude, longitude });
                if (response.length > 0) {
                    let { region, city } = response[0];
                    await AsyncStorage.setItem('location', JSON.stringify({ latitude, longitude }));
                    await AsyncStorage.setItem('region', region || 'Desconocido');
                    await AsyncStorage.setItem('city', city || 'Desconocido');
                } else {
                    Alert.alert('Error', 'No se pudo obtener la ubicación');
                }
            } catch (error) {
                Alert.alert('Error', 'Error al obtener ubicación: ' + error.message);
            }
        };

        fetchLocation();
    }, []);

    const handleInputChange = (name, value) => {
        setCredentials({ ...credentials, [name]: value });
    };

    const handleForgotPasswordPress = () => {
        navigation.navigate('RecoveryScreen');
    };

    const handleLogin = async () => {
        const result = await login_Usser(credentials.email, credentials.password);
        if (result.success) {
            
    
            
            const rolUser = await AsyncStorage.getItem('rolUser');
            if(rolUser == 'Conductor'){
                navigation.navigate('Conductor');
            }else{
                navigation.navigate('Rutas');
            }
        } else {
            Alert.alert('Error', 'Credenciales incorrectas. Por favor intenta de nuevo.');
        }
    };
    

   
    return (
        <View style={styles.container}>
            <LottieView
                source={require('../assets/usuario.json')}
                autoPlay
                loop
                style={{
                    width: rectangleHeight / 2,
                    height: rectangleHeight / 2,
                    position: 'absolute',
                    top: 0,
                    marginTop: '20%',
                }}
            />
            <View style={styles.decora}>
                <Text style={styles.textBienve}>Bienvenido</Text>
                <Text style={styles.textRaice}>Raices Rurales</Text>
                <TextInput
                    style={styles.inputEmail}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    value={credentials.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                />
                <TextInput
                    style={styles.inputPasswoord}
                    secureTextEntry={true}
                    placeholder="Contraseña"
                    textContentType="password"
                    value={credentials.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                />
                <TouchableOpacity
                    style={styles.botonLogin}
                    onPress={() => {
                        navigation.navigate('Register');
                    }}
                >
                    <Text style={styles.botonText}>Registrar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.botonRegistrar}
                    onPress={handleLogin}
                >
                    <Text style={styles.botonText}>Iniciar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonOlv}
                    onPress={handleForgotPasswordPress}
                >
                    <Text style={styles.buttonTextOlvt}>Olvidaste tu contraseña?</Text>
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
        right:0,
        marginLeft: 10,
        borderTopLeftRadius: 50,
        alignItems:'center',
    },
    textBienve:{
        color:'#ffffff',
        fontSize:35 / PixelRatio.getFontScale(),
        margin:20,
        position:'absolute',
        left:0,
    },
    textRaice:{
        color:'#ffffff',
        fontSize:25 / PixelRatio.getFontScale(),
        marginLeft:20,
        marginTop:60,
        position:'absolute',
        left:0,
    },
    inputEmail:{
        width:"80%",
        height: "10%",  
        paddingHorizontal: 10,
        borderRadius:20,
        backgroundColor: '#ffffff',
        marginTop:'35%', 
    },
    inputPasswoord:{
        width:"80%",
        height: "10%",
        paddingHorizontal: 10,
        borderRadius:20,
        backgroundColor: '#ffffff',
        marginTop:20,
    },
    botonLogin: {
        width: "30%",
        height: "10%",
        borderRadius:20,
        backgroundColor: '#fffff6',
        marginTop: '230',
        position:'absolute',
        right:0,
        bottom:0,
        alignItems:'center',
        justifyContent:'center',
        marginBottom:60,
        marginRight:50,
    },
    botonRegistrar: {
        width: "30%",
        height: "10%",
        borderRadius:20,
        backgroundColor: '#fffff6',
        position:'absolute',
        left:0,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:50,
        bottom:0,
        marginBottom:60,
    },
    botonText: {
        fontSize: 10,
        color: '#665',
    },
    buttonOlv: {
        width: "100%",
        height: "5%",
        position:'absolute',
        bottom:0,
        right:0,
    },
    buttonTextOlvt: {
        fontSize: 10,
        color: '#ffffff',
        position:'absolute',
        bottom:0,
        right:0,
        marginBottom:20,

        marginRight:15,
    },    
});


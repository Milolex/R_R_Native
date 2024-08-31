import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { close_Sesion } from '../SupaConsult';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowHeight = Dimensions.get('window').height;

const CabeCompo = () => {
    const navigation = useNavigation();

    const cerrarSesion = async () => {
        try {
            await close_Sesion(); 
            await AsyncStorage.removeItem('userUid');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.headerText}>Raices Rurales</Text>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={cerrarSesion}
                >
                    <Ionicons name="log-out" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 7,
        backgroundColor: '#3B6D7B',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        position: 'relative',
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
        marginTop:30,
    },
    headerText: {
        color: '#ffffff',
        fontSize: 20,
        marginTop:30,
    },
    logoutButton: {
        position: 'absolute',
        top: '50%', 
        right: 20, 
        transform: [{ translateY: -10 }], 
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 50,
        padding: 8,
        marginTop:10,
    },
});

export default CabeCompo;



//Create By: Camilo Andres Martínez Gualteros 2024
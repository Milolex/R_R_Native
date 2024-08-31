import React from 'react';
import { View, Button, Alert, StyleSheet, SafeAreaView, Platform } from 'react-native';
import * as Location from 'expo-location';

export default function TestLocation() {
    const handleGetLocation = async () => {
        // Solicitar permisos de ubicación
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Permiso de ubicación no concedido');
            return;
        }

        // Obtener la ubicación actual
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Obtener el departamento y municipio usando las coordenadas
        let response = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (response.length > 0) {
            let { region, city } = response[0];
            Alert.alert('Ubicación actual', `Departamento: ${region}, Municipio: ${city}`);
        } else {
            Alert.alert('Error', 'No se pudo obtener la ubicación');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button title="Obtener Ubicación" onPress={handleGetLocation} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end', 
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0 
    },
    buttonContainer: {
        marginBottom: 20, 
    },
});

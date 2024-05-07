import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import CabeCompo from './CabeCompo';
import { fetchData, obtenerUsserUid } from '../SupaConsult';

export default function Perfil({ route }) {
    const [showComponent, setShowComponent] = useState(false);
    const [nombreUsuario, setNombreUsuario] = useState('');

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const usserUid = await obtenerUsserUid();
                const usuario = await fetchData('conductores', 'nombre', { campo: 'id', valor: usserUid });
                if (usuario.length > 0) {
                    setNombreUsuario(usuario[0].nombre);
                }
                setShowComponent(true);
            } catch (error) {
                console.error('Error al cargar datos:', error.message);
                alert('Error al cargar datos');
            }
        };

        cargarDatos();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                {showComponent ? (
                    <View style={styles.CabeCompo}>
                        <CabeCompo />
                        <Text>Nombre del usuario: {nombreUsuario}</Text>
                    </View>
                ) : (
                    <View style={styles.placeholder}>
                        <Text>Cargando...</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    }
});

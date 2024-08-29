import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, Image, Button, ImageBackground, FlatList, ScrollView } from 'react-native';
import CabeCompo from './CabeCompo';
import ListaActividades from './Lista_Actividades';
import { fetch_Data } from '../SupaConsult';

export default function Perfil() {
    const [datos, setDatos] = useState([]); // Datos del perfil
    const [reservas, setReservas] = useState([]); // Reservas del usuario
    useEffect(() => {
        const cargaDatos = async () => {
            try {
                const uid = await AsyncStorage.getItem('userUid');
                const datos = await fetch_Data('inf_usuarios_t', 'first_name, first_last_name, correo', { campo: 'uid', valor: uid });
                setDatos(datos);
                
                const reservas = await fetch_Data('carrito_ven_t', 'nombre_actividad, fecha_reserva', { campo: 'uid_cliente', valor: uid });
                setReservas(reservas);
                console.log(reservas);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                alert('Error al cargar datos');
            }
        };

        cargaDatos();
    }, []);
    const primerDato = datos.length > 0 ? datos[0] : {};

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
            
                <View style={styles.decorativeBackground}>
                    <View style={styles.profileContainer}>
                        <Image
                            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Foto_Perfil_.jpg' }} // URL de la foto del perfil
                            style={styles.profileImage}
                        />
                        <Text style={styles.name}>{primerDato.first_name + ' ' + primerDato.first_last_name || 'Nombre no disponible'}</Text>
                        <Text style={styles.email}>{primerDato.correo || 'Correo no disponible'}</Text>
                        <Button title="Editar Perfil" onPress={() => alert('Edit Profile pressed!')} />
                    </View>
                </View>

                <View style={styles.bioContainer}>
                    <Text style={styles.bio}>Desarrollador de software apasionado por la tecnología y la innovación. Amante del café y los videojuegos.</Text>
                </View>

                <View style={styles.reservasContainer}>
                    <Text style={styles.reservasTitle}>Mis Reservas</Text>
                    <FlatList
                        data={reservas}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.reservaItem}>
                                <Text style={styles.reservaText}>Actividad: {item.nombre_actividad}</Text>
                                <Text style={styles.reservaText}>Fecha: {item.fecha_reserva}</Text>
                            </View>
                        )}
                    />
                </View>
            </ScrollView>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    imageBackground: {
        width: Dimensions.get('window').width - 20,
        height: Dimensions.get('window').height / 3,
        marginLeft: 10,
        marginTop: 120,
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,
        overflow: 'hidden',
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

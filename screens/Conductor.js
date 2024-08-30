import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { fetch_Data, uploadImage, update_Data, close_Sesion } from '../SupaConsult';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de instalar esta dependencia
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation para la navegación

const { height } = Dimensions.get('window');

const Conductor = () => {
    const [datos, setDatos] = useState([]); // Datos del perfil
    const [reservas, setReservas] = useState([]); // Reservas del usuario
    const [selectedImage, setSelectedImage] = useState(null);
    const [fullPath, setFullPath] = useState(null);

    const navigation = useNavigation(); // Usa useNavigation para la navegación

    const cargaDatos = async () => {
        try {
            const uid = await AsyncStorage.getItem('userUid');
            const datos = await fetch_Data('inf_usuarios_t', 'first_name, first_last_name, correo, photo_perfil', { campo: 'uid', valor: uid });
            setDatos(datos);

            const reservas = await fetch_Data('carrito_ven_t', 'nombre_actividad, fecha_reserva, status, uid_compra', { campo: 'uid_conductor', valor: uid });
            setReservas(reservas);

        } catch (error) {
            console.error('Error al cargar datos:', error);
            alert('Error al cargar datos');
        }
    };

    useEffect(() => {
        const requestPermissions = async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Lo siento, necesitamos permisos de acceso a la biblioteca de fotos.');
            }
        };

        cargaDatos();
        requestPermissions();

        const intervalId = setInterval(() => {
            cargaDatos();
        }, 5 * 60 * 1000); // Actualiza cada 5 minutos

        // Limpiar intervalo al desmontar el componente
        return () => clearInterval(intervalId);
    }, []);

    const selectImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Lo siento, necesitamos permisos de acceso a la biblioteca de fotos.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        if (result.canceled) {
            alert('No seleccionaste ninguna imagen.');
        } else {
            const asset = result.assets[0];
            const fileExtension = asset.uri.split('.').pop().toLowerCase();
            if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
                setSelectedImage(asset.uri);

                const file = {
                    uri: asset.uri,
                    type: 'image/jpeg',
                    name: asset.fileName || asset.uri.split('/').pop(),
                };
                try {
                    const uploadResponse = await uploadImage(file);
                    const newFullPath = uploadResponse?.path;
                    setFullPath(newFullPath); // Actualiza el estado con la URL de la imagen subida

                    alert('Imagen subida con éxito.');

                    // Actualiza la imagen en el perfil
                    const uid = await AsyncStorage.getItem('userUid');
                    await update_Data('inf_usuarios_t', 'photo_perfil', newFullPath, { campo: 'uid', valor: uid });

                    // Vuelve a cargar los datos del perfil para reflejar el cambio
                    const updatedDatos = await fetch_Data('inf_usuarios_t', 'first_name, first_last_name, correo, photo_perfil', { campo: 'uid', valor: uid });
                    setDatos(updatedDatos);
                } catch (error) {
                    console.error('Error al subir la imagen:', error);
                    alert('Error al subir la imagen.');
                }
            } else {
                alert('El archivo seleccionado no es una imagen .jpg o .jpeg.');
            }
        }
    };

    const cerrarSesion = async () => {
        try {
            await close_Sesion(); // Llama a la función de cierre de sesión
            await AsyncStorage.removeItem('userUid'); // Elimina el UID del almacenamiento
            navigation.navigate('Login'); // Navega a la pantalla de inicio de sesión
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión');
        }
    };

    const primerDato = datos.length > 0 ? datos[0] : {};
    const profileImageUrl = primerDato.photo_perfil || 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Foto_Perfil_.jpg';

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={cerrarSesion}
                >
                    <Ionicons name="log-out" size={20} color="white" />
                </TouchableOpacity>

                <View style={styles.decorativeBackground}>
                    <View style={styles.profileContainer}>
                        <View style={styles.profileImageContainer}>
                            <Image
                                source={{ uri: profileImageUrl }} // URL de la foto del perfil
                                style={styles.profileImage}
                            />
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={selectImage}
                            >
                                <Ionicons name="pencil" size={15} color="black" />
                            </TouchableOpacity>
                        </View>
                        
                        <Text style={styles.name}>{'Conductor: '+primerDato.first_name + ' ' + primerDato.first_last_name || 'Nombre no disponible'}</Text>
                        <Text style={styles.email}>{primerDato.correo || 'Correo no disponible'}</Text>
                    </View>
                </View>

                <View style={styles.bioContainer}>
                    <Text style={styles.bio}>En este apartado podrás visualizar todas tus rutas asociadas.</Text>
                </View>

                <View style={styles.reservasContainer}>
                    <Text style={styles.reservasTitle}>Mis Rutas</Text>
                    <FlatList
                        data={reservas}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.reservaItem}>
                                <Text style={styles.reservaText}>Actividad: {item.nombre_actividad}</Text>
                                <Text style={styles.reservaText}>Fecha: {item.fecha_reserva}</Text>
                                <Text style={styles.reservaText}>Status: {item.status}</Text>
                            </View>
                        )}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    logoutButton: {
        position: 'absolute',
        top: 40, // Separa el botón del borde superior
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 50,
        padding: 8,
        zIndex: 1,
    },
    decorativeBackground: {
        height: height * 0.3, // Ajusta la altura del fondo decorativo a un porcentaje del alto de la pantalla
        backgroundColor: '#3B6D7B',
        borderBottomLeftRadius: 100, // Ajusta el radio del borde para el medio redondeo
        borderBottomRightRadius: 100, // Ajusta el radio del borde para el medio redondeo
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 5,
    },
    name: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    email: {
        color: '#fff',
        fontSize: 14,
    },
    bioContainer: {
        padding: 20,
        alignItems: 'center',
    },
    bio: {
        fontSize: 16,
        color: '#333',
    },
    reservasContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    reservasTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    reservaItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    reservaText: {
        fontSize: 16,
        color: '#333',
    },
});

export default Conductor;

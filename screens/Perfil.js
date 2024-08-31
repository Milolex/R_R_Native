import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { fetch_Data, delete_Data, uploadImage, update_Data, close_Sesion } from '../SupaConsult';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const StarRating = ({ rating, onRatingChange }) => {
    return (
        <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                    key={star}
                    onPress={() => onRatingChange(star)}
                >
                    <Ionicons
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={24}
                        color="gold"
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};


const Perfil = () => {
    const navigation = useNavigation();
    const [datos, setDatos] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [fullPath, setFullPath] = useState(null);

    useEffect(() => {
        const cargaDatos = async () => {
            try {
                const uid = await AsyncStorage.getItem('userUid');
                const datos = await fetch_Data('inf_usuarios_t', 'first_name, first_last_name, correo, photo_perfil', { campo: 'uid', valor: uid });
                setDatos(datos);

                const reservas = await fetch_Data('carrito_ven_t', 'nombre_actividad, fecha_reserva, status, uid_compra', { campo: 'uid_cliente', valor: uid });
                setReservas(reservas);

            } catch (error) {
                console.error('Error al cargar datos:', error);
                alert('Error al cargar datos');
            }
        };

        const requestPermissions = async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Lo siento, necesitamos permisos de acceso a la biblioteca de fotos.');
            }
        };

        cargaDatos();
        requestPermissions();
    }, []);

    const eliminarReserva = async (uid_compra) => {
        const reserva = reservas.find(reserva => reserva.uid_compra === uid_compra);
        if (reserva && reserva.status === 'Pago en Proceso') {
            Alert.alert(
                'Confirmar eliminación',
                '¿Estás seguro de que deseas eliminar esta reserva?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Eliminar',
                        onPress: async () => {
                            try {
                                await delete_Data('carrito_ven_t', { campo: 'uid_compra', valor: uid_compra });
                                setReservas(reservas.filter(reserva => reserva.uid_compra !== uid_compra));
                            } catch (error) {
                                console.error('Error al eliminar la reserva:', error);
                                alert('Error al eliminar la reserva');
                            }
                        },
                    },
                ],
                { cancelable: true }
            );
        } else {
            alert('El item no puede ser eliminado porque su estado no es "Pago en Proceso".');
        }
    };

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
                    setFullPath(newFullPath);

                    alert('Imagen subida con éxito.');

                    const uid = await AsyncStorage.getItem('userUid');
                    await update_Data('inf_usuarios_t', 'photo_perfil', newFullPath, { campo: 'uid', valor: uid });

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
            await close_Sesion(); 
            await AsyncStorage.removeItem('userUid');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión');
        }
    };

    const irAChat = async (uid_compra) => {
        const reserva = reservas.find(reserva => reserva.uid_compra === uid_compra);
        if (reserva) {
            try {
                // Guarda el uid_compra en AsyncStorage
                await AsyncStorage.setItem('uid_compra', reserva.uid_compra);

                // Navega a la pantalla de chat después de guardar uid_compra
                navigation.navigate('Chat');
            } catch (error) {
                console.error('Error al guardar uid_compra en AsyncStorage:', error);
                alert('Error al guardar uid_compra');
            }
        } else {
            alert('Reserva no encontrada');
        }
    };
    const handleRatingChange = async (uid_compra, newRating) => {
        console.log(`UID Reserva: ${uid_compra}, Nueva Calificación: ${newRating}`);
        // Actualiza la calificación en la base de datos
        try {
            await update_Data('carrito_ven_t', 'calificacion', newRating, { campo: 'uid_compra', valor: uid_compra });

            const ruta_calificar = await fetch_Data('carrito_ven_t', 'uid_ruta', { campo: 'uid_compra', valor: uid_compra });

            // Asegúrate de que ruta_calificar tenga al menos un elemento y es un array
            if (ruta_calificar.length > 0) {
                const uidRuta = ruta_calificar[0].uid_ruta;
               
                const calificacion_ruta = await fetch_Data('ruta_t', 'calificacion', { campo: 'uid_ruta', valor: uidRuta });
                
                const promedio_calificacion = (calificacion_ruta[0].calificacion + newRating) / 2;
                
                await update_Data('ruta_t', 'calificacion', Math.round(promedio_calificacion), { campo: 'uid_ruta', valor: uidRuta });

            } 



            
            
         
            // Actualiza el estado local para reflejar los cambios
            const updatedReservas = reservas.map(reserva =>
                reserva.uid_compra === uid_compra ? { ...reserva, rating: newRating } : reserva
            );
            setReservas(updatedReservas);
        } catch (error) {
            console.error('Error al actualizar la calificación:', error);
            alert('Error al actualizar la calificación');
        }
    };

    const primerDato = datos.length > 0 ? datos[0] : {};
    const profileImageUrl = primerDato.photo_perfil || 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Foto_Perfil_.jpg';

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.decorativeBackground}>
                    <View style={styles.profileContainer}>
                        <View style={styles.profileImageContainer}>
                            <Image
                                source={{ uri: profileImageUrl }} 
                                style={styles.profileImage}
                            />
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={selectImage}
                            >
                                <Ionicons name="pencil" size={15} color="black" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.name}>{primerDato.first_name + ' ' + primerDato.first_last_name || 'Nombre no disponible'}</Text>
                        <Text style={styles.email}>{primerDato.correo || 'Correo no disponible'}</Text>
                    </View>
                </View>

                <View style={styles.bioContainer}>
                    <Text style={styles.bio}>En este apartado podrás visualizar todas tus reservas y su estatus.</Text>
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
                                <Text style={styles.reservaText}>Status: {item.status}</Text>
                                {item.status === 'Finalizado' && (
                                    <StarRating
                                        rating={item.rating || 0}
                                        onRatingChange={(newRating) => handleRatingChange(item.uid_compra, newRating)}
                                    />
                                )}
                                {item.status === 'Pago en Proceso' && (
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => eliminarReserva(item.uid_compra)}
                                    >
                                        <Text style={styles.deleteButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                )}
                                {item.status !== 'Finalizado' && (
                                    <TouchableOpacity
                                        style={styles.chatButton}
                                        onPress={() => irAChat(item.uid_compra)}
                                    >
                                        <Text style={styles.chatButtonText}>Chat</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    />
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={cerrarSesion}
            >
                <Ionicons name="log-out" size={20} color="white" />
            </TouchableOpacity>
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
    decorativeBackground: {
        height: height * 0.3,
        backgroundColor: '#3B6D7B',
        borderBottomLeftRadius: 100, 
        borderBottomRightRadius: 100, 
        alignItems: 'center',
        justifyContent: 'center', 
        paddingTop: 80, 
        paddingBottom: 20, 
    },
    profileContainer: {
        alignItems: 'center',
        paddingHorizontal: 16, 
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'white',
    },
    profileImageContainer: {
        position: 'relative',
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 8,
        elevation: 2,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 8,
    },
    email: {
        fontSize: 16,
        color: 'white',
    },
    bioContainer: {
        padding: 16,
    },
    bio: {
        fontSize: 16,
        color: '#333',
    },
    reservasContainer: {
        padding: 16,
    },
    reservasTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    reservaItem: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    reservaText: {
        fontSize: 16,
        marginBottom: 4,
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: '#FF6347',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#FF6347', 
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutButton: {
        position: 'absolute',
        top: 40, 
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 50,
        padding: 8,
        zIndex: 1,
    },
    chatButton: {
        marginTop: 10,
        backgroundColor: 'green',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    chatButtonText: {
        color: 'white',
        fontSize: 16,
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
});

export default Perfil;

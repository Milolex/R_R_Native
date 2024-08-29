import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView, Dimensions, TouchableOpacity, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Librería para seleccionar imágenes
import { fetch_Data, delete_Data, uploadImage,update_Data} from '../SupaConsult'; // Asegúrate de exportar `uploadImage` desde SupaConsult
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window'); // Obtener el alto de la pantalla

const Perfil = () => {
    const [datos, setDatos] = useState([]); // Datos del perfil
    const [reservas, setReservas] = useState([]); // Reservas del usuario
    const [selectedImage, setSelectedImage] = useState(null);
    const [fullPath, setFullPath] = useState(null);
    useEffect(() => {
        const cargaDatos = async () => {
            try {
                const uid = await AsyncStorage.getItem('userUid');
                const datos = await fetch_Data('inf_usuarios_t', 'first_name, first_last_name, correo', { campo: 'uid', valor: uid });
                setDatos(datos);
                
                const reservas = await fetch_Data('carrito_ven_t', 'nombre_actividad, fecha_reserva, status, uid_compra', { campo: 'uid_cliente', valor: uid });
                setReservas(reservas);
                
            } catch (error) {
                console.error('Error al cargar datos:', error);
                alert('Error al cargar datos');
            }
        };

        const requestPermissions = async () => {
            if (Platform.OS === 'ios') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Lo siento, necesitamos permisos de acceso a la biblioteca de fotos.');
                }
            } else if (Platform.OS === 'android') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Lo siento, necesitamos permisos de acceso a la biblioteca de fotos.');
                }
            }
        };

        cargaDatos();
        requestPermissions();
    }, []);

    const eliminarReserva = (uid_compra) => {
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
        // Solicita permisos para la biblioteca de imágenes
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Lo siento, necesitamos permisos de acceso a la biblioteca de fotos.');
            return;
        }

        // Lanza la biblioteca de imágenes
        const response = await ImagePicker.launchImageLibraryAsync({ mediaType: 'photo', quality: 1 });

        if (response.cancelled) {
            alert('No seleccionaste ninguna imagen.');
        } else if (response.errorCode) {
            alert('Error al seleccionar la imagen: ' + response.errorMessage);
        } else {
            // Verifica que `response.assets` esté definido y tenga al menos un elemento
            if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                setSelectedImage(asset.uri);

                // Crea el objeto `file` con información de la imagen
                const file = {
                    uri: asset.uri,
                    type: asset.type,
                    name: asset.fileName || asset.uri.split('/').pop()
                };

                try {
                    const uid = await AsyncStorage.getItem('userUid');
                    const uploadResponse = await uploadImage(file); // Usa la función de carga de imágenes que ya has implementado
                    const fullPath = uploadResponse?.path; // Ajusta esto según la estructura exacta del objeto `data` devuelto
                    setFullPath(fullPath); // Actualiza el estado global
                    alert('Imagen subida con éxito.');
                    console.log('FullPath de la imagen:', fullPath);
                    await update_Data('inf_usuarios_t', 'photo_perfil', fullPath, { campo: 'uid', valor: uid });
                } catch (error) {
                    alert('Error al subir la imagen.');
                }
            } else {
                alert('No se pudo obtener la información de la imagen.');
            }
        }
    };
    
    

    const primerDato = datos.length > 0 ? datos[0] : {};

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.decorativeBackground}>
                    <View style={styles.profileContainer}>
                        <Image
                            source={{ uri: 'https://piazhwrekcgxbvsyqiwi.supabase.co/storage/v1/object/public/avatars/'+fullPath || 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Foto_Perfil_.jpg' }} // URL de la foto del perfil
                            style={styles.profileImage}
                        />
                        <Text style={styles.name}>{primerDato.first_name + ' ' + primerDato.first_last_name || 'Nombre no disponible'}</Text>
                        <Text style={styles.email}>{primerDato.correo || 'Correo no disponible'}</Text>
                        <TouchableOpacity 
                            style={styles.uploadButton} 
                            onPress={selectImage}
                        >
                            <Text style={styles.uploadButtonText}>Subir Imagen</Text>
                        </TouchableOpacity>
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
                                {item.status === 'Pago en Proceso' && (
                                    <TouchableOpacity 
                                        style={styles.deleteButton} 
                                        onPress={() => eliminarReserva(item.uid_compra)}
                                    >
                                        <Text style={styles.deleteButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                )}
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
    decorativeBackground: {
        height: height * 0.3, // Ajusta la altura del fondo decorativo a un porcentaje del alto de la pantalla
        backgroundColor: '#3B6D7B',
        borderBottomLeftRadius: 100, // Ajusta el radio del borde para el medio círculo
        borderBottomRightRadius: 100, // Ajusta el radio del borde para el medio círculo
        alignItems: 'center', // Alinea el contenido del fondo
        justifyContent: 'center', // Centra el contenido verticalmente
        paddingTop: 80, // Ajusta para evitar el notch
        paddingBottom: 20, // Añade padding para separación del contenido
    },
    profileContainer: {
        alignItems: 'center',
        paddingHorizontal: 16, // Añade algo de padding horizontal
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50, // Hace que la imagen sea circular
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white'
    },
    email: {
        fontSize: 18,
        color: 'white',
        marginBottom: 16,
    },
    uploadButton: {
        backgroundColor: '#3B6D7B',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    uploadButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    bioContainer: {
        alignItems: 'center',
        paddingHorizontal: 16, // Añade algo de padding horizontal
        marginVertical: 20, // Espacio entre el fondo decorativo y el contenido
    },
    bio: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    reservasContainer: {
        flex: 1, // Ocupa el espacio disponible
        width: '100%',
        paddingHorizontal: 16,
    },
    reservasTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#3B6D7B',
    },
    reservaItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reservaText: {
        fontSize: 16,
        flex: 1,
    },
    deleteButton: {
        backgroundColor: '#FF6347', // Rojo tomate
        padding: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Perfil;

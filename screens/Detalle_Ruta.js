import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, ImageBackground, ScrollView } from 'react-native';
import CabeCompo from './CabeCompo';
import ListaActividades from './Lista_Actividades';
import { fetch_Data } from '../SupaConsult';

export default function DetalleRuta({ route }) {
    const { service } = route.params;
    const windowHeight = Dimensions.get('window').height;
    const idRuta = service.uid_ruta;
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        const cargaDatos = async () => {
            try {
                
                const datosServicios = await fetch_Data('ruta_t', 'act_1,act_2,act_3,act_4,act_5,act_6,act_7,act_8,act_9', { campo: 'uid_ruta', valor: idRuta });

                
                if (!datosServicios || datosServicios.length === 0) {
                    console.error('No se encontraron datos para la ruta proporcionada.');
                    alert('No se encontraron datos para la ruta proporcionada.');
                    return;
                }


                
                const actividadesPromises = Object.keys(datosServicios[0]).map(async (campo) => {
                    const idActividad = datosServicios[0][campo];
                    if (idActividad) {  
                        try {
                            const actividad = await fetch_Data('actividades_t', 'uid_actividades,nombre, descripcion, photo, hr_inicio, hr_fin', { campo: 'uid_actividades', valor: idActividad });

                            return actividad[0];
                        } catch (fetchError) {
                            
                            return null;
                        }
                    } else {
                        
                        return null;
                    }
                });

                const actividades = await Promise.all(actividadesPromises);

                
                const actividadesFiltradas = actividades.filter(actividad => actividad);
                setServicios(actividadesFiltradas);
            } catch (error) {  
                alert('Error al cargar datos');
            }
        };

        cargaDatos();
    }, [idRuta]);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <CabeCompo />
                <ImageBackground source={{ uri: service.foto }} style={styles.imageBackground}></ImageBackground>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{service.nombre}</Text>
                    <Text style={styles.description}>{service.descripcion}</Text>
                    <Text style={styles.description}>{"Conductor designado: "}</Text>
                    <Text style={styles.description}>Si deseas eliminar alguna actividad puedes colocar tu dedo encima de ella para eliminarla.</Text>
                    <Text style={styles.subtitle}>ACTIVIDADES</Text>
                    <ListaActividades servicios={servicios} />
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

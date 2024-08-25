import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, Image} from 'react-native';
import CabeCompo from './CabeCompo';
import { fetchData, obtenerUsserUid } from '../SupaConsult';
import StarRating from './StarRating';


const ListaServiciosVertical = () => {
    const [servicios, setServicios] = useState([]);

    


    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const cargaDatos = async () => {
            try {
                const usserUid = await obtenerUsserUid();
                const datosServicios = await fetchData('rutas_t', 'nombre, hora_Inicio, hora_Final,act_1,foto,departamento,municipio,descripcion,calificacion', {campo: 'reservado', valor: usserUid});
                setServicios(datosServicios);

            } catch(error) {
                console.error('Error al cargar datos:', error);
                alert('Error al cargar datos');
            }
        };

        cargaDatos(); 
        const interval = setInterval(cargaDatos, 5000); 
        return () => clearInterval(interval); 
    }, []);

    const handleVerMas = (service) => {
        setSelectedService(service);
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainerVertical}>
            <Image source={{ uri: item.foto }} style={styles.imageVertical} />
            <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{item.nombre}</Text>
                <Text style={styles.serviceDirec}>{item.descripcion}</Text>
                <Text style={styles.serviceDirec}>{item.departamento + "-" + item.municipio}</Text>
                <Text style={styles.serviceDirec}>{item.hora_Inicio + "-" + item.hora_Final}</Text>
                
            </View>
            <View style={styles.buttonContainer}>
                <StarRating rating={item.calificacion} />
            </View>
        </View>
    );

    return (
        
        <View style={styles.container}>
            <FlatList
                data={servicios}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()} 
            />
            {selectedService && (
                <View style={styles.selectedServiceContainer}>
                    <Text style={styles.selectedServiceText}>{`Seleccionaste: ${selectedService.nombre}`}</Text>
                </View>
            )}
        </View>
    );
};




const ListaReservaConductor = () => {
    const [servicios, setServicios] = useState([]);

    


    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const cargaDatos = async () => {
            try {
                const usserUid = await obtenerUsserUid();
                const datosServicios = await fetchData('rutas_t', 'nombre, hora_Inicio, hora_Final,act_1,foto,departamento,municipio,descripcion,calificacion', {campo: 'reservado', valor: usserUid});
                setServicios(datosServicios);

            } catch(error) {
                console.error('Error al cargar datos:', error);
                alert('Error al cargar datos');
            }
        };

        cargaDatos(); 
        const interval = setInterval(cargaDatos, 5000); 
        return () => clearInterval(interval); 
    }, []);

    const handleVerMas = (service) => {
        setSelectedService(service);
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainerVertical}>
            <Image source={{ uri: item.foto }} style={styles.imageVertical} />
            <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{item.nombre}</Text>
                <Text style={styles.serviceDirec}>{item.descripcion}</Text>
                <Text style={styles.serviceDirec}>{item.departamento + "-" + item.municipio}</Text>
            </View>
        </View>
    );

    return (
        
        <View style={styles.container}>
            <FlatList
                data={servicios}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()} 
            />
            {selectedService && (
                <View style={styles.selectedServiceContainer}>
                    <Text style={styles.selectedServiceText}>{`Seleccionaste: ${selectedService.nombre}`}</Text>
                </View>
            )}
        </View>
    );
};




export default function Perfil({ route }) {
    const [showComponent, setShowComponent] = useState(false);
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const usserUid = await obtenerUsserUid();
                const usuarioData = await fetchData('conductores', 'nombre, tipo', { campo: 'id', valor: usserUid });
                setUsuario(usuarioData[0]);
                if (usuarioData[0]?.tipo === 1) {
                    setShowComponent(true);
                } else {
                    setShowComponent(false);
                }
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
                        <View style={styles.inicio}>
                            <CabeCompo/>
                        </View>
                    <Text style={styles.titServici}>Bienvenido {usuario?.nombre} </Text>
                    <Text style={styles.descServi}>Aqui podras ver tus rustas solicitadas.</Text>
                    <Text style={styles.titleService}>Estas estaran en estado de verificacion, en algun momento se comiunicara contigo un asesor via telefonica.</Text>
                    <ListaServiciosVertical/>
                        
                    </View>
                ) : (
                    <View style={styles.placeholder}>
                        <View style={styles.CabeCompo}>
                            <View style={styles.inicio}>
                                <CabeCompo/>
                            </View>
                            <Text style={styles.titServici}>Bienvenido Conductor {usuario?.nombre} </Text>
                            <Text style={styles.descServi}>Aqui podras ver tus rustas asignadas.</Text>
                            <Text style={styles.descServi}>Estas estaran en estado de verificacion, en algun momento se comiunicara contigo un asesor via telefonica y te dara tu intinerarios correspondiente.</Text>
                            <ListaServiciosVertical/>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    itemContainer: {
        padding: 10,
        width: 120,
        height: 200,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainerVertical: {
        marginTop: 10,
        flexDirection: 'column',
        alignItems: 'left',
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc'

    },
    titBienvenido: {
        marginTop: 60,
        fontSize: 30,
        color: 'black',
        marginLeft: 20,
    },
    titSec: {
        fontSize: 25,
        color: 'black',
        marginLeft: 20,
    },
    image: {
        width: 80,
        height: 80,
        marginBottom: 10,
        borderRadius: 40,
    },
    imageRuta: {
        width: 100,
        height: 150,
        marginBottom: 10,
        borderRadius: 10,
    },
    imageVertical: {
        width: '100%', 
        height: 100,
        marginRight: 10,
        borderRadius: 10,
    },
    inicio: {
        height: 100,
        backgroundColor: 'white',
    },
    titRut: {
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 5,
        marginTop: 40,
    },
    titleService: {
        fontSize: 20,
        marginLeft: 20,
        marginTop: 40,
    },
    titServici: {
        fontSize: 25,
        marginLeft: 20,
        marginTop: 60,
    },
    descServi: {
        fontSize: 15,
        marginLeft: 20,
        marginTop: 10,
    },
    checkboxContainer: {
        padding: 5,
    },
    serviceName: {
        marginTop: 10,
    },
    checkboxContainer: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkbox: {
        width: 10,
        height: 10,
        backgroundColor: '#000',
        borderRadius: 2,
    },
    serviceInfo: {
        marginTop: 5,
        fontSize: 10,
    },
    serviceDirec: {
        marginTop: 5,
        fontSize: 10,
        color: 'gray',
    },
    buttonContainer: {
        flexDirection: 'row', // Para alinear el icono y el botón horizontalmente
        alignItems: 'center', // Para centrar verticalmente el icono y el botón
        justifyContent: 'flex-end', // Para alinearlos a la derecha del contenedor
    },
    icon: {
        marginRight: 5, // Espacio entre el icono y el botón
    },
    button: {
        // Agrega estilos adicionales al botón si es necesario
    },


    itemContainerGuia: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc'
    },
    imageGuia: {
        width: 100,
        height: 100,
        marginRight: 50,
        borderRadius: 50,
    },
    serviceNameGuia: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    serviceInfoGuia: {
        marginTop: 5,
    },
    serviceDirecGuia: {
        marginTop: 5,
        fontSize: 12,
        color: 'gray',
    },
});

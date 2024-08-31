import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, Image ,TouchableOpacit, Button} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import CabeCompo from './CabeCompo';
import Perfil from './Perfil';
import { fetch_Data, insert_Data} from '../SupaConsult';
import { useNavigation } from '@react-navigation/native';
import StarRating from './StarRating';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowHeight = Dimensions.get('window').height;
const rectangleHeight = windowHeight / 2;


const Rute = () => (
    <View style={styles.container}>
        <View style={styles.inicio}>
            <CabeCompo/>
        </View>
        <Text style={styles.titServici}>Disfruta de nuestras rutas:</Text>
        <Text style={styles.descServi}>Aqui podras ver a detalle nuestras rutas.</Text>
        <ListaServiciosVertical />
    </View>

);

const ListaRutas = () => {
    const [nombreRuta, setNombreRuta] = useState([]);

    useEffect(() => {
        const cargaDatos = async () => {
            try {
                const datosRutas = await fetch_Data('ruta_t', 'nombre, foto', {campo: 'departamento', valor: 'Cundinamarca'});
                setNombreRuta(datosRutas);

            } catch(error) {
                console.error('Error al cargar datos:', error);
                alert('Error al cargar datos');
            }
        };

        cargaDatos(); 

        const interval = setInterval(cargaDatos, 5000); 
        return () => clearInterval(interval); 
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.foto }} style={styles.imageRuta} />
            <Text>{item.nombre}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titRut}>Rutas Populares</Text>
            <FlatList
                horizontal
                data={nombreRuta}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()} 
            />
        </View>
    );
};






const ListaUsuarios = () => {
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        const cargaDatos = async () => {

            try {

                let datosServicios = await fetch_Data('reservas_t', 'id_Conductor',{campo: '', valor: ''});
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

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text>{item.id_Conductor}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titleService}>Servicios Populares</Text>
            <FlatList
                horizontal
                data={servicios}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()} 
            />
        </View>
    );
};






const ListaServicios = () => {
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        const cargaDatos = async () => {
            try {
                const datosServicios = await fetch_Data('actividades_t', 'nombre, photo',{campo: 'municipio', valor: 'San_Juan'});
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

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.photo }} style={styles.image} />
            <Text>{item.nombre}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titleService}>Servicios Populares</Text>
            <FlatList
                horizontal
                data={servicios}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()} 
            />
        </View>
    );
};



const ListaServiciosVertical = () => {
    const [servicios, setServicios] = useState([]);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const cargaDatos = async () => {
            try {
                const datosServicios = await fetch_Data('ruta_t', 'uid_ruta,hr_inicio,hr_fin,nombre,descripcion,foto,departamento,municipio,calificacion', {campo: 'departamento', valor: 'Cundinamarca'});
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
            <View style={styles.buttonContainer}>
                <Ionicons name="chevron-forward" size={24} color="black" style={styles.icon} />
                <Button title="Ver más" onPress={() =>{
                    navigation.navigate('Detalle_Ruta', {service: item});
                }} />
                <StarRating rating={item.calificacion} />
                

            </View>
        </View>
    );
    const navigation = useNavigation();
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


const Inicio = () => (
    <View style={styles.container}>
        <View style={styles.inicio}>
            <CabeCompo/>
        </View>
        <Text style={styles.titBienvenido}>Bienvenido</Text>
        <Text style={styles.titSec}>¿A dónde quieres ir?</Text>
        <Text style={styles.text}>
            En este apartado encontrarás de manera informativa todas las rutas y actividades disponibles en nuestra plataforma, según tu ubicación actual. Para la cotización de nuestras rutas, dirígete al apartado "Rutas".
        </Text>
        <ListaRutas />
        <ListaServicios />
    </View>
);



const ListaGuias = () => {
    const [guias, setGuias] = useState([]);
    const [carro, setCarro] = useState([]);
    const [selectedGuia, setSelectedGuia] = useState(null);

    useEffect(() => {
        const cargaDatos = async () => {
            try {

                
                const datosGuias = await fetch_Data('inf_conductor_t', 'first_name,first_last_name,photo_perfil,tipo_licencia,calificacion,phone_number,uid_vehiculo', {campo: 'tipo', valor: 1});
                //const datosCarro = await fetch_Data('vehiculos', 'placa,color,cedula', {campo: 'id', valor: '13693452-0d6f-4117-aaf9-1262aaea4e82'});
                setGuias(datosGuias);
                //setCarro(datosCarro);
            } catch(error) {
                console.error('Error al cargar datos:', error);
                alert('Error al cargar datos');
            }
        };

        cargaDatos(); 
        const interval = setInterval(cargaDatos, 5000); 
        return () => clearInterval(interval); 
    }, []);

    const handleVerMas = (guia) => {
        setSelectedGuia(guia);
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainerGuia}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imagen }} style={styles.imageGuia} />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.serviceInfoGuia}>
                    <Text style={styles.serviceNameGuia}>{item.nombre} {item.apellido}</Text>
                    <Text style={styles.descripcion}>Cedula: {item.licencia}</Text>

                    <Text style={styles.descripcion}>Telefono: {item.telefono}</Text>
                    <StarRating rating={item.calificacion} />
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={guias}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()} 
            />
        </View>
    );
};


const Guias = () => (
    <View style={styles.container}>
        
        <Perfil/>
    </View>
);

const Tab = createBottomTabNavigator();

const Rutas = () => {
    
    return (
        <Tab.Navigator initialRouteName='Inicio'>
            <Tab.Screen name="Rutas" component={Rute} 
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="map" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="Inicio" component={Inicio} 
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="Perfil" component={Guias}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

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
    text: {
        fontSize: 10,
        color: 'black',
        marginLeft: 20,
        marginTop: 5,
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
        fontSize: 30,
        marginLeft: 20,
        marginTop: 60,
    },
    descServi: {
        fontSize: 10,
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
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-end', 
    },
    icon: {
        marginRight: 5, 
    },
    button: {
       
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

export default Rutas;

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, Image ,TouchableOpacit, Button} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import CabeCompo from './CabeCompo';
import { fetchData } from '../SupaConsult';



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
                const datosRutas = await fetchData('rutas_t', 'nombre, foto', {campo: 'departamento', valor: 'Cundinamarca'});
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

const ListaServicios = () => {
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        const cargaDatos = async () => {
            try {
                const datosServicios = await fetchData('actividades', 'nombre, imagen',{campo: 'municipio', valor: 'San_Juan'});
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
            <Image source={{ uri: item.foto }} style={styles.image} />
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
                const datosServicios = await fetchData('rutas_t', 'nombre,descripcion,foto,departamento,municipio', {campo: 'departamento', valor: 'Cundinamarca'});
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
                <Button title="Ver más" style={styles.button} onPress={() => handleVerMas(item)} />  
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
                    <Text style={styles.selectedServiceText}>{`Seleccionaste: ${selectedService.nombe}`}</Text>
                </View>
            )}
        </View>
    );
};




//------------>CAMBIAR CHEACKBOX POR UN BOTON   <----------------

/*const ListaServiciosVertical = () => {
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        const cargaDatos = async () => {
            try {
                const datosServicios = await fetchData('rutas_t', 'nombre,descripcion,foto,departamento,municipio', {campo: 'departamento', valor: 'Cundinamarca'});
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
    const toggleSelect = (index) => {
        const updatedServicios = [...servicios];
        updatedServicios[index].selected = !updatedServicios[index].selected;
        setServicios(updatedServicios);
    };
//------------------------------------------------------------------
    const renderItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => toggleSelect(index)}>
            <View style={styles.itemContainerVertical}>
                <Image source={{ uri: item.foto }} style={styles.imageVertical} />
                <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{item.nombre}</Text>
                    {item.selected && <Checkbox />}
                    <Text style={styles.serviceDirec}>{item.descripcion}</Text>
                    <Text style={styles.serviceDirec}>{item.departamento + "-" + item.municipio}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const Checkbox = () => (
        <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}></View>
        </View>
    );
    

    
    return (
        <View style={styles.container}>
            <FlatList
                data={servicios}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()} 
            />
        </View>
    );
};*/

const Inicio = () => (
    <View style={styles.container}>
        <View style={styles.inicio}>
            <CabeCompo/>
        </View>
        <Text style={styles.titBienvenido}>Bienvenido</Text>
        <Text style={styles.titSec}>¿A dónde quieres ir?</Text>
        <ListaRutas />
        <ListaServicios />
    </View>
);

const Guias = () => (
    <View style={styles.inicio}>
        <CabeCompo/>
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
            <Tab.Screen name="Guias" component={Guias}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="book" color={color} size={size} />
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

});

export default Rutas;

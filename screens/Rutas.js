import React from 'react';
import { StyleSheet, View, Text, Image, FlatList, Dimensions} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
const windowHeight = Dimensions.get('window').height;
const rectangleHeight = windowHeight / 2;
import CabeCompo from './CabeCompo';

const data = [
    { id: '1', title: 'Elemento 1' },
    { id: '2', title: 'Elemento 2' },
    { id: '3', title: 'Elemento 3' },
    { id: '4', title: 'Elemento 4' },
    { id: '5', title: 'Elemento 5' },
];
const renderItem = ({ item }) => (
    <View style={{ width: 80, height: 100, margin: 5, backgroundColor: 'lightgray', borderRadius: 10 }}>
        <Text>{item.title}</Text>
    </View>
  );

const Rute = () => (
    <View style={styles.inicio}>
        <CabeCompo/>
        
    </View>
);


const Inicio = () => (
    <View style={styles.inicio}>
        <View style={styles.inicio}>
            <CabeCompo/>
        </View>
        <View style={styles.contenedor}>
            <Text
            style={{
                fontSize: 25,
                color: 'black',
                left: 0,
                marginLeft: 20,
                marginTop: 150,
            
            }}>Bienvenido</Text>
            <Text
            style={{
                fontSize: 25,
                color: 'black',
                left: 0,
                marginLeft: 20,
                marginTop: 10,
            
            }}>¿A donde quieres ir?</Text>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal={true}
            />

        </View>
        
    </View>
);

const Guias = () => (
    <View style={styles.inicio}>
        <CabeCompo/>
    </View>
);

// Configurar la barra de navegación
const Tab = createBottomTabNavigator();

const Rutas = () => {
    return (
        <Tab.Navigator initialRouteName='Inicio'>
            <Tab.Screen name="Rutas" component={Rute} 
                options={
                    {headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                        <Ionicons name="map" color={color} size={size} />
                        ),
                    }
                    
                
                }
            
            />
        <Tab.Screen name="Inicio" component={Inicio} 
            options={
                {headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" color={color} size={size} />
                    ),
                }
            }
        />
        <Tab.Screen name="Guias" component={Guias}
        options={
                {headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="book" color={color} size={size} />
                    ),
                }
            }

        />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});

export default Rutas;

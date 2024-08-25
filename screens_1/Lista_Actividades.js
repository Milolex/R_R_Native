import React, { useState } from 'react';
import { View, Text, ImageBackground, FlatList, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import {insertData} from '../SupaConsult';

export default function ListaActividades({ servicios }) {
    const [selectedItems, setSelectedItems] = useState(Array(servicios.length).fill(false));

    const toggleCheckbox = (index) => {
        if (index !== 0 && index !== servicios.length - 1) {
            const newSelectedItems = [...selectedItems];
            newSelectedItems[index] = !newSelectedItems[index];
            setSelectedItems(newSelectedItems);
        }else{
            alert("Este elemento no se puede eliminar");
        }
    };

    const agendar = () => {
        const notSelectedActivities = servicios.filter((item, index) => !selectedItems[index]);



        



        if (notSelectedActivities.length === 0) {
            alert("No se seleccionaron rutas");
            return;
        } else {
            
            notSelectedActivities.forEach(item => {
                
                
                
                
            });
        }
    };

    const rehacerListado = () => {
        setSelectedItems(Array(servicios.length).fill(false));
    };

    const renderItem = ({ item, index }) => {
        if (selectedItems[index]) {
            return null;
        }
        
        return (
            <TouchableOpacity onPress={() => toggleCheckbox(index)}>
                <View style={styles.itemContainer}>
                    <View style={styles.imageContainer}>
                        <ImageBackground source={{ uri: item.imagen }} style={styles.image}></ImageBackground>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.nombre}</Text>
                        <Text style={styles.description}>{item.descripcion}</Text>
                        <Text style={styles.description}>{"(Esta actividad inicia a las: "+item.hora_inicio+" y finaliza a las: "+ item.hora_fin+")"}</Text>
                        
                    </View>
                    <View style={styles.checkboxContainer}>
                        {selectedItems[index] && <View style={styles.checkboxChecked}></View>}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={servicios}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.buttonContainer}>
                <Button title="Agendar Actividades" onPress={agendar} />
                <View style={{ flex: 1 }} />
                <Button title="Rehacer Actividades" onPress={rehacerListado} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25, 
        overflow: 'hidden', 
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        marginLeft: 10,
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        flexWrap: 'wrap',
    },
    checkboxContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        width: 14,
        height: 14,
        backgroundColor: 'black',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
    },
});

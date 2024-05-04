import React, { useState } from 'react';
import { View, Text, ImageBackground, FlatList, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';

export default function ListaActividades({ servicios }) {
    const [selectedItems, setSelectedItems] = useState(Array(servicios.length).fill(false));

    const toggleCheckbox = (index) => {
        const newSelectedItems = [...selectedItems];
        newSelectedItems[index] = !newSelectedItems[index];
        setSelectedItems(newSelectedItems);
    };

    const agendar = () => {
        const notSelectedActivities = servicios.filter((item, index) => !selectedItems[index]);

        if (notSelectedActivities.length === 0) {
            return;
        } else {
            console.log("Actividades no seleccionadas:");
            notSelectedActivities.forEach(item => {
                console.log(item.nombre);
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
                    {/* Aplicar borde redondeado a la imagen */}
                    <View style={styles.imageContainer}>
                        <ImageBackground source={{ uri: item.imagen }} style={styles.image}></ImageBackground>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.nombre}</Text>
                        <Text style={styles.description}>{item.descripcion}</Text>
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
        borderRadius: 25, // Hacer que el contenedor de la imagen sea redondo
        overflow: 'hidden', // Aplicar recorte de imagen para que sea visible dentro del contenedor redondeado
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

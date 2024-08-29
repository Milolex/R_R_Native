import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, FlatList, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Importa el DateTimePicker
import { insert_Data, fetch_Data } from '../SupaConsult';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ListaActividades({ servicios }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [conductores, setConductores] = useState([]);
    const [selectedConductor, setSelectedConductor] = useState(null);
    const [fechaAgendacion, setFechaAgendacion] = useState(new Date()); // Estado para la fecha de agendación
    const [showDatePicker, setShowDatePicker] = useState(false); // Estado para controlar la visualización del DatePicker

    useEffect(() => {
        const fetchConductores = async () => {
            try {
                const datos = await fetch_Data('inf_conductor_t', 'uid_conductor, first_name, first_last_name', { campo: 'status', valor: 'Disponible' });
                const conductoresList = datos.map(conductor => ({
                    label: `${conductor.first_name} ${conductor.first_last_name}`,
                    value: conductor.uid_conductor,
                }));
                setConductores(conductoresList);
                if (conductoresList.length > 0) {
                    setSelectedConductor(conductoresList[0].value);
                }
            } catch (error) {
                console.error('Error al obtener conductores:', error);
                Alert.alert('Error', 'No se pudieron cargar los conductores.');
            }
        };

        fetchConductores();
    }, []);

    useEffect(() => {
        const initialSelection = Array(servicios.length).fill(false);
        if (servicios.length > 0) {
            initialSelection[0] = true; // La primera actividad siempre está seleccionada
            initialSelection[servicios.length - 1] = true; // La última actividad siempre está seleccionada
        }
        setSelectedItems(initialSelection);
    }, [servicios]);

    const toggleCheckbox = (index) => {
        if (index !== 0 && index !== servicios.length - 1) {
            const newSelectedItems = [...selectedItems];
            newSelectedItems[index] = !newSelectedItems[index];
            setSelectedItems(newSelectedItems);
        } else {
            alert("Este elemento no se puede deseleccionar");
        }
    };

    const agendar = async () => {
        const notSelectedActivities = servicios.filter((item, index) => !selectedItems[index]);

        if (notSelectedActivities.length === servicios.length) {
            alert("No se seleccionaron actividades");
            return;
        }

        if (!selectedConductor) {
            alert("Debes seleccionar un conductor");
            return;
        }

        try {
            const userUid = await AsyncStorage.getItem('userUid');

            if (!userUid) {
                alert('Usuario no encontrado');
                return;
            }

            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const timeString = `${hours}:${minutes}:${seconds}`;

            const dato = {
                uid_conductor: selectedConductor,
                uid_cliente: userUid,
                status: 'Pago en Proceso',
                fecha_reserva: fechaAgendacion.toISOString().split('T')[0], // Usa la fecha seleccionada
                nombre_actividad: selectedActivity || '',
                hora: timeString,
                act_1: null,
                act_2: null,
                act_3: null,
                act_4: null,
                act_5: null,
                act_6: null,
                act_7: null,
                act_8: null,
                act_9: null
            };

            selectedItems.forEach((isSelected, index) => {
                if (isSelected) {
                    const key = `act_${index + 1}`;
                    dato[key] = servicios[index].uid_actividades;
                }
            });

            await insert_Data('carrito_ven_t', dato);

            alert('Uno de nuestros asesores se comunicará contigo para la respectiva cotización');
        } catch (error) {
            console.error('Error al agendar actividades:', error);
            alert('Error al agendar actividades');
        }
    };

    const rehacerListado = () => {
        const updatedSelection = Array(servicios.length).fill(false);
        if (servicios.length > 0) {
            updatedSelection[0] = true; // La primera actividad siempre está seleccionada
            updatedSelection[servicios.length - 1] = true; // La última actividad siempre está seleccionada
        }
        setSelectedItems(updatedSelection);
    };

    const seleccionarTodas = () => {
        setSelectedItems(Array(servicios.length).fill(true));
    };

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => toggleCheckbox(index)}>
                <View style={styles.itemContainer}>
                    <View style={styles.imageContainer}>
                        <ImageBackground source={{ uri: item.photo }} style={styles.image}></ImageBackground>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.nombre}</Text>
                        <Text style={styles.description}>{item.descripcion}</Text>
                        <Text style={styles.description}>{"(Esta actividad inicia a las: " + item.hora_inicio + " y finaliza a las: " + item.hora_fin + ")"}</Text>
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
            <View style={styles.conductorContainer}>
                <Text style={styles.conductorLabel}>Conductor Asignado:</Text>
                <RNPickerSelect
                    placeholder={{ label: 'Seleccione un conductor', value: null }}
                    value={selectedConductor}
                    onValueChange={(value) => setSelectedConductor(value)}
                    items={conductores}
                    style={{
                        inputIOS: styles.selectInput,
                        inputAndroid: styles.selectInput,
                        iconContainer: styles.iconContainer
                    }}
                />
                <MaterialCommunityIcons name="chevron-down" size={24} color="gray" style={styles.chevronIcon} />
            </View>

            {/* Date Picker */}
            <View style={styles.datePickerContainer}>
                <View style={styles.selectContainer}>
                    <Button title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
                </View>
                {/* Mostrar la fecha seleccionada */}
                <Text style={styles.selectedDate}>{fechaAgendacion.toISOString().split('T')[0]}</Text>
                {showDatePicker && (
                    <DateTimePicker
                        value={fechaAgendacion}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                                const now = new Date();
                                now.setHours(0, 0, 0, 0); // Resetea las horas, minutos, segundos y milisegundos para la comparación

                                if (selectedDate < now) {
                                    Alert.alert("Fecha no válida", "La fecha seleccionada no puede ser menor a la fecha actual.");
                                } else {
                                    setFechaAgendacion(selectedDate);
                                }
                            }
                        }}
                    />

                )}
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Seleccionar Todas" onPress={seleccionarTodas} />
                <Button title="Rehacer Actividades" onPress={rehacerListado} />
            </View>

            <FlatList
                data={servicios}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />

            <View style={styles.buttonContainer}>
                <Button title="Agendar Actividades" onPress={agendar} />
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
    selectContainer: {
        margin: 20,
    },
    conductorContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'column',
        alignItems: 'flex-start', 
    },
    conductorLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10, 
    },
    selectInput: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        fontSize: 16,
        width: '100%',
    },
    iconContainer: {
        top: 15,
        right: 10,
    },
    chevronIcon: {
        position: 'absolute',
        right: 30,
        top: '100%',
        transform: [{ translateY: -12 }]
    },
    datePickerContainer: {
        flexDirection: 'row', // Alinea los elementos en una fila
        alignItems: 'center', // Alinea los elementos verticalmente al centro
        padding: 10,
    },
    selectedDate: {
        marginLeft: 10, // Espacio entre el botón y la fecha seleccionada
        fontSize: 16,
        color: 'black',
    },
    selectContainer: {
        alignItems: 'flex-start', // Alinea el botón a la izquierda
    },
});

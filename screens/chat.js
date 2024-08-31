import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Alert, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch_Data, insert_Data, fetch_Data_mes } from '../SupaConsult';
import CabeCompo from './CabeCompo';

const { height } = Dimensions.get('window');

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [uidCliente, setUidCliente] = useState(null);
    const [uidConductor, setUidConductor] = useState(null);
  
    const previousMessages = useRef([]);

    const cargarDatos = useCallback(async () => {
        if (!uidCliente) return; // Asegura que uidCliente está cargado
    
        try {
            const uid = await AsyncStorage.getItem('userUid');
            const uidCompra = await AsyncStorage.getItem('uid_compra');
    
            if (!uid || !uidCompra) {
                Alert.alert('Error', 'UID de usuario o UID de compra no encontrado.');
                return;
            }
    
            const rol = await AsyncStorage.getItem('rol');
            let fetchedMessages = [];
    
            if (rol === 'Conductor') {
                fetchedMessages = await fetch_Data_mes('messages', 'content,created_at,id_cliente,id_conductor, send_by', { 
                    campo1: 'id_conductor', valor1: uid, 
                    campo2: 'id_cliente', valor2: uidCliente, 
                    campo3: 'id_compra', valor3: uidCompra 
                });
            } else {
                fetchedMessages = await fetch_Data_mes('messages', 'content,created_at,id_cliente,id_conductor, send_by', { 
                    campo1: 'id_conductor', valor1: uidConductor, 
                    campo2: 'id_cliente', valor2: uid, 
                    campo3: 'id_compra', valor3: uidCompra 
                });
            }
    
            // Ordenar los mensajes por fecha de creación
            if (Array.isArray(fetchedMessages)) {
                fetchedMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            }
    
            // Compara los mensajes cargados con los mensajes actuales para evitar actualizaciones innecesarias
            if (Array.isArray(fetchedMessages) && JSON.stringify(fetchedMessages) !== JSON.stringify(previousMessages.current)) {
                setMessages(fetchedMessages);
                previousMessages.current = fetchedMessages;
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al cargar los datos.');
        }
    }, [uidCliente, uidConductor]); // Añadida dependencia de uidConductor
    
    const inicializarDatos = useCallback(async () => {
        try {
            const uidCompra = await AsyncStorage.getItem('uid_compra');

            if (!uidCompra) {
                Alert.alert('Error', 'UID de compra no encontrado.');
                return;
            }

            const additionalData = await fetch_Data('carrito_ven_t', 'uid_cliente,uid_conductor', { campo: 'uid_compra', valor: uidCompra });
            const fetchedUidCliente = additionalData[0]?.uid_cliente;
            const fetchedUidConductor= additionalData[0]?.uid_conductor;
            setUidCliente(fetchedUidCliente); // Setea uidCliente una vez
            setUidConductor(fetchedUidConductor);
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al inicializar los datos.');
        }
    }, []);

    useEffect(() => {
        inicializarDatos(); // Inicializa uidCliente al cargar el componente

        const intervalId = setInterval(cargarDatos, 2000); // Luego carga datos cada 2 segundos
        return () => clearInterval(intervalId);
    }, [inicializarDatos, cargarDatos]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };
    

    const handleSendMessage = async () => {
        try {
            const uid = await AsyncStorage.getItem('userUid');
            const uidCompra = await AsyncStorage.getItem('uid_compra');

            if (!uid || !uidCompra) {
                Alert.alert('Error', 'UID de usuario o UID de compra no encontrado.');
                return;
            }
            const rol = await AsyncStorage.getItem('rol');
            var send = '';    
            if (rol === 'Conductor') {
                send = 'Conductor';
            } else {
                send = 'Usuario';
            }
            const newMessage = {
                content: message,
                created_at: new Date().toISOString(),
                id_cliente: uidCliente,
                id_conductor: uidConductor,
                id_compra: uidCompra,
                send_by: send
            };

            await insert_Data('messages', newMessage);
            setMessage('');
            cargarDatos(); // Recarga los datos para incluir el nuevo mensaje
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al enviar el mensaje.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <CabeCompo />
            </View>
            <View style={styles.chatContainer}>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id_conductor + item.created_at}
                    renderItem={({ item }) => (
                        <View style={styles.messageContainer}>
                            <Text style={styles.senderText}>
                                {item.send_by}
                            </Text>
                            <Text style={styles.messageText}>
                                {item.content}
                            </Text>
                            <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
                        </View>
                    )}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Escribe un mensaje..."
                    placeholderTextColor="#888"
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 120,
        backgroundColor: 'white',
    },
    
    chatContainer: {
        flex: 1,
        padding: 10,
    },
    messageContainer: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    senderText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3B6D7B',

    },
    messageText: {
        fontSize: 16,
        color: '#000',
        marginTop: 5,
    },
    dateText: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    input: {
        flex: 1,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#3B6D7B',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Chat;

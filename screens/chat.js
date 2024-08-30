import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Alert, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch_Data, insert_Data } from '../SupaConsult';
import CabeCompo from './CabeCompo';

const { height } = Dimensions.get('window');

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [uidClienteFetched, setUidClienteFetched] = useState(false);
    const [uidCliente, setUidCliente] = useState(null);

    const cargarDatos = useCallback(async () => {
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
                fetchedMessages = await fetch_Data('messages', 'content,created_at,id_cliente,id_conductor', { campo: 'id_conductor', valor: uid });
            } else {
                fetchedMessages = await fetch_Data('messages', 'content,created_at,id_cliente,id_conductor', { campo: 'id_cliente', valor: uid });
            }

            if (!uidClienteFetched) {
                const additionalData = await fetch_Data('carrito_ven_t', 'uid_cliente', { campo: 'uid_compra', valor: uidCompra });
                const fetchedUidCliente = additionalData[0]?.uid_cliente;
                setUidCliente(fetchedUidCliente);
                setUidClienteFetched(true);
            }

            // Filtra los mensajes según el resultado de la búsqueda adicional
            if (uidCliente) {
                fetchedMessages = fetchedMessages.filter(message => message.id_cliente === uid);
            }

            if (Array.isArray(fetchedMessages)) {
                setMessages(fetchedMessages);
            } else {
                Alert.alert('Error', 'No se pudieron cargar los mensajes.');
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al cargar los datos.');
        }
    }, [uidCliente, uidClienteFetched]);

    useEffect(() => {
        cargarDatos();
        const intervalId = setInterval(cargarDatos, 2000);
        return () => clearInterval(intervalId);
    }, [cargarDatos]);

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

            const newMessage = {
                content: message,
                created_at: new Date().toISOString(),
                id_cliente: uid,
                id_conductor: uid, // Cambia esto si necesitas un id diferente para el conductor

            };

            await insert_Data('messages', newMessage);
            setMessage('');
            cargarDatos(); // Asegúrate de que esta función esté definida
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
                    keyExtractor={(item) => item.id_conductor + item.created_at} // Usa una combinación única de campos como clave
                    renderItem={({ item }) => (
                        <View style={styles.messageContainer}>
                            <Text style={styles.messageText}>{item.content}</Text>
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
        height: 150,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
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
    messageText: {
        fontSize: 16,
        color: '#000',
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

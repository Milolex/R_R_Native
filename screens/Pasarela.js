import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { insert_Data } from '../SupaConsult';
import LottieView from 'lottie-react-native';



const windowHeight = Dimensions.get('window').height;
const rectangleHeight = windowHeight / 2;

const Pasarela = ({ route }) => {
    const navigation = useNavigation();
    const { costoTotal, dato } = route.params;  // Recibe el 'dato' que contiene toda la información para insertar

    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardType, setCardType] = useState('');
    const [formattedCost, setFormattedCost] = useState('');

    // Formatear costo al entrar
    useEffect(() => {
        setFormattedCost(formatCurrency(costoTotal));
    }, [costoTotal]);

    const handlePayment = async () => {
        if (!cardNumber || !expiryDate || !cvc) {
            Alert.alert('Error', 'Por favor complete todos los campos.');
            return;
        }
        try {
            
            Alert.alert('Pago Exitoso', `El pago de $${formattedCost} ha sido realizado con éxito.`);
            await insert_Data('carrito_ven_t', dato);  
            navigation.goBack();
        } catch (error) {
            console.error('Error en la transacción o inserción:', error);
            Alert.alert('Error', 'Hubo un error al procesar la transacción.');
        }
    };

    const detectCardType = (number) => {
        if (number.startsWith('4')) {
            setCardType('Visa');
        } else if (number.startsWith('5')) {
            setCardType('MasterCard');
        } else {
            setCardType('');
        }
    };

    const formatCardNumber = (text) => {
        const cleaned = text.replace(/\s+/g, '');  
        const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumber(formatted);
        detectCardType(cleaned);
    };

    const formatExpiryDate = (text) => {
        const cleaned = text.replace(/\D/g, '');  
        if (cleaned.length <= 2) {
            setExpiryDate(cleaned);
        } else {
            const month = cleaned.slice(0, 2);
            const year = cleaned.slice(2, 4);
            setExpiryDate(`${month}/${year}`);
        }
    };

    const formatCurrency = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <LottieView
                source={require('../assets/targ.json')}
                autoPlay
                loop
                style={{
                    width: rectangleHeight / 2,
                    height: rectangleHeight / 2,
                    position: 'absolute',
                    top: 0,
                    marginTop: '10%',  
                }}
            />
            
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Pasarela de Pagos</Text>
            </View>

            <View style={styles.cardInfo}>
                <Text style={styles.label}>Número de Tarjeta</Text>
                <View style={styles.cardInputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="#### #### #### ####"
                        keyboardType="numeric"
                        maxLength={19} 
                        value={cardNumber}
                        onChangeText={formatCardNumber}
                    />
                    {cardType && (
                        <Image 
                            style={styles.cardLogo}
                            source={cardType === 'Visa' ? require('../assets/visa.png') : require('../assets/mastercard.png')} 
                        />
                    )}
                </View>

                <View style={styles.inputRow}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Fecha de Expiración</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="MM/AA"
                            keyboardType="numeric"
                            maxLength={5}  
                            value={expiryDate}
                            onChangeText={formatExpiryDate}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>CVC</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="###"
                            keyboardType="numeric"
                            maxLength={3}
                            value={cvc}
                            onChangeText={setCvc}
                        />
                    </View>
                </View>
            </View>

            <Text style={styles.costText}>Total a Pagar: ${formattedCost}</Text>

            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
                <Text style={styles.payButtonText}>Realizar Pago</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 50,
        backgroundColor: '#fffff6',
    },
    headerContainer: {
        marginBottom: 10,  
        alignItems: 'center',
    },
    headerText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
    },
    cardInfo: {
        width: '100%',
        marginTop: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '400',
        color: '#333',
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        backgroundColor: 'white',
    },
    cardInputContainer: {
        position: 'relative',
        width: '100%',
        marginTop: 10,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    inputContainer: {
        width: '48%',
    },
    cardLogo: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -12 }],
        width: 30,
        height: 20,
        resizeMode: 'contain',
    },
    costText: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '600',
        marginTop: 20,
        color: '#3B6D7B',
    },
    payButton: {
        backgroundColor: '#3B6D7B',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    payButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
};

export default Pasarela;




//Create By: Camilo Andres Martínez Gualteros 2024
// screens/RecoveryScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { reset_password, change_password, val_otp } from '../SupaConsult'; 
import { useNavigation } from '@react-navigation/native';

const RecoveryScreen = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);

    const handleRecoverPassword = async () => {
        try {
            await reset_password(email);
            Alert.alert('Recuperación de Contraseña', `Se ha enviado un correo a ${email} si está registrado.`);
            setIsCodeSent(true);
        } catch (error) {
            console.error('Error al enviar el correo de recuperación:', error.message);
            Alert.alert('Error', 'No se pudo enviar el correo de recuperación. Inténtalo de nuevo.');
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }
        try {
            const isCodeValid = await val_otp(email, code);
            if (!isCodeValid) {
                Alert.alert('Error', 'El código de verificación es inválido.');
                return;
            }
            
            
            await change_password(newPassword);
            Alert.alert('Éxito', 'La contraseña ha sido cambiada exitosamente.');
            
            
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error.message);
            Alert.alert('Error', 'No se pudo cambiar la contraseña. Inténtalo de nuevo.');
        }
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Icon name="email" size={100} color="#3B6D7B" />
            </View>
            <Text style={styles.title}>Recuperación de Contraseña</Text>
            <Text style={styles.subtitle}>
                {isCodeSent
                    ? 'Introduce el código recibido y tu nueva contraseña.'
                    : 'Introduce tu correo electrónico para recibir instrucciones.'}
            </Text>
            {!isCodeSent ? (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Button title="Enviar Correo" onPress={handleRecoverPassword} color="#3B6D7B" />
                </>
            ) : (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={false} 
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Código"
                        value={code}
                        onChangeText={setCode}
                        keyboardType="numeric"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nueva Contraseña"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar Contraseña"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                    <Button title="Cambiar" onPress={handleChangePassword} color="#3B6D7B" />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#EAEAEA',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3B6D7B',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#3B6D7B',
        borderWidth: 2,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        fontSize: 16,
    },
});

export default RecoveryScreen;







//Create By: Camilo Andres Martínez Gualteros 2024
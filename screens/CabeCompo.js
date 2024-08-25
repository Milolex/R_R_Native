import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

const windowHeight = Dimensions.get('window').height;
const rectangleHeight = windowHeight / 2;

const CabeCompo = () => {
    const navigation = useNavigation();

    const goToAnotherScreen = () => {
        navigation.navigate('Perfil');
    };

    return (
        <View>
            <TouchableOpacity onPress={goToAnotherScreen}>
                <View style={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height / 7,
                    backgroundColor: '#3B6D7B',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                }}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={{
                            width: 50,
                            height: 50,
                            position: 'absolute',
                            left: 0,
                            marginTop: 65,
                            marginLeft: 20,
                        }}
                    />
                    <Text style={{
                        color: '#ffffff',
                        fontSize: 20,
                        marginTop: 75,
                        marginLeft: 80,
                        position: 'absolute',
                        left: 0,
                    }}>Raices Rurales</Text>
                    
                    
                </View>
                
            </TouchableOpacity>
            <Ionicons name="log-out" size={24} color="white" style={{ color: '#ffffff',
                        
                        marginTop: 75,
                        marginLeft: 250,
                        position: 'absolute',
                        left: 0,}}onPress={
                            () => {
                                navigation.navigate('Login');
                            }
                        }/>

        </View>
        
        
        
    );
};

export default CabeCompo;

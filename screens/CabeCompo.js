import { StyleSheet, View, Image, Text, Dimensions} from 'react-native';
const windowHeight = Dimensions.get('window').height;
const rectangleHeight = windowHeight / 2;


const CabeCompo = () => {
    return (
        <View style={{
            width: (Dimensions.get('window').width),
            height:(Dimensions.get('window').height)/7,
            backgroundColor: '#3B6D7B',
            position: 'absolute',
            top:0,
            right:0,
        }}>
            <Image
                source={require('../assets/logo.png')}
                style={{
                    width:50,
                    height: 50,
                    position: 'absolute',
                    left: 0,
                    marginTop: 65,
                    marginLeft: 20,
                    
                }}
            />
            <Text style={
                styles={
                    color:'#ffffff',
                    fontSize:20,
                    marginTop:75,
                    marginLeft: 80,
                    position:'absolute',
                    left:0,
                }
                }>Raices Rurales</Text>
    </View>
    );
};

export default CabeCompo;

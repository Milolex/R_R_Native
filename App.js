import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import Rutas from './screens/Rutas';
import Conductor from './screens/Conductor';
import Register from './screens/Register';
import Detalle_Ruta from './screens/Detalle_Ruta';
import Chat from './screens/chat';
export default function App() {
  const Stack = createStackNavigator();
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen name="Login" component={Login} 
            options={
              {headerShown: false}
            }
          />
          <Stack.Screen name="Conductor" component={Conductor} 
            options={
              {headerShown: false}
            }
          />
          <Stack.Screen name="Rutas" component={Rutas} 
            options={
              {headerShown: false}
            }
          />
          <Stack.Screen name="Register" component={Register} 
            options={
              {headerShown: false}
            }
          />
          <Stack.Screen name="Detalle_Ruta" component={Detalle_Ruta} 
            options={
              {headerShown: false}
            }
          />
          <Stack.Screen name="Chat" component={Chat} 
            options={
              {headerShown: false}
            }
          />
          
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff',
  },
});

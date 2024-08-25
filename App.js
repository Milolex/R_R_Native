import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import Home from './screens/Home';
import Conductor from './screens/Conductor';
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
          <Stack.Screen name="Home" component={Home} 
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

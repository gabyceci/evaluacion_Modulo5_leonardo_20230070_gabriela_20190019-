// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext';
import Home from './src/screens/Home';
import Login from './src/screens/Login';
import Register from './src/screens/Register';

// Polyfill para base64
if (typeof global.btoa === 'undefined') {
  global.btoa = function(str) {
    return Buffer.from(str, 'binary').toString('base64');
  };
}

if (typeof global.atob === 'undefined') {
  global.atob = function(b64Encoded) {
    return Buffer.from(b64Encoded, 'base64').toString('binary');
  };
}

const Stack = createStackNavigator();

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerShown: false, // Oculta el header por defecto si tienes tu propio Navigation
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
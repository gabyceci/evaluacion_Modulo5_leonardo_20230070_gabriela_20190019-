// src/components/Navigation.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';

const Navigation = () => {
  const { currentUser } = useAuth();
  const { logoutUser } = useUser();
  const navigation = useNavigation();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      console.log('Sesión cerrada exitosamente');
      navigation.navigate('Login');
    }
  };

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  // Si el usuario está autenticado, mostrar navegación completa
  if (currentUser) {
    return (
      <View style={styles.navbar}>
        <View style={styles.container}>
          <View style={styles.navContent}>
            {/* Logo/Brand */}
            <TouchableOpacity 
              style={styles.brand}
              onPress={() => navigateTo('Home')}
            >
              <Text style={styles.emoji}>📊</Text>
              <Text style={styles.brandText}>Sistema de Evaluación</Text>
            </TouchableOpacity>

            {/* Navigation Links */}
            <View style={styles.navLinks}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigateTo('Home')}
              >
                <Text style={styles.navButtonText}>Inicio</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigateTo('Evaluaciones')}
              >
                <Text style={styles.navButtonText}>Evaluaciones</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigateTo('Modulos')}
              >
                <Text style={styles.navButtonText}>Módulos</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => navigateTo('Reportes')}
              >
                <Text style={styles.navButtonText}>Reportes</Text>
              </TouchableOpacity>
            </View>

            {/* User Menu */}
            <View style={styles.userMenu}>
              <Text style={styles.greeting}>
                Hola, {currentUser?.displayName || 'Usuario'}
              </Text>
              
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Si el usuario NO está autenticado, mostrar navegación simple
  return (
    <View style={styles.navbar}>
      <View style={styles.container}>
        <View style={styles.navContent}>
          {/* Logo/Brand */}
          <TouchableOpacity 
            style={styles.brand}
            onPress={() => navigateTo('Home')}
          >
            <Text style={styles.emoji}>📊</Text>
            <Text style={styles.brandText}>Sistema de Evaluación</Text>
          </TouchableOpacity>

          {/* Auth Links */}
          <View style={styles.authLinks}>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => navigateTo('Login')}
            >
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigateTo('Register')}
            >
              <Text style={styles.registerButtonText}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  container: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    paddingHorizontal: 16,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  userMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  greeting: {
    fontSize: 14,
    color: '#374151',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  authLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  loginButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  registerButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Navigation;
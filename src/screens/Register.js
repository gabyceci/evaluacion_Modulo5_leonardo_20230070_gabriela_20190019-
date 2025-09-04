// src/screens/Register.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    tituloUniversitario: '',
    anoGraduacion: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { currentUser, register } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (currentUser) {
      navigation.navigate('Home');
    }
  }, [currentUser, navigation]);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El correo electrónico no es válido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.tituloUniversitario.trim()) {
      errors.tituloUniversitario = 'El título universitario es requerido';
    }

    if (!formData.anoGraduacion) {
      errors.anoGraduacion = 'El año de graduación es requerido';
    } else {
      const currentYear = new Date().getFullYear();
      const year = parseInt(formData.anoGraduacion);
      if (isNaN(year) || year < 1950 || year > currentYear) {
        errors.anoGraduacion = `El año debe estar entre 1950 y ${currentYear}`;
      }
    }

    return errors;
  };

  const handleSubmit = async () => {
    console.log('Iniciando registro...');
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      console.log('Errores de validación:', errors);
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Llamando a la función register...');
      const result = await register(formData.email, formData.password, {
        nombre: formData.nombre,
        tituloUniversitario: formData.tituloUniversitario,
        anoGraduacion: formData.anoGraduacion
      });
      
      console.log('Resultado del registro:', result);
      setIsLoading(false);
      
      if (result && result.success) {
        Alert.alert(
          'Registro exitoso',
          'Tu cuenta ha sido creada exitosamente',
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
        );
      } else {
        const errorMessage = result?.error || 'Ha ocurrido un error desconocido';
        const errorCode = result?.errorCode || 'unknown';
        
        console.error('Error de registro:', errorMessage);
        console.error('Código de error:', errorCode);
        setError(errorMessage);
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Error inesperado en registro:', err);
      setError('Ha ocurrido un error inesperado. Intenta de nuevo.');
    }
  };

  const getInputStyle = (fieldName) => {
    return formErrors[fieldName] ? [styles.input, styles.inputError] : styles.input;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Registro de Usuario</Text>
            <Text style={styles.subtitle}>
              Crea tu cuenta en el Sistema de Evaluación
            </Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nombre Completo *</Text>
            <TextInput
              style={getInputStyle('nombre')}
              value={formData.nombre}
              onChangeText={(value) => handleChange('nombre', value)}
              placeholder="Tu nombre completo"
              autoCapitalize="words"
            />
            {formErrors.nombre && (
              <Text style={styles.fieldError}>{formErrors.nombre}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Correo Electrónico *</Text>
            <TextInput
              style={getInputStyle('email')}
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {formErrors.email && (
              <Text style={styles.fieldError}>{formErrors.email}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Contraseña *</Text>
            <TextInput
              style={getInputStyle('password')}
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              autoComplete="password-new"
            />
            {formErrors.password && (
              <Text style={styles.fieldError}>{formErrors.password}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Confirmar Contraseña *</Text>
            <TextInput
              style={getInputStyle('confirmPassword')}
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              placeholder="Confirma tu contraseña"
              secureTextEntry
              autoComplete="password-new"
            />
            {formErrors.confirmPassword && (
              <Text style={styles.fieldError}>{formErrors.confirmPassword}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Título Universitario *</Text>
            <TextInput
              style={getInputStyle('tituloUniversitario')}
              value={formData.tituloUniversitario}
              onChangeText={(value) => handleChange('tituloUniversitario', value)}
              placeholder="Ej: Ingeniero en Sistemas, Licenciado en Educación"
              autoCapitalize="words"
            />
            {formErrors.tituloUniversitario && (
              <Text style={styles.fieldError}>{formErrors.tituloUniversitario}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Año de Graduación *</Text>
            <TextInput
              style={getInputStyle('anoGraduacion')}
              value={formData.anoGraduacion}
              onChangeText={(value) => handleChange('anoGraduacion', value)}
              placeholder="2020"
              keyboardType="numeric"
            />
            {formErrors.anoGraduacion && (
              <Text style={styles.fieldError}>{formErrors.anoGraduacion}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              ¿Ya tienes una cuenta?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Inicia sesión aquí</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.backButtonText}>← Volver al inicio</Text>
          </TouchableOpacity>

          <View style={styles.infoPanel}>
            <Text style={styles.infoPanelTitle}>ℹ️ Información importante:</Text>
            <Text style={styles.infoPanelText}>• Todos los campos marcados con (*) son obligatorios</Text>
            <Text style={styles.infoPanelText}>• Tu contraseña debe tener al menos 6 caracteres</Text>
            <Text style={styles.infoPanelText}>• El email será usado para iniciar sesión</Text>
            <Text style={styles.infoPanelText}>• La información académica es requerida para el sistema</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  fieldError: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#86efac',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  linkText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 12,
  },
  infoPanel: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  infoPanelTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoPanelText: {
    fontSize: 12,
    color: '#1e40af',
    marginBottom: 4,
  },
});

export default Register;
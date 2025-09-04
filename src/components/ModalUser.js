// src/components/ModalUser.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';

const ModalUser = ({ 
  isOpen, 
  onClose, 
  mode, 
  formData, 
  updateField,
  onSwitchToRegister,
  onSwitchToLogin,
  onSuccess 
}) => {
  const { currentUser } = useAuth();
  const { isLoading, error, registerUser, loginUser, updateUser, clearError } = useUser();

  const handleSubmit = async () => {
    clearError();

    let result;
    
    switch (mode) {
      case 'register':
        result = await registerUser(formData);
        break;
      case 'login':
        result = await loginUser(formData.email, formData.password);
        break;
      case 'edit':
        result = await updateUser(formData, formData.newPassword || null);
        break;
      default:
        return;
    }

    if (result.success) {
      onClose();
      if (onSuccess) {
        onSuccess(mode);
      }
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Iniciar Sesión';
      case 'register': return 'Registro de Usuario';
      case 'edit': return 'Editar Información del Usuario';
      default: return '';
    }
  };

  const renderLoginForm = () => (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => updateField('email', text)}
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={formData.password}
          onChangeText={(text) => updateField('password', text)}
          placeholder="Tu contraseña"
          secureTextEntry
          autoCapitalize="none"
        />
      </View>
    </>
  );

  const renderRegisterForm = () => (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          value={formData.nombre}
          onChangeText={(text) => updateField('nombre', text)}
          placeholder="Tu nombre completo"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo Electrónico *</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => updateField('email', text)}
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña *</Text>
        <TextInput
          style={styles.input}
          value={formData.password}
          onChangeText={(text) => updateField('password', text)}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Título Universitario *</Text>
        <TextInput
          style={styles.input}
          value={formData.tituloUniversitario}
          onChangeText={(text) => updateField('tituloUniversitario', text)}
          placeholder="Ej: Ingeniero en Sistemas"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Año de Graduación *</Text>
        <TextInput
          style={styles.input}
          value={formData.anoGraduacion}
          onChangeText={(text) => updateField('anoGraduacion', text)}
          placeholder="2020"
          keyboardType="numeric"
        />
      </View>
    </>
  );

  const renderEditForm = () => (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={formData.nombre}
          onChangeText={(text) => updateField('nombre', text)}
          placeholder="Tu nombre completo"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={formData.email}
          editable={false}
        />
        <Text style={styles.helpText}>El email no se puede cambiar</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Título Universitario</Text>
        <TextInput
          style={styles.input}
          value={formData.tituloUniversitario}
          onChangeText={(text) => updateField('tituloUniversitario', text)}
          placeholder="Ej: Ingeniero en Sistemas"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Año de Graduación</Text>
        <TextInput
          style={styles.input}
          value={formData.anoGraduacion}
          onChangeText={(text) => updateField('anoGraduacion', text)}
          placeholder="2020"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.separator}>
        <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña Actual</Text>
          <TextInput
            style={styles.input}
            value={formData.currentPassword}
            onChangeText={(text) => updateField('currentPassword', text)}
            placeholder="Tu contraseña actual"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nueva Contraseña</Text>
          <TextInput
            style={styles.input}
            value={formData.newPassword}
            onChangeText={(text) => updateField('newPassword', text)}
            placeholder="Nueva contraseña (opcional)"
            secureTextEntry
            autoCapitalize="none"
          />
          <Text style={styles.helpText}>
            Deja en blanco si no quieres cambiar la contraseña
          </Text>
        </View>
      </View>
    </>
  );

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{getTitle()}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {mode === 'login' && renderLoginForm()}
          {mode === 'register' && renderRegisterForm()}
          {mode === 'edit' && renderEditForm()}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              style={[styles.submitButton, isLoading && styles.disabledButton]}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {mode === 'login' ? 'Iniciar Sesión' :
                   mode === 'register' ? 'Registrarse' :
                   'Actualizar Información'}
                </Text>
              )}
            </TouchableOpacity>

            {mode === 'login' && (
              <TouchableOpacity onPress={onSwitchToRegister} style={styles.switchButton}>
                <Text style={styles.switchButtonText}>
                  ¿No tienes cuenta? Regístrate
                </Text>
              </TouchableOpacity>
            )}

            {mode === 'register' && (
              <TouchableOpacity onPress={onSwitchToLogin} style={styles.switchButton}>
                <Text style={styles.switchButtonText}>
                  ¿Ya tienes cuenta? Inicia sesión
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  separator: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
  },
  buttonContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ModalUser;
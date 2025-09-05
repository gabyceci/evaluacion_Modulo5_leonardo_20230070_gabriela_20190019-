// src/screens/HomeScreen.js
import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useModalUser } from '../hooks/useModalUser';
import { useUser } from '../hooks/useUser';
import ModalUser from '../components/ModalUser';

const HomeScreen = () => {
  const { currentUser, userData } = useAuth();
  const { logoutUser } = useUser();
  const navigation = useNavigation();
  
  const {
    isModalOpen,
    modalMode,
    formData,
    openLoginModal,
    openRegisterModal,
    openEditModal,
    closeModal,
    updateField,
    switchToRegister,
    switchToLogin
  } = useModalUser();

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, cerrar sesión", 
          style: "destructive",
          onPress: async () => {
            const result = await logoutUser();
            if (result.success) {
              console.log('Sesión cerrada exitosamente');
              // No necesitamos navegar manualmente, el logout ya maneja eso
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    openEditModal({ ...currentUser, ...userData });
  };

  const handleModalSuccess = (mode) => {
    switch (mode) {
      case 'login':
        Alert.alert('Éxito', '¡Bienvenido! Login exitoso');
        break;
      case 'register':
        Alert.alert('Éxito', '¡Cuenta creada! Registro exitoso');
        break;
      case 'edit':
        Alert.alert('Éxito', 'Perfil actualizado exitosamente');
        break;
    }
  };

  // Componente para usuarios no autenticados
  const UnauthenticatedView = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      <LinearGradient
        colors={['#EFF6FF', '#E0F2FE', '#DBEAFE']}
        style={styles.gradientContainer}
      >
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeEmoji}></Text>
            <Text style={styles.title}>Sistema de Evaluación Académica</Text>
            <Text style={styles.subtitle}>
              Plataforma educativa moderna para gestión académica y seguimiento estudiantil
            </Text>
            
            
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={openLoginModal}
              >
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.registerButton}
                onPress={openRegisterModal}
              >
                <Text style={styles.registerButtonText}>Crear Cuenta</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.alternativeOptions}>
              <TouchableOpacity
                style={styles.guestButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.guestButtonText}>Ver página de login →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );

  // Componente para usuarios autenticados
  const AuthenticatedView = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
           
            
           
          </View>
          
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>
              Bienvenido, {userData?.nombre || currentUser?.displayName || 'Usuario'}
            </Text>
          </View>
        </View>
      </View>

       <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditProfile}
              >
                <Text style={styles.editButtonText}> Editar Perfil</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}> Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentCard}>
          <Text style={styles.panelTitle}>Panel Principal</Text>
          
          {/* User Info Card */}
          <View style={styles.userInfoCard}>
            <Text style={styles.userInfoTitle}>Información del Usuario</Text>
            
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Nombre</Text>
                <Text style={styles.infoValue}>
                  {userData?.nombre || currentUser?.displayName || 'No especificado'}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Correo Electrónico</Text>
                <Text style={styles.infoValue}>{currentUser?.email}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Título Universitario</Text>
                <Text style={styles.infoValue}>
                  {userData?.tituloUniversitario || 'No especificado'}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Año de Graduación</Text>
                <Text style={styles.infoValue}>
                  {userData?.anoGraduacion || 'No especificado'}
                </Text>
              </View>
            </View>
          </View>

          {/* Welcome Message */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeCardTitle}>¡Bienvenido al Sistema!</Text>
            <Text style={styles.welcomeCardText}>
              Has iniciado sesión exitosamente en el Sistema de Evaluación Académica. 
              Tu perfil está configurado y listo para usar.
            </Text>
            <Text style={styles.welcomeCardSubtext}>
              Puedes actualizar tu información personal usando el botón "Editar Perfil" 
              en cualquier momento.
            </Text>
          </View>

          
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <>
      {currentUser ? <AuthenticatedView /> : <UnauthenticatedView />}
      
      <ModalUser
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        formData={formData}
        updateField={updateField}
        onSwitchToRegister={switchToRegister}
        onSwitchToLogin={switchToLogin}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  welcomeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    padding: 24,
    width: '100%',
    maxWidth: 380,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresList: {
    alignSelf: 'stretch',
    marginBottom: 32,
  },
  featureItem: {
    fontSize: 14,
    color: '#059669',
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  registerButtonText: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  alternativeOptions: {
    marginTop: 16,
  },
  guestButton: {
    paddingVertical: 8,
  },
  guestButtonText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerContent: {
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  welcomeSection: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  welcomeText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  contentCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
    marginBottom: 16,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  userInfoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 12,
  },
  infoGrid: {
    gap: 8,
  },
  infoItem: {
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#1E3A8A',
  },
  welcomeCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  welcomeCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 8,
  },
  welcomeCardText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
    marginBottom: 8,
  },
  welcomeCardSubtext: {
    fontSize: 13,
    color: '#059669',
    fontStyle: 'italic',
  },
  statusCard: {
    backgroundColor: '#FEFCE8',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EAB308',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  statusBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  statusInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
    color: '#A16207',
  },
});

export default HomeScreen;
# Evaluación Módulo 5 - Leonardo & Gabriela

## Descripción
Aplicación móvil desarrollada como proyecto de evaluación para el Módulo 5.

## Estudiantes
- **Leonardo Benjamin Monterrosa Nuñez** - Código: 20230070
- **Gabriela Cecibel Arévalo Molina** - Código: 20190019

## Características Principales
- Navegación por pestañas (Bottom Tabs)
- Navegación por stack
- Gestión de estado con AsyncStorage
- Integración con Firebase
- Detección de conectividad de red
- Interfaz responsiva y segura

## Tecnologías Utilizadas
- **React Native** v0.79.5
- **Expo** v53.0.22
- **Firebase** v12.2.1
- **React Navigation** v7.x

## Dependencias

### Dependencias Principales
- `@react-native-async-storage/async-storage`: Almacenamiento local persistente
- `@react-native-community/netinfo`: Detección de conectividad de red
- `@react-navigation/bottom-tabs`: Navegación por pestañas inferiores
- `@react-navigation/native`: Core de navegación
- `@react-navigation/stack`: Navegación por stack
- `expo`: Framework de desarrollo
- `expo-constants`: Acceso a constantes del sistema
- `expo-image-picker`: Selección de imágenes
- `expo-linear-gradient`: Gradientes lineales
- `expo-status-bar`: Gestión de la barra de estado
- `firebase`: Backend como servicio
- `react`: Librería principal
- `react-dom`: DOM virtual
- `react-native`: Framework móvil
- `react-native-gesture-handler`: Gestos táctiles
- `react-native-safe-area-context`: Áreas seguras
- `react-native-screens`: Optimización de pantallas

### Dependencias de Desarrollo
- `@babel/core`: Transpilador JavaScript

## Instalación

1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias
```bash
npm install
```

3. Iniciar el proyecto
```bash
npm start
```


## Requisitos del Sistema

- Node.js 18 o superior
- Expo CLI
- Android Studio (para Android)
- Xcode (para iOS)

## Video Demostrativo

https://drive.google.com/drive/folders/1zGvqNFU8IehmIb__qiq0HlWclbuGIOEE?usp=sharing

<img width="1319" height="633" alt="image" src="https://github.com/user-attachments/assets/7e17bc1b-d572-4733-aba8-b077585395c3" />

## Estructura del Proyecto

```
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── screens/        # Pantallas de la aplicación
│   ├── navigation/     # Configuración de navegación
│   ├── services/       # Servicios (Firebase, API)
│   └── utils/          # Utilidades
├── assets/             # Recursos estáticos
├── App.js             # Componente principal
└── package.json       # Configuración del proyecto
```

## Notas Importantes

- La aplicación utiliza Expo SDK 53
- Se requiere conexión a internet para las funcionalidades de Firebase
- La detección de conectividad se maneja automáticamente
- El almacenamiento local persiste entre sesiones

## Soporte

Para consultas sobre el proyecto, contactar a los desarrolladores:
- Leonardo (20230070@ricaldone.edu.sv)
- Gabriela (20190019@ricaldone.edu.sv)

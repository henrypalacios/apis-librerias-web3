# 🦑 Aplicación de Interacción con Contratos Inteligentes Ink! en Polkadot

## 📝 Descripción

Esta aplicación React permite interactuar con contratos inteligentes Ink! en la red Polkadot. Utiliza tanto PolkadotJS como la biblioteca `useInkathon` para establecer conexiones y gestionar cuentas.

## 🚀 Características

- 🔗 Conexión a la red Polkadot
- 👛 Gestión de cuentas de usuario
- 💼 Visualización de saldos
- 🔄 Conexión/desconexión de wallet

## 🛠️ Tecnologías utilizadas

- React ⚛️
- TypeScript 📘
- Vite ⚡
- PolkadotJS 🕸️
- useInkathon 🦑

## 🏗️ Estructura del proyecto

```sh
polkadot-ink-app/
├── src/
│ ├── components/
│ │ ├── PolkadotJSConnection.tsx
│ │ └── UseInkathonConnection.tsx
│ └── App.tsx
└── package.json
```

## 📚 Componentes principales

### App.tsx

Este es el componente principal que envuelve toda la aplicación con el proveedor `UseInkathonProvider` y renderiza los componentes `PolkadotJSConnection` y `UseInkathonConnection`.

### PolkadotJSConnection

Este componente establece una conexión con la red Polkadot utilizando PolkadotJS y muestra información básica sobre la conexión y las cuentas disponibles.

### UseInkathonConnection

Este componente utiliza la biblioteca `useInkathon` para gestionar la conexión de la wallet y mostrar información de la cuenta y el saldo.

## 🚦 Cómo empezar

1. Clona el repositorio
2. Instala las dependencias con `npm install`
3. Inicia la aplicación con `npm run dev`
4. Abre tu navegador y visita `http://localhost:5173`

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o realiza un pull request para sugerir cambios o mejoras.

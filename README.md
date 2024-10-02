# 🦑 Aplicación Counter DApp con Ink! en Polkadot

## 📝 Descripción

Esta aplicación React permite interactuar con un contrato inteligente Counter desarrollado en Ink! en la red Polkadot. Utiliza PolkadotJS para establecer conexiones y gestionar cuentas.

## 🚀 Características

- 🔗 Conexión a la red Polkadot
- 👛 Gestión de cuentas de usuario
- 🔢 Interacción con el contrato Counter (incrementar, decrementar, reiniciar)
- 💼 Visualización del valor del contador
- 🔄 Conexión/desconexión de wallet

## 🛠️ Tecnologías utilizadas

- React ⚛️
- TypeScript 📘
- Vite ⚡
- PolkadotJS 🕸️

## 🏗️ Estructura del proyecto

```sh
counter-web3-example/
├── src/
│ ├── components/
│ │ ├── CounterCard/
│ │ │ └── index.tsx
│ │ └── ui/
│ │ ├── Button.tsx
│ │ ├── Card.tsx
│ │ └── ConnectionStatus.tsx
│ ├── constants.ts
│ ├── App.tsx
│ └── styles.css
├── contracts/
│ └── ink/
│ └── counter/
│ └── target/
│ └── ink/
│ └── counter.json
├── package.json
└── .env.example
```

## 📚 Componentes principales

### App.tsx

Este es el componente principal que renderiza el `CounterCard`.

### CounterCard/index.tsx

Este componente maneja la conexión con la red Polkadot, la interacción con el contrato Counter y la interfaz de usuario para incrementar, decrementar y reiniciar el contador.

## 🔧 Variables importantes

En el archivo `src/components/CounterCard/index.tsx`, hay tres variables cruciales que debes configurar correctamente:

- `CONTRACT_ADDRESS`: La dirección del contrato Counter desplegado en la red.
- `CONTRACT_ABI`: El ABI del contrato, que se importa desde el archivo JSON generado al compilar el contrato.
- `WS_PROVIDER`: La URL del proveedor WebSocket para conectarse a la red Polkadot.

Para editar estas variables:

1. Actualiza `CONTRACT_ADDRESS` con la dirección de tu contrato desplegado.
2. Asegúrate de que el archivo `counter.json` esté en la ruta correcta y contenga el ABI actualizado.
3. Configura `VITE_WS_PROVIDER` en tu archivo `.env` o modifica el valor por defecto en el código.

## 🚦 Cómo empezar

1. Clona el repositorio
2. Instala las dependencias con `npm install`
3. (Opcional, para usar deploy.ts) Copia el archivo `.env.example` a `.env` y configura la variable `VITE_WS_PROVIDER` con la dirección de tu nodo Polkadot
4. Asegúrate de que el archivo `counter.json` esté presente en la carpeta `contracts/ink/counter/target/ink/`
5. Actualiza `CONTRACT_ADDRESS` en `src/components/CounterCard/index.tsx` con la dirección de tu contrato desplegado
6. Inicia la aplicación con `npm run dev`
7. Abre tu navegador y visita `http://localhost:5173`

## 📝 Notas importantes

- Asegúrate de tener una extensión de wallet de Polkadot (como PolkadotJS) instalada en tu navegador para interactuar con la DApp.
- El contrato Counter debe estar desplegado en la red que estés utilizando. Asegúrate de actualizar la dirección del contrato y el proveedor WebSocket según corresponda.

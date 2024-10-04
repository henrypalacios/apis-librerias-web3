# 🦑 Aplicación Counter DApp con Ink! en Polkadot

## 📝 Descripción

Esta aplicación React permite interactuar con un contrato inteligente Counter desarrollado en Ink! en la red basada en Polkadot SDK. Utiliza PolkadotJS para establecer conexiones y gestionar cuentas.

## 🚀 Características

- 🔗 Conexión a la red Polkadot
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
├── contracts
│ └── ink
│   └── counter
│     ├── Cargo.lock
│     ├── Cargo.toml
│     ├── lib.rs
│     └── tests.rs
├── package.json
└── .env.example
```

## 📚 Componentes principales

### Contrato Counter (Ink!)

El contrato Counter está desarrollado en Ink!, un lenguaje de programación para contratos inteligentes en el ecosistema Polkadot.

#### Requisitos previos

- Rust: Es necesario tener Rust instalado. Si no lo tienes, sigue la [guía oficial de instalación de Rust](https://www.rust-lang.org/tools/install).
- Ink!: Para instalar Ink! y sus herramientas, sigue la [documentación oficial de Ink!](https://use.ink/getting-started/setup).

#### Compilación del contrato

1. Navega al directorio del contrato:
   ```
   cd contracts/ink/counter
   ```

2. Compila el contrato:
   ```
   cargo contract build
   ```

3. Este comando generará los siguientes archivos en el directorio `target/ink`:
   - `counter.wasm`: El bytecode del contrato.
   - `counter.json`: El archivo metadata del contrato (ABI).
   - `counter.contract`: Un archivo que combina el bytecode y el metadata, útil para desplegar en `ui.use.ink`.

#### Tests del contrato

El contrato Counter incluye dos tipos de tests: unitarios y end-to-end (e2e).

##### Tests unitarios

Los tests unitarios se encuentran en el archivo `tests.rs` y cubren las funcionalidades básicas del contrato:

- Inicialización por defecto y con un valor específico
- Incremento y decremento del contador
- Reinicio del contador
- Manejo de desbordamiento y subdesbordamiento

Para ejecutar los tests unitarios:

```
cargo test
```

##### Tests end-to-end (e2e)

Los tests e2e simulan la interacción con el contrato en un entorno similar al de una blockchain real. Estos tests:

- Despliegan el contrato
- Realizan llamadas a las funciones del contrato
- Verifican el estado del contrato después de las operaciones

Para ejecutar los tests e2e:

```
cargo test --features e2e-tests
```

Nota: Los tests e2e requieren una configuración adicional en el archivo `Cargo.toml` y pueden tardar más en ejecutarse que los tests unitarios.

#### Despliegue del contrato

Para desplegar el contrato, puedes usar `ui.use.ink`, una interfaz web para interactuar con contratos Ink!:

1. Visita [ui.use.ink](https://ui.use.ink/).
2. Conecta tu wallet de Polkadot.
3. Selecciona "Upload New Contract".
4. Sube el archivo `counter.contract` generado durante la compilación.
5. Sigue las instrucciones para desplegar el contrato en la red deseada.

Asegúrate de guardar la dirección del contrato desplegado, la necesitarás para configurar el frontend.

### Frontend (React)

#### App.tsx

Este es el componente principal que renderiza el `CounterCard`.

#### CounterCard/index.tsx

Este componente maneja la conexión con la red Polkadot, la interacción con el contrato Counter y la interfaz de usuario para incrementar, decrementar y reiniciar el contador.

## 🔧 Variables importantes

En el archivo `src/components/CounterCard/index.tsx`, hay tres variables cruciales que debes configurar correctamente:

- `CONTRACT_ADDRESS`: La dirección del contrato Counter desplegado en la red.
- `CONTRACT_ABI`: El ABI del contrato, que se importa desde el archivo JSON generado al compilar el contrato.
- `WS_PROVIDER`: La URL del proveedor WebSocket para conectarse a la red Polkadot.

Para editar estas variables:

1. Actualiza `CONTRACT_ADDRESS` con la dirección de tu contrato desplegado obtenida durante el proceso de despliegue.
2. Asegúrate de que el archivo `counter.json` esté en la ruta correcta (`contracts/ink/counter/target/ink/counter.json`) y contenga el ABI actualizado.
3. Configura `VITE_WS_PROVIDER` en tu archivo `.env` o modifica el valor por defecto en el código para que apunte a la red donde desplegaste el contrato.

## 🚦 Cómo empezar

1. Clona el repositorio
2. Instala las dependencias con `npm install`
3. Asegúrate de que el archivo `counter.json` esté presente en la carpeta `contracts/ink/counter/target/ink/`
4. Actualiza `CONTRACT_ADDRESS` en `src/components/CounterCard/index.tsx` con la dirección de tu contrato desplegado
5. Inicia la aplicación con `npm run dev`
6. Abre tu navegador y visita `http://localhost:5173`
7. (Opcional, para usar deploy.ts) Copia el archivo `.env.example` a `.env` y configura la variable `VITE_WS_PROVIDER` con la dirección de tu nodo Polkadot

## 📝 Notas importantes

- Asegúrate de tener una extensión de wallet de Polkadot (como PolkadotJS) instalada en tu navegador para interactuar con la DApp.
- El contrato Counter debe estar desplegado en la red que estés utilizando. Asegúrate de actualizar la dirección del contrato y el proveedor WebSocket según corresponda.

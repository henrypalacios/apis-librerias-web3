import { ApiPromise, WsProvider } from '@polkadot/api';
import { Abi, CodePromise } from '@polkadot/api-contract';
import { Keyring } from '@polkadot/keyring';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';

dotenv.config();

const contractPath = './contracts/ink/counter/target/ink'
const provider_url = process.env.VITE_WS_PROVIDER
// const provider_url = 'wss://localhost:9944'

async function deployContract() {
	// Configurar la conexión a la red
	const wsProvider = new WsProvider(provider_url);
	const api = await ApiPromise.create({ provider: wsProvider });

	// Cargar la cuenta del deployer
	const keyring = new Keyring({ type: 'sr25519' });
	const deployer = keyring.addFromUri(process.env.SEED_PHRASE || '');

	// Leer el archivo WASM y el ABI
	console.log('__deployer', deployer.address.toString())
	const wasm = await readFile(`${contractPath}/counter.wasm`);
	const abi = new Abi(JSON.parse(await readFile(`${contractPath}/counter.json`, 'utf8')));

	// Crear una instancia del contrato
	const contract = new CodePromise(api, abi, wasm);

	// Desplegar el contrato
    const initValue = 0
	const gasLimit = 100000n * 1000000n;
	const storageDepositLimit = null;
	
	return new Promise((resolve, reject) => {
		contract.tx
			.new({ gasLimit, storageDepositLimit }, initValue)
			.signAndSend(deployer, async (result) => {
				if (result.status.isInBlock || result.status.isFinalized) {
					// const contractAddress = result.contract?.address.toString();
					console.log('Hash de la transacción:', result.txHash.toHex());
					// console.log('Contrato desplegado en la dirección:', contractAddress);
					await api.disconnect();
					// resolve(contractAddress);
				} else if (result.isError) {
					console.error('Error al desplegar el contrato:', result.toHuman());
					await api.disconnect();
					reject(new Error('Error al desplegar el contrato'));
				}
			});
	});
}

deployContract().catch(console.error);
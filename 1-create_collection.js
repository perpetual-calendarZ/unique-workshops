// 1-create-collection.js
// A MUDANÇA É NESTA LINHA: removemos o '/keyring' do final
const { KeyringProvider } = require('@unique-nft/accounts'); 
const { Client } = require('@unique-nft/sdk');
const { mnemonic } = require('./config');

async function main() {
  const signer = await KeyringProvider.fromMnemonic(mnemonic);
  
  const client = new Client({
    baseUrl: 'https://rest.unique.network/opal/v1',
    signer,
  });
  const sdk = client.sdk;

  const collectionData = {
    name: 'perpetual calendar traveler',
    description: 'A collection of perpetual calendar traveler NFTs',
    tokenPrefix: 'PCT',
    schema: {
      schemaName: 'unique',
      schemaVersion: '1.0.0',
      coverPicture: { url: 'https://exemplo.com/capa-colecao.png' },
      image: { urlTemplate: '{id}' },
      attributesSchema: {
        '0': { name: { _: 'Cor de Fundo' }, type: 'string' },
        '1': { name: { _: 'Acessório' }, type: 'string' },
        '2': { name: { _: 'Nível' }, type: 'number' },
      },
    },
  };

  console.log('Criando a coleção "perpetual calendar traveler"...');
  
  const { address } = signer.getAccount();
  const { collectionId } = await sdk.collections.creation.submitWaitResult({
    ...collectionData,
    address,
  });

  console.log('SUCESSO! Coleção criada!');
  console.log(`ID da Coleção: ${collectionId}`);
  console.log(`Veja sua coleção em: https://uniquescan.io/opal/collections/${collectionId}`);

  process.exit(0);
}

main().catch((error) => {
  console.error('Ocorreu um erro:', error);
  process.exit(1);
});
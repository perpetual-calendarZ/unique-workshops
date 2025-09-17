const { KeyringProvider } = require('@unique-nft/accounts/keyring');
const { Sdk } = require('@unique-nft/sdk');
const { mnemonic } = require('./config');

async function main() {
  const signer = await KeyringProvider.fromMnemonic(mnemonic);
  const address = signer.getAddress();

  const sdk = new Sdk({
    // A versão antiga usa o endereço wss://
    baseUrl: 'wss://ws-opal.unique.network',
    signer,
  });

  const collectionData = {
    name: 'perpetual calendar traveler',
    description: 'A collection of perpetual calendar traveler NFTs',
    tokenPrefix: 'PCT',
    // O schema também é um pouco diferente nesta versão
    schema: {
      schemaName: 'unique',
      schemaVersion: '1.0.0',
      coverPicture: {
        url: 'https://exemplo.com/capa-colecao.png',
      },
      image: {
        urlTemplate: '{id}',
      },
      attributesSchemaVersion: '1.0.0',
      attributesSchema: {
        0: { name: { _: 'Cor de Fundo' }, type: 'string' },
        1: { name: { _: 'Acessório' }, type: 'string' },
        2: { name: { _: 'Nível' }, type: 'number' },
      }
    }
  };

  console.log('Criando a coleção "perpetual calendar traveler"...');

  const { collectionId } = await sdk.collections.create.submitWaitResult({
    address,
    ...collectionData,
  });

  console.log('SUCESSO! Coleção criada!');
  console.log(`ID da Coleção: ${collectionId}`);
  console.log(`Veja sua coleção em: https://uniquescan.io/opal/collections/${collectionId}`);

  process.exit(0);
}

main().catch((error) => {
  console.error('Ocorreu um erro:', error);
  process.exit(1);
}); // como alterar esta coleção para ser uma coleção privada com controle de acesso e exposição em multiplataformas






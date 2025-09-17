const { KeyringProvider } = require('@unique-nft/accounts/keyring');
const { Sdk } = require('@unique-nft/sdk');
const { mnemonic } = require('./config');

async function main() {
  console.log('Iniciando a criação da Coleção Multimídia...');

  const signer = await KeyringProvider.fromMnemonic(mnemonic);
  const address = signer.getAddress();

  const sdk = new Sdk({
    baseUrl: 'wss://ws-opal.unique-nft.network',
    signer,
  });

  const collectionData = {
    name: 'Tokens Multimídia',
    description: 'Uma coleção para NFTs que contêm múltiplas mídias.',
    tokenPrefix: 'MMT',

    // Schema customizado para nossas mídias
    schema: {
      schemaName: 'unique',
      schemaVersion: '1.0.0',
      
      // A imagem principal que aparece no explorador
      // <-- AQUI FOI FEITA A ALTERAÇÃO com o link do seu arquivo .txt
      coverPicture: { url: 'ipfs://bafybeieuf7kqraisrdcihhuegayfxl6abhrsia443p4kr7hveizvmwehdu' },
      
      image: { urlTemplate: 'ipfs://{id}' }, // Placeholder para o CID do IPFS

      attributesSchemaVersion: '1.0.0',
      attributesSchema: {
        0: { name: { _: 'Nome da Obra' }, type: 'string' },
        1: { name: { _: 'Capa (JPG)' }, type: 'string', isUrl: true }, 
        2: { name: { _: 'Token (Vídeo)' }, type: 'string', isUrl: true }, // Mudei para "Token (Vídeo)" para corresponder ao seu arquivo
        3: { name: { _: 'Música (MP3)' }, type: 'string', isUrl: true },
      }
    }
  };

  const { collectionId, error } = await sdk.collections.creation.submitWaitResult({
    address,
    ...collectionData,
  });

  if (error) {
    console.error('Ocorreu um erro ao criar a coleção multimídia:', error);
    throw error; // Lança o erro para ser capturado pelo catch principal
  }

  console.log('====================================================');
  console.log('🎉 SUCESSO! Coleção Multimídia criada! 🎉');
  console.log(`   GUARDE ESTE ID: ${collectionId}`); // GUARDE ESTE NÚMERO!
  console.log(`   Veja a coleção: https://uniquescan.io/opal/collections/${collectionId}`);
  console.log('====================================================');
}

main().catch((error) => {
  console.error('Erro crítico:', error);
  // Define o código de saída como 1 para indicar que o script falhou.
  // O processo terminará naturalmente após isso.
  process.exitCode = 1;
});
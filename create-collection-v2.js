// Importa as bibliotecas necessárias da Unique Network
const { KeyringProvider } = require('@unique-nft/accounts/keyring');
const { Sdk } = require('@unique-nft/sdk');

// Importa sua frase secreta do arquivo de configuração
// Certifique-se de ter um arquivo chamado config.js na mesma pasta
const { mnemonic } = require('./config');

// A função principal que vai executar todo o processo
async function main() {
  console.log('Iniciando a criação da sua nova coleção aninhável...');

  // 1. Configura sua carteira (signer) a partir da sua frase secreta
  const signer = await KeyringProvider.fromMnemonic(mnemonic);
  const address = signer.getAddress();
  console.log(`Endereço da carteira que vai criar a coleção: ${address}`);

  // 2. Conecta ao SDK da rede de testes Opal
  const sdk = new Sdk({
    baseUrl: 'wss://ws-opal.unique-nft.network', // Endereço atualizado da Opal
    signer,
  });

  // 3. Define todos os dados da sua NOVA coleção
  const collectionData = {
    // Usamos um novo nome e prefixo para diferenciar da coleção antiga
    name: 'Perpetual Calendar Traveler V2',
    description: 'Uma coleção de NFTs viajantes que podem conter outros NFTs.',
    tokenPrefix: 'PCTV2',

    // <-- AQUI ESTÁ A MUDANÇA PRINCIPAL: HABILITANDO O ANINHAMENTO
    nesting: {
      enabled: true, // Isso permite que os NFTs desta coleção possuam outros NFTs
    },

    // O schema define as propriedades e a aparência dos seus NFTs
    schema: {
      schemaName: 'unique',
      schemaVersion: '1.0.0',
      coverPicture: {
        url: 'https://exemplo.com/capa-colecao-v2.png', // Você pode trocar esta URL
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

  console.log('Enviando a transação para a blockchain. Isso pode levar um momento...');

  // 4. Envia a transação para criar a coleção e aguarda o resultado
  const { collectionId, error } = await sdk.collections.creation.submitWaitResult({
    address,
    ...collectionData,
  });

  // 5. Verifica se houve algum erro
  if (error) {
    console.error('Ocorreu um erro ao criar a coleção:', error);
    process.exit(1); // Encerra o script em caso de erro
  }

  // 6. Se tudo deu certo, mostra as informações da nova coleção
  console.log('================================================');
  console.log('🎉 SUCESSO! Sua nova coleção aninhável foi criada! 🎉');
  console.log(`   ID da Coleção: ${collectionId}`);
  console.log(`   Veja sua coleção no explorador: https://uniquescan.io/opal/collections/${collectionId}`);
  console.log('================================================');

  process.exit(0); // Encerra o script com sucesso
}

// Executa a função principal e captura qualquer erro inesperado
main().catch((error) => {
  console.error('Ocorreu um erro crítico:', error);
  process.exit(1);
});
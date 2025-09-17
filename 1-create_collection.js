// Importa as dependências necessárias do SDK v2 e do pacote de utilitários
import { UniqueChain } from '@unique-nft/sdk';
import { Sr25519Account } from '@unique-nft/utils/sr25519';

// Importa o mnemônico de um arquivo de configuração separado para segurança
// Exemplo de config.js: export const mnemonic = 'sua frase mnemônica de 12 palavras aqui';
import { mnemonic } from './config.js';

async function main() {
  try {
    // 1. Criar a conta do signatário a partir do mnemônico
    // Sr25519Account é o padrão para contas Substrate
    const account = Sr25519Account.fromUri(mnemonic);
    const address = account.address;
    console.log(`Endereço do criador da coleção: ${address}`);

    // 2. Inicializar o SDK v2 para a rede Opal
    // A inicialização aponta para a API REST e é feita sem o signatário
    const sdk = new UniqueChain({
      baseUrl: 'https://rest.unique.network/v2/opal',
    });

    // 3. Definir os dados da coleção usando a nova estrutura do Schema v2
    const collectionData = {
      mode: 'Nft',
      name: 'perpetual calendar traveler',
      description: 'A collection of perpetual calendar traveler NFTs',
      symbol: 'PCT',
      
      // Metadados da coleção
      info: {
        cover_image: {
          url: 'https://exemplo.com/capa-colecao.png'
        }
      },
      
      // Schema de atributos para os tokens
      attributes_schema: {
        '0': { name: { '_': 'Cor de Fundo' }, type: 'string' },
        '1': { name: { '_': 'Acessório' }, type: 'string' },
        '2': { name: { '_': 'Nível' }, type: 'number' }
      }
    };

    console.log('Criando a coleção "perpetual calendar traveler"...');

    // 4. Submeter a transação de criação da coleção
    // O signatário é passado como um parâmetro no momento da chamada da transação
    const createResult = await sdk.collection.create(
      collectionData,
      { signer: account }
    );

    // O resultado é um objeto que contém o ID da coleção e outras informações
    const collectionId = createResult.collectionId;

    if (!collectionId) {
      throw new Error('Falha ao obter o ID da coleção. Resposta recebida:', createResult);
    }

    console.log('SUCESSO! Coleção criada!');
    console.log(`ID da Coleção: ${collectionId}`);
    console.log(`Veja sua coleção em: https://uniquescan.io/opal/collections/${collectionId}`);

    process.exit(0);

  } catch (error) {
    console.error('Ocorreu um erro:', error);
    process.exit(1);
  }
}

main();
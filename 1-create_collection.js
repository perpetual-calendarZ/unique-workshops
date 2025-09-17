// Importa as dependências necessárias do SDK v2
import UniqueChain from '@unique-nft/sdk';
import { Sr25519Account } from '@unique-nft/sr25519';

// Importa o mnemônico de um arquivo de configuração separado para segurança
import { config } from './config.js';

async function main() {
  try {
    // 1. Criar a conta do signatário a partir do mnemônico
    const account = Sr25519Account.fromUri(config.mnemonic);
    const address = account.address;
    console.log(`Endereço do criador da coleção: ${address}`);

    // 2. Inicializar o SDK v2 para a rede Opal
    const sdk = new UniqueChain({
      baseUrl: 'https://rest.unique.network/opal/v1',
      account, // O signatário pode ser definido na inicialização
    });

    console.log('Criando a coleção "perpetual calendar traveler"...');

    // 3. Submeter a transação de criação da coleção com a nova sintaxe
    const collectionResult = await sdk.collection.create.submitWaitResult({
      // Dados da coleção
      address,
      name: 'perpetual calendar traveler',
      description: 'A collection of perpetual calendar traveler NFTs',
      symbol: 'PCT',
      // A propriedade 'info' foi renomeada para 'meta'
      meta: {
        cover_image: {
          url: 'https://exemplo.com/capa-colecao.png'
        }
      },
      // O modo 'Nft' é o padrão, mas é bom ser explícito
      mode: 'Nft',
    });

    // O resultado já vem com os dados parseados
    const { collectionId } = collectionResult;

    if (!collectionId) {
      throw new Error('Falha ao obter o ID da coleção. Resposta recebida:', JSON.stringify(collectionResult));
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
        mode: 'Nft',
        name: 'perpetual calendar traveler',
        description: 'A collection of perpetual calendar traveler NFTs',
        symbol: 'PCT',
        info: {
          cover_image: {
            url: 'https://exemplo.com/capa-colecao.png'
          }
        }
      },
      { 
        signerAddress: address  // ✅ Adiciona o signerAddress
      },
      account  // ✅ Account como terceiro parâmetro
    );

    // O resultado contém o ID da coleção
    const collectionId = collectionResult.parsed.collectionId;

    if (!collectionId) {
      throw new Error('Falha ao obter o ID da coleção. Resposta recebida:', collectionResult);
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

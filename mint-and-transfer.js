const { KeyringProvider } = require('@unique-nft/accounts/keyring');
const { Sdk } = require('@unique-nft/sdk');
const { mnemonic } = require('./config');

async function main() {
  // ==================================//
  //      👇 PREENCHA ESTES VALORES 👇      //
  // ==================================//

  // 1. ID da sua coleção multimídia (obtido no script anterior)
  const collectionId = 123; // 👈 SUBSTITUA PELO ID DA SUA COLEÇÃO

  // 2. Endereço da carteira que vai RECEBER o NFT
  const recipientAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'; // 👈 SUBSTITUA POR UM ENDEREÇO DE DESTINO (pode ser uma de suas outras contas)

  // 3. URLs para as mídias do seu NFT (use os CIDs do IPFS que você já tem)
  const coverJpgUrl = 'ipfs://bafybeigvfh6k56p2qwh5x7q7xb5goe6gqgq5j2jg2kgy3a627w5s2w5y4u'; // 👈 URL da sua imagem de capa
  const videoUrl = 'ipfs://bafybeih4s4y5v2t2q4a4j4k4l4m4n4o4p4q4r4s4t4u4v4w4x4y4z4a'; // 👈 URL do seu vídeo
  const musicUrl = 'ipfs://bafybeib2q2g2h2j2k2l2m2n2o2p2q2r2s2t2u2v2w2x2y2z2a2b'; // 👈 URL da sua música

  // ==================================//
  //        FIM DA CONFIGURAÇÃO         //
  // ==================================//

  if (collectionId === 123) {
    console.error('🛑 Por favor, substitua o valor de "collectionId" pelo ID da sua coleção.');
    return;
  }

  // --- Conexão com a carteira e o SDK ---
  console.log('Conectando à carteira e à rede Opal...');
  const signer = await KeyringProvider.fromMnemonic(mnemonic);
  const address = signer.getAddress();

  const sdk = new Sdk({
    baseUrl: 'wss://ws-opal.unique-nft.network',
    signer,
  });

  // --- 1. MINTANDO O NFT ---
  console.log(`\nMintando um novo NFT na coleção ${collectionId}...`);

  const { tokenId, error: mintError } = await sdk.tokens.create.submitWaitResult({
    address,
    collectionId,
    data: {
      // A imagem principal do NFT. Pode ser a mesma da capa ou outra.
      image: { url: coverJpgUrl },
      // Preenchendo os atributos que definimos no schema da coleção
      encodedAttributes: {
        0: { _: 'Minha Primeira Obra Multimídia' }, // Atributo 0: Nome da Obra
        1: { _: coverJpgUrl },                     // Atributo 1: Capa (JPG)
        2: { _: videoUrl },                        // Atributo 2: Token (Vídeo)
        3: { _: musicUrl },                        // Atributo 3: Música (MP3)
      }
    }
  });

  if (mintError) {
    console.error('❌ Erro ao mintar o NFT:', mintError);
    throw mintError;
  }

  console.log(`✅ SUCESSO! NFT #${tokenId} mintado na coleção ${collectionId}.`);
  console.log(`   Veja o NFT: https://uniquescan.io/opal/tokens/${collectionId}/${tokenId}`);

  // --- 2. TRANSFERINDO O NFT ---
  console.log(`\nTransferindo o NFT #${tokenId} para o endereço ${recipientAddress}...`);

  const { error: transferError } = await sdk.tokens.transfer.submitWaitResult({
    address,
    collectionId,
    tokenId,
    to: recipientAddress,
  });

  if (transferError) {
    console.error('❌ Erro ao transferir o NFT:', transferError);
    throw transferError;
  }

  console.log('✅ SUCESSO! NFT transferido.');
  console.log(`   Verifique o novo dono em: https://uniquescan.io/opal/tokens/${collectionId}/${tokenId}`);
}

main().catch((error) => {
  console.error('Erro crítico no script:', error);
  process.exitCode = 1;
});
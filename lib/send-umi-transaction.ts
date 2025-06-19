import { TransactionBuilder, Umi } from '@metaplex-foundation/umi'
import { toWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters'
import { Commitment, Connection } from '@solana/web3.js'

export async function sendUmiTransaction(
  umi: Umi,
  rpc: Connection,
  transactionBuilder: TransactionBuilder,
  commitment: Commitment = 'confirmed',
) {
  const signers = transactionBuilder.getSigners(umi)
  const transaction = await transactionBuilder.buildWithLatestBlockhash(umi)

  const signedTransaction = await signers.reduce(async (acc, signer) => {
    if (signer.publicKey === umi.identity.publicKey) {
      return acc
    }

    const toSign = await acc

    return signer.signTransaction(toSign)
  }, Promise.resolve(transaction))

  const web3Transaction = toWeb3JsTransaction(signedTransaction)

  if (!window.solana) {
    throw new Error('Wallet not found')
  }

  const { signature } =
    await window.solana.signAndSendTransaction(web3Transaction)

  await rpc.confirmTransaction(signature, commitment)
}

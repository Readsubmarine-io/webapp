import { Metaplex, TransactionBuilder } from '@metaplex-foundation/js'
import { Connection } from '@solana/web3.js'

export async function sendMetaplexTransaction<T extends object>(
  metaplex: Metaplex,
  rpc: Connection,
  builder: TransactionBuilder<T>,
): Promise<T> {
  const context = builder.getContext()
  const transaction = builder.toTransaction(
    await metaplex.rpc().getLatestBlockhash(),
  )

  transaction.feePayer = metaplex.identity().publicKey

  const signers = builder
    .getSigners()
    .filter((signer) => signer.publicKey !== metaplex.identity().publicKey)

  const signedTransaction = await metaplex
    .rpc()
    .signTransaction(transaction, signers)

  if (!window.solana) {
    throw new Error('Wallet not found')
  }

  const { signature } =
    await window.solana.signAndSendTransaction(signedTransaction)

  await rpc.confirmTransaction(signature, 'confirmed')

  return context
}

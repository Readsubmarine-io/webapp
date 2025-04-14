import { DefaultGuardSetArgs } from '@metaplex-foundation/mpl-candy-machine'
import { dateTime, PublicKey, sol } from '@metaplex-foundation/umi'
import { none, some } from '@solana/kit'

export const buildGuards = ({
  mintPrice,
  mintPriceReceiver,
  mintStartDate,
  mintEndDate,
}: {
  mintPrice: number
  mintPriceReceiver: PublicKey
  mintStartDate: Date
  mintEndDate?: Date
}): Partial<DefaultGuardSetArgs> => {
  const guards: DefaultGuardSetArgs = {
    botTax: some({
      lamports: sol(0.01),
      lastInstruction: true,
    }),
    solPayment: some({
      lamports: sol(mintPrice),
      destination: mintPriceReceiver,
    }),
    startDate: some({
      date: dateTime(mintStartDate),
    }),
    endDate: mintEndDate
      ? some({
          date: dateTime(mintEndDate),
        })
      : none(),
    thirdPartySigner: none(),
    tokenPayment: none(),
    tokenGate: none(),
    gatekeeper: none(),
    allowList: none(),
    mintLimit: none(),
    nftPayment: none(),
    redeemedAmount: none(),
    addressGate: none(),
    nftGate: none(),
    nftBurn: none(),
    tokenBurn: none(),
    freezeSolPayment: none(),
    freezeTokenPayment: none(),
    programGate: none(),
    allocation: none(),
    token2022Payment: none(),
  }

  return guards
}

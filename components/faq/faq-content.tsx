'use client'

export function FaqContent() {
  const faqData = [
    {
      id: 1,
      question: 'What is Submarine?',
      answer:
        'Submarine, which can also be referred to as its URL, readsubmarine.io, is both an ebook self-publishing platform and an ebook collecting platform. What makes Submarine unique is that the ebooks that authors self-publish on Submarine are Solana NFTs. There are two kinds of users on Submarine: writers, who create the ebook NFTs, and readers, who collect the ebook NFTs by either minting them on the launchpad or buying one from another collector on the marketplace. Submarine is an ebook NFT marketplace and launchpad, and the vision behind the creation and operation of Submarine is to provide the holders of Aqua Apes NFTs with a fun, unique way to create and collect ebook NFTs. Submarine is also available for anyone to use, whether they own an Aqua Ape NFT or not. Submarine was created to inspire more people to read and write. Submarine was also created to give aspiring authors a new way to self-publish their books by turning their books into collectible, ebook NFTs. Submarine was not created to generate, establish, increase, or maintain the value of Aqua Apes NFTs. Here is a link to the collection page for Aqua Apes on the NFT Marketplace, Magic Eden: https://magiceden.us/marketplace/aquaapes .',
    },
    {
      id: 2,
      question: 'What are Aqua Apes NFTs?',
      answer:
        'Aqua Apes NFTs are a collection of Solana NFTs that feature pixel artwork of apes. Aqua Apes NFTs are art collectibles.',
    },
    {
      id: 3,
      question: 'Are Aqua Apes NFTs an investment?',
      answer:
        'No. Aqua Apes NFTs are not an investment. Aqua Apes NFTS are a collection of art collectibles. Owners or potential collectors of Aqua Apes NFTs should not expect to profit by buying, holding, or selling Aqua Apes NFTs.',
    },
    {
      id: 4,
      question: 'Do Aqua Apes NFTS provide any utility on readsubmarine.io?',
      answer:
        "Owners of Aqua Apes NFTs can enjoy the following utilities on readsubmarine.io: Readers who have an Aqua Ape NFT in the wallet that they connect to readsubmarine.io will have their trading fees on the platform reduced from 2.5% to 1%, and writers who have an Aqua Ape NFT in the wallet that they connect to readsubmarine.io will have their minting fee reduced from 20% to 10%. The only purpose of these benefits is to increase the user's enjoyment of creating and collecting ebook NFTs by making reading and writing on readsubmarine.io more accessible. Aqua Apes NFTs are not an investment, and owners or potential collectors of Aqua Apes NFTs should not expect to profit by buying, holding, or selling Aqua Apes NFTs.",
    },
    {
      id: 5,
      question: 'What is a Solana NFT?',
      answer:
        "Here is a simple, three-sentence definition of a Solana NFT, provided by ChatGPT: A Solana NFT is a unique digital token on the Solana blockchain that proves ownership of a specific asset. Its core data, like the token ID and metadata reference, is stored on-chain, while the actual media file (image, video, etc.) is usually stored off-chain on decentralized storage like Arweave or IPFS. This setup allows NFTs to be fast, low-cost, and verifiable through Solana's blockchain.",
    },
    {
      id: 6,
      question: 'What is an ebook?',
      answer:
        'An ebook is a digital version of a book that can be read on electronic devices like computers, tablets, e-readers, or phones.',
    },
    {
      id: 7,
      question: 'What is an ebook Solana NFT?',
      answer:
        "Here is a simple definition of an ebook Solana NFT, provided by ChatGPT: An ebook Solana NFT is a unique digital token on the Solana blockchain that proves ownership of an ebook, with its cover image and the PDF file stored off-chain (on systems like Arweave or IPFS) and linked through the NFT's on-chain metadata.",
    },
    {
      id: 8,
      question: 'What does it mean to mint an NFT?',
      answer:
        'Here is a simple definition for what it means to mint an NFT, provided by ChatGPT: To mint an NFT means to create and record a unique digital token on a blockchain, making it publicly verifiable and available for ownership or trading.',
    },
    {
      id: 9,
      question:
        'Are the ebook Solana NFTs that are created, minted, or traded on readsubmarine.io investments?',
      answer:
        'No. The ebook Solana NFTs that are created, minted, or traded on readsubmarine.io are not investments. They are ebook collectibles intended to be enjoyed as literature. Owners or potential buyers of the ebook NFTs that are created, minted, or traded on readsubmarine.io should not expect to profit by buying, holding, or selling those ebook NFTs.',
    },
    {
      id: 10,
      question: 'How long are the ebooks on readsubmarine.io?',
      answer:
        'The ebooks could be as short as a simple, one-page poem, or a fully-fledged novel.',
    },
    {
      id: 11,
      question: 'How does the Submarine Launchpad work?',
      answer:
        'Writers can create an ebook NFT collection by going to the home page, scrolling down, and clicking the "Create Your NFT Ebook" button. They will then be guided through a number of steps, including uploading their ebook PDF, the JPEG cover for their ebook, and other details about the collection. They will pick the price in Solana that they want to sell the ebook NFTs for, and they\'ll be able to choose the day and time that they want the ebooks to be available for sale. Once they submit their ebook for approval, an admin will review it and once they confirm that none of the contents of the ebook violates our content policies, they will approve it. Before the ebook will be visible on the launchpad, the writer must connect the wallet they used to create it to the platform, click on the "My Profile" button in the top right, click on the "Created" tab, and then click the three vertical dots on the collection they sent for approval, and then click the "Show Book" button. Once that step is completed and assuming the ebook was approved by an admin for the launchpad, their ebook will be visible for minting at the date and time the writer selected during the collection creation process. Their collection will be mintable by readers on the "Launchpad" page once the sale goes live. It is recommended that the writer doesn\'t schedule the mint of their ebook NFT collection to be any sooner than 7 days from the time they submit their ebook for approval because the wait time for approval is typically up to 7 days long, though in rare cases, it may take longer.',
    },
    {
      id: 12,
      question:
        'What are the Metaplex Protocol Fees for creating an NFT collection as a writer on readsubmarine.io?',
      answer:
        "Submarine uses the Metaplex Protocol for NFT creation and minting. Metaplex sets their own fees for users who are creating and minting NFTs on their protocol. These fees are not determined by Submarine. You can find Metaplex's fees on their website at: https://developers.metaplex.com/protocol-fees. Submarine is not responsible for these fees changing.",
    },
    {
      id: 13,
      question:
        'What are the Metaplex Protocol Fees for minting an NFT collection as a writer on readsubmarine.io?',
      answer:
        "Submarine uses the Metaplex Protocol for NFT creation and minting. Metaplex sets their own fees for users who are creating and minting NFTs on their protocol. These fees are not determined by Submarine. You can find Metaplex's fees on their website at: https://developers.metaplex.com/protocol-fees. Submarine is not responsible for these fees changing.",
    },
    {
      id: 14,
      question:
        'How much is the royalty that the creator of an ebook NFT collection on Submarine collects whenever one of their ebook NFTs is traded between readers on the Submarine marketplace?',
      answer:
        'The royalty fee for ebook NFT sales on the marketplace is 5%. 1/5th of the royalty fee from each individual sale on the marketplace (20% of the royalty) goes to readsubmarine.io, and 4/5ths of the royalty fee from each individual sale on the marketplace (80% of the royalty) goes to the creator of that ebook NFT.',
    },
    {
      id: 15,
      question: 'How does the Submarine Marketplace work?',
      answer:
        'Readers who buy an ebook NFT from another reader or who mint an ebook NFT will be able to list it for sale on the marketplace once the mint is complete on the launchpad. In order to list it for sale, follow these steps: connect the wallet that holds the ebook NFT to the platform, click the "My Profile" button at the top right, click on the "Collected" tab, click on the three vertical dots on the ebook NFT you want to list for sale, click the "Sale" button from the drop-down menu and enter the price you want to sell it for. Once you\'ve listed it for sale, it will be available for purchase on the marketplace. If your ebook is listed for sale at the lowest price for that collection and nobody else lists it at that same price after you, your ebook NFT will be next up in line for purchase. Otherwise, it will either be behind other ebooks in the collection that are either listed for a lower price or other ebooks that are listed for the same amount but were listed after you listed yours. The ebook NFT that has been listed most recently at the lowest price takes priority for the next sale in that collection.',
    },
    {
      id: 16,
      question: 'What are the fees for using Submarine?',
      answer:
        'There are two different kinds of fees for writers who publish their ebooks on readsubmarine.io: There is 20% mint fee for writers, which means that 20% of the proceeds from the mint of their ebook Solana NFT goes to readsubmarine.io. Also, 1/5th of the 5% of the royalties goes to the platform (20% of the royalties). There is one kind of fee for readers who trade ebook NFTs on readsubmarine.io: There is a 2.5% referral fee of the sale price of an ebook NFT, paid by the seller to readsubmarine.io when they sell an ebook NFT.',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-power-pump-heading mb-6 text-center">
        FAQ
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {faqData.map((faq) => (
          <div
            key={faq.id}
            className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
          >
            <h2 className="text-xl font-semibold text-power-pump-heading mb-3">
              {faq.id}. {faq.question}
            </h2>
            <p className="text-power-pump-text leading-relaxed">
              {faq.answer.split('https://').map((part, index) => {
                if (index === 0) return part
                const [url, ...rest] = part.split(' ')
                return (
                  <span key={index}>
                    <a
                      href={`https://${url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      https://{url}
                    </a>
                    {rest.length > 0 && ` ${rest.join(' ')}`}
                  </span>
                )
              })}
            </p>
          </div>
        ))}

        <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong>Disclaimer:</strong> This list of FAQs is not comprehensive.
            There are many potential questions that are not answered here. This
            page is intended to provide answers to a limited number of
            frequently asked questions. If you have further questions, you can
            contact us on X.com at{' '}
            <a
              href="https://x.com/wearsubmarine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              https://x.com/wearsubmarine
            </a>{' '}
            or{' '}
            <a
              href="https://x.com/theaquaapes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              https://x.com/theaquaapes
            </a>
            . We try to answer all questions within 72 hours, but it could take
            us longer to reply to your question.
          </p>
        </div>
      </div>
    </div>
  )
}

# How to deploy:

Vault wallet - solana wallet with only client access, stores all received fees.

Payments wallet - solana wallet with backend system access, receives mint payments and splits fee part to the vault wallet and other part to the nft author wallet.

## Frontend

1. Deploy the auction house with the Metaplex sdk.
1. Configure .env file. Use notes from .env.example
1. Run `docker compose up -d --build`

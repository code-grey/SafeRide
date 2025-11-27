package main

import (
	"context"
	"log"
	"os"

	"github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/rpc"
)

func RunAirdrop() {
	// 1. Get Wallet Public Key from environment or argument
	walletPubKeyStr := os.Getenv("SOLANA_WALLET_PUBKEY")
	if len(os.Args) > 1 {
		walletPubKeyStr = os.Args[1]
	}

	if walletPubKeyStr == "" {
		log.Fatalf("Usage: go run solana_airdrop.go <WALLET_PUBLIC_KEY> or set SOLANA_WALLET_PUBKEY env var")
	}

	walletPubKey := solana.MustPublicKeyFromBase58(walletPubKeyStr)

	log.Printf("Requesting airdrop for: %s", walletPubKey.String())

	// 2. Init Solana Client (Devnet)
	solanaClient := rpc.New(rpc.DevNet_RPC)
	ctx := context.Background()

	// 3. Request Airdrop (e.g., 1 SOL)
	airdropAmount := solana.LAMPORTS_PER_SOL // 1 SOL
	
	log.Printf("Requesting %d Lamports (%.9f SOL) airdrop...", airdropAmount, float64(airdropAmount)/float64(solana.LAMPORTS_PER_SOL))

	signature, err := solanaClient.RequestAirdrop(
		ctx,
		walletPubKey,
		airdropAmount,
		rpc.CommitmentConfirmed,
	)
	if err != nil {
		log.Fatalf("Failed to request airdrop: %v", err)
	}

	log.Printf("✅ Airdrop requested! Signature: %s. Check balance on explorer.solana.com/address/%s?cluster=devnet", signature.String(), walletPubKey.String())
}

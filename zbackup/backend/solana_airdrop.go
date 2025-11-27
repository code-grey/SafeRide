package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/rpc"
)

func main() {
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

	// 4. Confirm Airdrop
	log.Printf("Airdrop requested. Signature: %s", signature.String())
	
	// Wait for confirmation
	maxRetries := 30
	for i := 0; i < maxRetries; i++ {
		status, err := solanaClient.GetSignatureStatuses(ctx, signature)
		if err != nil {
			log.Printf("Error getting signature status: %v. Retrying...", err)
			time.Sleep(time.Second)
			continue
		}
		
		if status != nil && len(status.Value) > 0 && status.Value[0] != nil && status.Value[0].ConfirmationStatus == rpc.CommitmentConfirmed {
			log.Printf("✅ Airdrop confirmed! Check your balance on explorer.solana.com/address/%s?cluster=devnet", walletPubKey.String())
			return
		}
		time.Sleep(time.Second)
	}
	log.Fatalf("Airdrop confirmation timed out.")
}

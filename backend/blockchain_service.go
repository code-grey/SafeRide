package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/programs/system"
	"github.com/gagliardetto/solana-go/rpc"
	"github.com/go-redis/redis/v8"
)

// BlockchainService manages Solana blockchain interactions.
type BlockchainService struct {
	solanaClient *rpc.Client
	solanaWallet solana.PrivateKey
	redisClient  *redis.Client
	ctx          context.Context
}

// NewBlockchainService creates a new BlockchainService instance.
func NewBlockchainService(client *rpc.Client, wallet solana.PrivateKey, rClient *redis.Client, c context.Context) *BlockchainService {
	return &BlockchainService{
		solanaClient: client,
		solanaWallet: wallet,
		redisClient:  rClient,
		ctx:          c,
	}
}

// sendSolanaAlert sends a transaction to the Solana Blockchain.
func (s *BlockchainService) sendSolanaAlert(data Telemetry) {
	log.Printf("⛓️ Initiating Solana Transaction for %s [%s]...", data.VehicleID, data.Status)

	// 1. Create the Memo String
	memoText := fmt.Sprintf("SAFERIDE ALERT [%s]: %s | ID: %s | TIME: %d | CONF: %.2f",
		data.Source, data.Status, data.VehicleID, data.Timestamp, data.Confidence)
	log.Printf("📝 Memo: %s", memoText)

	// 2. Build Instructions
	memoProgramID := solana.MustPublicKeyFromBase58("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
	memoInstr := solana.NewInstruction(
		memoProgramID,
		solana.AccountMetaSlice{
			solana.Meta(s.solanaWallet.PublicKey()).SIGNER(),
		},
		[]byte(memoText),
	)

	transferInstr := system.NewTransferInstruction(
		0,
		s.solanaWallet.PublicKey(),
		s.solanaWallet.PublicKey(),
	).Build()

	recent, err := s.solanaClient.GetLatestBlockhash(context.TODO(), rpc.CommitmentFinalized)
	if err != nil {
		log.Printf("❌ Solana Error (GetBlockhash): %v", err)
		return
	}

	// Combine both instructions
	tx, err := solana.NewTransaction(
		[]solana.Instruction{memoInstr, transferInstr},
		recent.Value.Blockhash,
		solana.TransactionPayer(s.solanaWallet.PublicKey()),
	)
	if err != nil {
		log.Printf("❌ Solana Error (BuildTx): %v", err)
		return
	}

	// 3. Sign Transaction
	_, err = tx.Sign(
		func(key solana.PublicKey) *solana.PrivateKey {
			if s.solanaWallet.PublicKey().Equals(key) {
				return &s.solanaWallet
			}
			return nil
		},
	)
	if err != nil {
		log.Printf("❌ Solana Error (Sign): %v", err)
		return
	}

	// 4. Send Transaction
	sig, err := s.solanaClient.SendTransactionWithOpts(
		context.TODO(),
		tx,
		rpc.TransactionOpts{
			SkipPreflight:       false,
			PreflightCommitment: rpc.CommitmentFinalized,
		},
	)
	if err != nil {
		log.Printf("❌ Solana Error (Send): %v", err)
		return
	}

	log.Printf("✅ Solana Logged: [%s] Signature: %s", data.Status, sig)

	// 5. Update Redis with the Hash
	data.TxHash = sig.String()
	updatedJSON, _ := json.Marshal(data)

	// A. Update Hot State
	err = s.redisClient.Set(s.ctx, data.VehicleID, updatedJSON, time.Hour).Err()
	if err != nil {
		log.Printf("Failed to update Redis with Hash: %v", err)
	}

	// B. Add to Alerts History (Only Incidents with Hashes go here)
	alertKey := fmt.Sprintf("alerts:%s", data.VehicleID)
	s.redisClient.RPush(s.ctx, alertKey, updatedJSON)
	s.redisClient.LTrim(s.ctx, alertKey, -20, -1) // Keep last 20 alerts
}

// sendSolanaSafeAttestation sends a transaction to the Solana Blockchain for safe driving attestation.
// It accepts a Telemetry object which it will update with TxHash and a specific Status.
func (s *BlockchainService) sendSolanaSafeAttestation(data Telemetry, pointsAwarded, totalPoints int) {
	log.Printf("⛓️ Initiating Solana Safe Attestation for %s (Points Awarded: %d)", data.VehicleID, pointsAwarded)

	// 1. Create the Memo String
	memoText := fmt.Sprintf("SAFERIDE ATTESTATION: %s earned %d points. Total: %d.",
		data.VehicleID, pointsAwarded, totalPoints)
	log.Printf("📝 Memo: %s", memoText)

	memoProgramID := solana.MustPublicKeyFromBase58("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
	memoInstr := solana.NewInstruction(
		memoProgramID,
		solana.AccountMetaSlice{
			solana.Meta(s.solanaWallet.PublicKey()).SIGNER(),
		},
		[]byte(memoText),
	)

	transferInstr := system.NewTransferInstruction(
		0,
		s.solanaWallet.PublicKey(),
		s.solanaWallet.PublicKey(),
	).Build()

	recent, err := s.solanaClient.GetLatestBlockhash(context.TODO(), rpc.CommitmentFinalized)
	if err != nil {
		log.Printf("❌ Solana Error (GetBlockhash for Attestation): %v", err)
		return
	}

	tx, err := solana.NewTransaction(
		[]solana.Instruction{memoInstr, transferInstr},
		recent.Value.Blockhash,
		solana.TransactionPayer(s.solanaWallet.PublicKey()),
	)
	if err != nil {
		log.Printf("❌ Solana Error (BuildTx for Attestation): %v", err)
		return
	}

	_, err = tx.Sign(
		func(key solana.PublicKey) *solana.PrivateKey {
			if s.solanaWallet.PublicKey().Equals(key) {
				return &s.solanaWallet
			}
			return nil
		},
	)
	if err != nil {
		log.Printf("❌ Solana Error (Sign for Attestation): %v", err)
		return
	}

	sig, err := s.solanaClient.SendTransactionWithOpts(
		context.TODO(),
		tx,
		rpc.TransactionOpts{
			SkipPreflight:       false,
			PreflightCommitment: rpc.CommitmentFinalized,
		},
	)
	if err != nil {
		log.Printf("❌ Solana Error (Send for Attestation): %v", err)
		return
	}

	sigStr := sig.String()
	log.Printf("✅ Solana Safe Attestation Logged! Signature: %s", sigStr)

	// 5. Update Telemetry data with hash and specific status, then push to Redis alerts list
	data.TxHash = sigStr
	data.Status = "SAFE_STREAK_ATTESTATION" // New status for frontend
	updatedJSON, _ := json.Marshal(data)

	alertKey := fmt.Sprintf("alerts:%s", data.VehicleID)
	s.redisClient.RPush(s.ctx, alertKey, updatedJSON)
	s.redisClient.LTrim(s.ctx, alertKey, -20, -1) // Keep last 20 alerts
}

// sendSolanaPeriodicSafeAttestation sends a transaction to the Solana Blockchain for periodic safe driving attestation.
// It accepts a Telemetry object which it will update with TxHash and a specific Status.
func (s *BlockchainService) sendSolanaPeriodicSafeAttestation(data Telemetry) {
	log.Printf("⛓️ Initiating Solana Periodic Safe Attestation for %s [%s]...", data.VehicleID, data.Status)

	// 1. Create the Memo String
	memoText := fmt.Sprintf("SAFERIDE PERIODIC ATTESTATION: %s status: %s", data.VehicleID, data.Status)
	log.Printf("📝 Memo: %s", memoText)

	memoProgramID := solana.MustPublicKeyFromBase58("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
	memoInstr := solana.NewInstruction(
		memoProgramID,
		solana.AccountMetaSlice{
			solana.Meta(s.solanaWallet.PublicKey()).SIGNER(),
		},
		[]byte(memoText),
	)

	transferInstr := system.NewTransferInstruction(
		0,
		s.solanaWallet.PublicKey(),
		s.solanaWallet.PublicKey(),
	).Build()

	recent, err := s.solanaClient.GetLatestBlockhash(context.TODO(), rpc.CommitmentFinalized)
	if err != nil {
		log.Printf("❌ Solana Error (GetBlockhash for Periodic Attestation): %v", err)
		return
	}

	tx, err := solana.NewTransaction(
		[]solana.Instruction{memoInstr, transferInstr},
		recent.Value.Blockhash,
		solana.TransactionPayer(s.solanaWallet.PublicKey()),
	)
	if err != nil {
		log.Printf("❌ Solana Error (BuildTx for Periodic Attestation): %v", err)
		return
	}

	_, err = tx.Sign(
		func(key solana.PublicKey) *solana.PrivateKey {
			if s.solanaWallet.PublicKey().Equals(key) {
				return &s.solanaWallet
			}
			return nil
		},
	)
	if err != nil {
		log.Printf("❌ Solana Error (Sign for Periodic Attestation): %v", err)
		return
	}

	sig, err := s.solanaClient.SendTransactionWithOpts(
		context.TODO(),
		tx,
		rpc.TransactionOpts{
			SkipPreflight:       false,
			PreflightCommitment: rpc.CommitmentFinalized,
		},
	)
	if err != nil {
		log.Printf("❌ Solana Error (Send for Periodic Attestation): %v", err)
		return
	}

	sigStr := sig.String()
	log.Printf("✅ Solana Periodic Safe Attestation Logged! Signature: %s", sigStr)

	// 5. Update Telemetry data with hash and specific status, then push to Redis alerts list
	data.TxHash = sigStr
	data.Status = "PERIODIC_SAFE_ATTESTATION" // New status for frontend
	updatedJSON, _ := json.Marshal(data)

	alertKey := fmt.Sprintf("alerts:%s", data.VehicleID)
	s.redisClient.RPush(s.ctx, alertKey, updatedJSON)
	s.redisClient.LTrim(s.ctx, alertKey, -20, -1) // Keep last 20 alerts
}

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorFundamentals } from "../target/types/anchor_fundamentals";
import { expect } from "chai";

describe('anchor_fundamentals', () => {
  
  const program = anchor.workspace.AnchorFundamentals as Program<AnchorFundamentals>;
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const user = anchor.web3.Keypair.generate();
  let initialAccount = null;

  it('Is initialized!', async () => {
    const latestBlockHash = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: await provider.connection.requestAirdrop(user.publicKey, 1000000000)
    });
    
    initialAccount = anchor.web3.Keypair.generate();

    await program.methods
      .initialize() 
      .accounts({
        user: user.publicKey,
        initialAccount: initialAccount.publicKey,
      })
      .signers([user, initialAccount])
      .rpc();
      
    const account = await program.account.init.fetch(initialAccount.publicKey);
    expect(account.counter.toString()).to.equal('10');
  });

  it('Updates value!', async () => {
    const newValue = new anchor.BN(42);

    await program.methods
      .updateValue(newValue)
      .accounts({
        storageAccount: initialAccount.publicKey, 
      })
      .rpc(); 

    const updatedAccount = await program.account.init.fetch(initialAccount.publicKey);
    expect(updatedAccount.counter.toString()).to.equal(newValue.toString());
  });
});

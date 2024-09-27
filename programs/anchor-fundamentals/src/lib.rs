use anchor_lang::prelude::*;

declare_id!("DzDJgvL63MdSXqTbouvcLu4HvqEwYMU4KueYr3bkDYWX");

#[program]
pub mod anchor_fundamentals {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let initial_account = &mut ctx.accounts.initial_account;
        initial_account.counter = 10;
        msg!("Initialized!");
        Ok(())
    }

    pub fn update_value(ctx: Context<UpdateValue>, value: u64) -> Result<()> {
        let storage_account = &mut ctx.accounts.storage_account;
        storage_account.counter = value;
        msg!("Updated!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize <'info>{
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,

    #[account(init, payer = user, space = 9000)]
    pub initial_account: Account<'info, Init>
}

#[derive(Accounts)]
pub struct UpdateValue <'info>{ 
    #[account(mut)]
    pub storage_account: Account<'info, Init>
}

#[account]
pub struct Init{
    pub counter: u64
}
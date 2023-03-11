import Head from 'next/head'

import { CardanoWallet } from '@meshsdk/react';
import { useWallet } from '@meshsdk/react';
import { createTransaction } from '@/backend';
import { useState } from 'react';
import { KoiosProvider } from '@meshsdk/core';


export default function Home() {

  const [txHash, setTxHash] = useState<String | undefined>(undefined);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { wallet, connected } = useWallet();

  async function mint(){
    setLoading(true);
     console.log("test is good");
     const changeAddress = await wallet.getChangeAddress();
     console.log("changeAddress",changeAddress );
     const utxos = await wallet.getUtxos();
     console.log("utxos", utxos);

     try {
      const { unsignedTx } = await createTransaction(changeAddress, utxos);
      console.log("unsignedTx", unsignedTx);

      const signedTx = await wallet.signTx(unsignedTx, true);
      console.log("signedTx", signedTx);

      const txHash = await wallet.submitTx(signedTx);
      console.log("txHash", txHash);
      setTxHash(txHash);
      setLoading(false);

      const koiosProvider = new KoiosProvider('preview');

      koiosProvider.onTxConfirmed(txHash, () => {
        console.log('Transaction confirmed');
        setSuccess(true);
      });


     } catch (error) {
      console.log(error);
     }    
     
  }

    

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          width: "100%",
          height: "20vh",
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
        }}
        >
          <div
            style={{
              width: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            >

      {txHash && (
        
        <>
          <p>
            <b>Tx Hash:</b>
            <br />
            {txHash}
          </p>
          {success ? (
            <p>Transaction has confirmed</p>
          ) : (
            <p>Waiting confirmation...</p>
          )}

        </>

      )}

      {!connected && <CardanoWallet />}
      {connected && <button 
        onClick={() => mint()}  
        style={{
          fontSize: "20px",
          margin: "16px",
          padding: "10px",
          backgroundColor: loading ? "orange" : "grey",
        }}
        >
          Mint my token upgrade
        </button>}

      </div>
      </div>



      
    </>
  )
}

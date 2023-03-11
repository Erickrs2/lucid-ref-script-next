import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { CardanoWallet } from '@meshsdk/react';
import { useWallet } from '@meshsdk/react';
import { createTransaction } from '@/backend';
import { useState } from 'react';
import { KoiosProvider } from '@meshsdk/core';

const inter = Inter({ subsets: ['latin'] })

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
          Mint my token
        </button>}

      </div>
      </div>



      <main className={styles.main}>
        <div className={styles.description}>
          
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>pages/index.tsx</code>
          </p>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{' '}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
          <div className={styles.thirteen}>
            <Image
              src="/thirteen.svg"
              alt="13"
              width={40}
              height={31}
              priority
            />
          </div>
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Docs <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Learn <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Templates <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Deploy <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main>
    </>
  )
}

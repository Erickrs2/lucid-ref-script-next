// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { BlockfrostProvider, AppWallet, ForgeScript, AssetMetadata, Mint, largestFirst, Transaction } from '@meshsdk/core';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse) {

    const recipientAddress = req.body.recipientAddress;
    const utxos = req.body.utxos;

    const blockchainProvider = new BlockfrostProvider('previewlhuZWTvcjltNP1Eq8OuqzfD9RQ4fCqU7');
    
    const appWallet = new AppWallet({
      networkId: 0,
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
      key: {
        type: 'mnemonic',
        words: [
          "shoe",
          "sport",
          "useless",
          "volcano",
          "involve",
          "vintage",
          "spend",
          "oak",
          "hole",
          "buddy",
          "slot",
          "catch",
          "brick",
          "roof",
          "leaf",
          "inner",
          "raise",
          "come",
          "toward",
          "jump",
          "cube",
          "legend",
          "enact",
          "slight"
        ],
  },
});

const appWalletAddress = appWallet.getPaymentAddress();
const forgingScript = ForgeScript.withOneSignature(appWalletAddress);

const assetName = 'MeshToken';

const assetMetadata: AssetMetadata = {
  name: 'Mesh Token',
  image: 'ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua',
  mediaType: 'image/jpg',
  description: 'This NFT is minted by Mesh (https://meshjs.dev/).',
};

const asset: Mint = {
  assetName: assetName,
  assetQuantity: '1',
  metadata: assetMetadata,
  label: '721',
  recipient: recipientAddress,
};

const costLovelace = '10000000';
const selectedUtxos = largestFirst(costLovelace, utxos, true);
const bankWalletAddress = 'addr_test1qpp4gqrnc2kfv9tn6tjt2h00c50frxscxpqm4sw986v30cqfnrqavjk923pj9cj5uvrpz94nkaf4syvz92fearp5rc7s80zl76';

const tx = new Transaction({ initiator: appWallet });
tx.setTxInputs(selectedUtxos);
tx.mintAsset(forgingScript, asset);
tx.sendLovelace(bankWalletAddress, costLovelace);
tx.setChangeAddress(recipientAddress);
const _unsignedTx = await tx.build();
const unsignedTx = await appWallet.signTx(_unsignedTx, true);




  res.status(200).json({ unsignedTx: unsignedTx });
}

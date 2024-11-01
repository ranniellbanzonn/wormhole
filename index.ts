import { Wormhole, wormhole } from "@wormhole-foundation/sdk"

import solana from "@wormhole-foundation/sdk/solana"
import evm from "@wormhole-foundation/sdk/evm"

const SOLANA_KEY = "Your Key"; // Secret key
const SEPOLIA_KEY = "Your Key"; // Secret key

(async () => {


	const wh = await wormhole("Testnet", [evm, solana])

	const sendChain = wh.getChain("Sepolia")
	const receiveChain = wh.getChain("Solana")

	const source = await (await evm()).getSigner(sendChain.getRpc(), SEPOLIA_KEY);
	const destination = await (await solana()).getSigner(receiveChain.getRpc(), SOLANA_KEY);

	const sourceAddress = Wormhole.chainAddress(sendChain.chain, source.address());
	const destinationAddress = Wormhole.chainAddress(receiveChain.chain, destination.address());

	const amount = 9_500_000n;
	const automatic = false;

	const transfer = await wh.circleTransfer(
		amount,
		sourceAddress,
		destinationAddress,
		automatic
	)


	const sourceTx = await transfer.initiateTransfer(source);
	console.log("Sending Started: ", sourceTx);

	const timeout = 300 * 1000;

	const attestId = await transfer.fetchAttestation(timeout);
	console.log("Fetch Attestation: ", attestId);

	const destinationTx = await transfer.completeTransfer(destination);
	console.log("Completed Transfer: ", destinationTx);

	console.log("Circle Trasnfer status: ", transfer);

})();

// ACTIVITY: Bridge -> Send USDC via wallet -> Repeat
// Repeat the cycle until it returns to the first guy
// List all the names of the participants
//
// Bridge then Send
//
// Solana to Sepolia -> Send via Sepolia -> Sepolia to Solana -> Send via Solana | Repeat
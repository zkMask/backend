const snarkjs = require("snarkjs");
const fs = require("fs");
const circomlibjs = require("circomlibjs");
async function run() {
  const poseidon = await circomlibjs.buildPoseidon();
  //   const hash = poseidon.F.toString(poseidon([5]));
  const a = process.argv[1];
  const hash = process.argv[2];

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    { a: a, b: hash },
    "./controller/ZKCircuits/circuit_js/circuit.wasm",
    "./controller/ZKCircuits/circuit_final.zkey"
  );

  // console.log("Proof: ");
  // console.log(JSON.stringify(proof, null, 1));
  // console.log("Result: ");
  console.log(publicSignals);

  // const vKey = JSON.parse(fs.readFileSync("./verification_key.json"));

  // const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

  // if (res === true) {
  //   console.log("Verification OK");
  // } else {
  //   console.log("Invalid proof");
  // }
}

run().then(() => {
  process.exit(0);
});

import { dot } from "node:test/reporters";

const User = require("../model/userModel");
const mongoose = require("mongoose");

const snarkjs = require("snarkjs");
const fs = require("fs");
const circomlibjs = require("circomlibjs");
const io = require("./../app.ts");
const ethers = require("ethers");
const dotenv = require("dotenv");

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(
  "https://goerli.infura.io/v3/a4e1ddd82cd94f5baea39f80e2eef866"
);
const pvtKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(pvtKey, provider);

const contractAddress = "0x6187EBe7d3D7fe033E3EA060b15a26fBe157fE01";
const abi = [
  {
    inputs: [],
    name: "TransactionAlreadyExists",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "success",
        type: "bool",
      },
      {
        indexed: true,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "transactionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes4",
        name: "methodId",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "transactionTimestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "transactionBlockNumber",
        type: "uint256",
      },
    ],
    name: "AuthenticationCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "txId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes4",
        name: "methodId",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "transactionTimestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "transactionBlockNumber",
        type: "uint256",
      },
    ],
    name: "InitiateAuthentication",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "txId",
        type: "uint256",
      },
    ],
    name: "completeAuthentication",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "bytes4",
            name: "methodId",
            type: "bytes4",
          },
          {
            internalType: "bytes32[]",
            name: "params",
            type: "bytes32[]",
          },
          {
            internalType: "address",
            name: "contractAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "blockNumber",
            type: "uint256",
          },
        ],
        internalType: "struct ZkMask.Transaction",
        name: "txDetails",
        type: "tuple",
      },
    ],
    name: "initiateAuthentication",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "transactionId",
    outputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "bytes4",
        name: "methodId",
        type: "bytes4",
      },
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "transactionVerified",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const contract = new ethers.Contract(contractAddress, abi, wallet);

exports.getZkHash = async (req: any, res: any) => {
  try {
    const address: string = req.body.address;
    console.log(address);
    //find address in db
    const zkHash = await User.find({ address: address });
    res.status(200).json({
      status: "success",
      data: zkHash[0].hashOfUniqueKey,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      err: err,
    });
  }
};

exports.zkVerify = async (req: any, res: any) => {
  try {
    const zkHash = req.body.zkHash;
    const uk = req.body.uk;
    const txId =
      BigInt(
        44780900082791803674098302287979914212816879419319818127517032167159472225133
      );

    //
    const poseidon = await circomlibjs.buildPoseidon();
    const a = uk;
    // "1120";
    const hash = zkHash;
    //   "14467678450995291425695410446001142759740457319727550794584424937448392560063";

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      { a: a, b: hash },
      "./controller/ZKCircuits/circuit_js/circuit.wasm",
      "./controller/ZKCircuits/circuit_final.zkey"
    );

    // console.log("Proof: ");
    // console.log(JSON.stringify(proof, null, 1));
    // console.log("Result: ");
    // console.log(publicSignals);

    // const vKey = JSON.parse(fs.readFileSync("./verification_key.json"));

    // const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    // if (res === true) {
    //   console.log("Verification OK");
    // } else {
    //   console.log("Invalid proof");
    // }
    res.status(200).json({
      status: "success",
      data: publicSignals[0],
    });
    const flag = publicSignals[0] === "1" ? true : false;
    console.log(txId, typeof txId)
    const tx = await contract.completeAuthentication(flag, txId);
    console.log(tx);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      err: error,
    });
  }
};

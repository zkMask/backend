pragma circom 2.1.4;

include "node_modules/circomlib/circuits/poseidon.circom";
include "node_modules/circomlib/circuits/comparators.circom";
template poseidon() {

   // Your Code here.. 
   signal input a;
   signal input b;
   signal output out;

   component hash = Poseidon(1);
   
   hash.inputs[0] <==a;
   signal check1 <== b - hash.out ;
   component iszero1 = IsZero();
   iszero1.in<==check1;
   out <== iszero1.out;
}

component main = poseidon();
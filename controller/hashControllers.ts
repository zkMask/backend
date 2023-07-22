const circomlibjs = require("circomlibjs");

exports.hash = async (req: any, res: any, next: any) => {
  const uniqueKey = req.body.uniqueKey;
  console.log(uniqueKey);
  const poseidon = await circomlibjs.buildPoseidon();
  const hash = poseidon.F.toString(poseidon([uniqueKey]));
  res.status(200).json({
    status: "success",
    hash: hash,
  });
};

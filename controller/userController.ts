const User = require("../model/userModel");
const crypto = require("crypto");
const fs = require("fs");
const { Request, Response } = require("express");

export const signup = async (req: any, res: any, next: any) => {
  try {
    if (!req.body) {
      return res.status(400).json({ status: "fail", message: "No body" });
    }

    const address = req.body.address;
    const hashOfUniqueKey = req.body.hashOfUniqueKey;
    const photos = req.body.photos;

    // //Generate a random number using crypto
    // const backendGeneratedRandomNumber = await crypto
    //   .randomBytes(20)
    //   .toString("hex");

    // //Generate a unique key using the timestamp and the random number by salt and hashing
    // const uniqueKey = await crypto
    //   .createHash("sha256")
    //   .update(`${timestamp}${backendGeneratedRandomNumber}`)
    //   .digest("hex");

    //create a folder with the unique key
    const folderLocation = `./uploads/${hashOfUniqueKey}`;
    await fs.mkdirSync(folderLocation);

    //save the photos in the folder
    await photos.forEach((photo: any, index: any) => {
      const base64Data = photo.replace(/^data:image\/png;base64,/, "");
      fs.writeFileSync(
        `${folderLocation}/${hashOfUniqueKey}_${index}.png`,
        base64Data,
        "base64"
      );
    });

    const user = await User.create({
      address,
      hashOfUniqueKey,
      folderLocation,
    });

    const resAddress = user.address;

    res.status(201).json({
      status: "success",
      data: {
        address: resAddress,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
    });
  }
};

export const login = async (req: any, res: any, next: any) => {
  try {
    const address = req.body.address;
    if (!address) {
      return res.status(400).json({ status: "fail", message: "No address" });
    }

    //find the user with the address
    User.find({ address: address }).then((user: any) => {
      if (user.length === 0) {
        return res.status(400).json({
          status: "fail",
          message: "No user found",
        });
      } else {
        return res.status(200).json({
          status: "success",
          data: {
            message: "Login Successful",
          },
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
    });
  }
};

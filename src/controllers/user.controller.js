
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res) => {
    //get user details from frontend 
    // validation - not empty 
    // check if user already exist : usename, email
    //check for images, check for avatar 
    // upload them to cloudinary , avatar
    // create user object , create entry in db 
    //remove password and refesh tokens field from response
    // check for user  creation 
    // return res


    const {fullName , email, username , password}=req.body
    console.log("email: ",email);

    if(
        [fullName,email,username,password].some((field)=>field?.trim() === "")
    ) {
throw new ApiError(400,"all fields are  require ")
    }

    const existedUser = User.findOne({
        $or : [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with username or email exist")
    }

   const avatarLocalPath= req.files?.avatar[0]?.path;
   const coverImageLocalPath= req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
    throw new ApiError(400,"Avatar files is require")
   }

   const avatar= await ulpoadCloudinary(avatarLocalPath)
   const coverImage = await uploadCloudinary(coverImageLocalPath)

   if(!avatar){
    throw new ApiError(400,"Avatar files is require")
   }

   const user = await User.create({
    fullName,
    avatar : avatar.url,
    coverimage : coverImage?.url || "",
    email,
    password,
    username : username.toLowerCase()
   })
   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken "
   )

   return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered successfully.")
   )

})

export { registerUser }






// import { asyncHandler } from "../utils/asyncHandler.js";

// const registerUser = asyncHandler(async (req, res) => {
//     return res.status(200).json({
//         message: "API Working"
//     });
// });

// export { registerUser };
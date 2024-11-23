import mongoose from 'mongoose' 

const { Schema, model, Types } = mongoose;


const offerSchema = new Schema({
  offerFor: {
    type: Types.ObjectId,
    required: true,
    refPath: 'offerType',
  },
  offerType: {
    type: String,
    required: true,
    enum: ['Product', 'Category'],
  },

     DiscountPercentage:{
        type:Number,
        required:true
     }
  },
  { timestamps: true }
)

const Offer=model("Offer",offerSchema)
export default Offer
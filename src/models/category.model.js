import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  categoryName: { type: String, required: true },
  categoryImage: { type: String, required: true },
  isBlocked: {
    type: Boolean,
  },
});

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;

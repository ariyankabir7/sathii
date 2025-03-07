const mongoose = require("mongoose");

const CommissionSchema = new mongoose.Schema(
  {
    amountPercentage: { type: Number, default: 0 },
    upperAmount: { type: Number, default: 0 },
    lowerAmount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CommissionSchema.index({ type: -1 });
CommissionSchema.index({ createdAt: -1 });

module.exports = new mongoose.model("Commission", CommissionSchema);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RefreshTokenSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        require: true,
        unique: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    expiresAt: {
        type: Date,
        require: true,
    }
}, { timestamps: true });
const RefreshToken = mongoose_1.default.models.RefreshToken || mongoose_1.default.model("RefreshToken", RefreshTokenSchema);
exports.default = RefreshToken;

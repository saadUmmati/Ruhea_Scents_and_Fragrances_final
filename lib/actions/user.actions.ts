"use server";

import connectToDatabase from "../db/mongoose";
import User, { IUser } from "../db/models/user.model";
import { revalidatePath } from "next/cache";

export async function getUsers({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    try {
        await connectToDatabase();

        const skip = (page - 1) * limit;

        const users = await User.find({})
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments({});
        const totalPages = Math.ceil(totalUsers / limit);

        return {
            users: JSON.parse(JSON.stringify(users)),
            totalPages,
            currentPage: page,
            totalUsers
        };
    } catch (error) {
        console.log(error);
        return { users: [], totalPages: 0, currentPage: 1, totalUsers: 0 };
    }
}

export async function toggleUserBlockStatus(userId: string, isBlocked: boolean) {
    try {
        await connectToDatabase();
        await User.findByIdAndUpdate(userId, { isBlocked });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.log(error);
        return { success: false, error: "Failed to update user status" };
    }
}

export async function updateUserRole(userId: string, role: string) {
    try {
        await connectToDatabase();
        await User.findByIdAndUpdate(userId, { role });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.log(error);
        return { success: false, error: "Failed to update user role" };
    }
}

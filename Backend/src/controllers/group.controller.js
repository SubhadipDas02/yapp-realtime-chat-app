import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const createGroup = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const adminId = req.user._id;

        // Validate members
        const validMembers = await User.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
            return res.status(400).json({ error: "Some members not found" });
        }

        // Create group
        const group = new Group({
            name,
            description,
            admin: adminId,
            members: [...members, adminId], // Include admin in members
        });

        await group.save();

        // Populate the group with member details
        await group.populate('members', '-password');
        await group.populate('admin', '-password');

        res.status(201).json(group);
    } catch (error) {
        console.log("Error in createGroup controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const groups = await Group.find({
            members: userId
        })
        .populate('members', '-password')
        .populate('admin', '-password')
        .sort({ updatedAt: -1 });

        res.status(200).json(groups);
    } catch (error) {
        console.log("Error in getUserGroups controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getGroupMessages = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const userId = req.user._id;

        // Check if user is a member of the group
        const group = await Group.findById(groupId);
        if (!group || !group.members.includes(userId)) {
            return res.status(403).json({ error: "Not authorized to view this group" });
        }

        const messages = await Message.find({
            groupId: groupId,
            isGroup: true
        })
        .populate('senderId', 'fullName profilePic')
        .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getGroupMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendGroupMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: groupId } = req.params;
        const senderId = req.user._id;

        // Check if user is a member of the group
        const group = await Group.findById(groupId);
        if (!group || !group.members.includes(senderId)) {
            return res.status(403).json({ error: "Not authorized to send messages to this group" });
        }

        const newMessage = new Message({
            senderId,
            groupId,
            text,
            image,
            isGroup: true,
        });

        await newMessage.save();
        await newMessage.populate('senderId', 'fullName profilePic');

        // Emit to all group members
        // TODO: Implement socket logic for group messages

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendGroupMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const addMemberToGroup = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const { userId } = req.body;
        const requesterId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check if requester is admin
        if (!group.admin.equals(requesterId)) {
            return res.status(403).json({ error: "Only admin can add members" });
        }

        // Check if user is already a member
        if (group.members.includes(userId)) {
            return res.status(400).json({ error: "User is already a member" });
        }

        group.members.push(userId);
        await group.save();

        await group.populate('members', '-password');
        await group.populate('admin', '-password');

        res.status(200).json(group);
    } catch (error) {
        console.log("Error in addMemberToGroup controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const removeMemberFromGroup = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const { userId } = req.body;
        const requesterId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check if requester is admin
        if (!group.admin.equals(requesterId)) {
            return res.status(403).json({ error: "Only admin can remove members" });
        }

        // Check if trying to remove admin
        if (group.admin.equals(userId)) {
            return res.status(400).json({ error: "Cannot remove admin from group" });
        }

        // Remove member
        group.members = group.members.filter(member => !member.equals(userId));
        await group.save();

        await group.populate('members', '-password');
        await group.populate('admin', '-password');

        res.status(200).json(group);
    } catch (error) {
        console.log("Error in removeMemberFromGroup controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const leaveGroup = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check if user is admin
        if (group.admin.equals(userId)) {
            return res.status(400).json({ error: "Admin cannot leave group. Transfer admin role or delete group." });
        }

        // Remove user from members
        group.members = group.members.filter(member => !member.equals(userId));
        await group.save();

        res.status(200).json({ message: "Left group successfully" });
    } catch (error) {
        console.log("Error in leaveGroup controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteGroup = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const requesterId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check if requester is admin
        if (!group.admin.equals(requesterId)) {
            return res.status(403).json({ error: "Only admin can delete group" });
        }

        // Delete all group messages
        await Message.deleteMany({ groupId });

        // Delete the group
        await Group.findByIdAndDelete(groupId);

        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        console.log("Error in deleteGroup controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

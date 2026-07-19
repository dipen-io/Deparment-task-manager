export interface Message {
    _id?: string;
    senderId: string;
    senderName: string;
    senderType: string; // e.g., 'head' | 'employee'
    message: string;
    createdAt: string;
}
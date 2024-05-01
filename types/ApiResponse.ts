// here we are generalizing the API response for the whole app, not just signup or login
import { Message } from "@/models/user";
export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  // messages?: [Message]
  messages?: Array<Message>;
}

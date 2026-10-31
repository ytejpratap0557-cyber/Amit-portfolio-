import { z } from "zod";
export const types = ["Sponsored Content","Instagram Reels Promotion","YouTube Brand Integration","Product Promotion","Product Review","Creative Campaign","Brand Partnership","Other"] as const;
export const budgets = ["Under ₹10,000","₹10,000 – ₹50,000","₹50,000 – ₹1,00,000","Above ₹1,00,000","Let's discuss"] as const;
export const enquirySchema = z.object({
  name: z.string().trim().min(2,"Enter your full name").max(100),
  company: z.string().trim().max(120).optional(),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().max(20).regex(/^[+\d\s()-]*$/,"Use digits only").optional(),
  type: z.enum(types,{errorMap:()=>({message:"Choose a collaboration type"})}),
  budget: z.string().max(40).optional(),
  message: z.string().trim().min(10,"Add a little more detail (10+ characters)").max(2000),
  website: z.string().max(0).optional(), // honeypot
});
export type Enquiry = z.infer<typeof enquirySchema>;

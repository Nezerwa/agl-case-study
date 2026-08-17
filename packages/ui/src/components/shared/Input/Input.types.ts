import type { InputHTMLAttributes } from "react";

export type InputType = "text" | "email" | "tel";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  type?: InputType;
}

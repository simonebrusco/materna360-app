// app/page.jsx
import { redirect } from "next/navigation";

export default function Index() {
  redirect("/meu-dia");
  return null;
}

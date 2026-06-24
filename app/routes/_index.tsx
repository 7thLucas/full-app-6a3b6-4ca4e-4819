import { redirect } from "react-router";

export function loader() {
  return redirect("/today");
}

export default function IndexPage() {
  return null;
}

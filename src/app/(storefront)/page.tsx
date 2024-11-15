import { CategoriesSelection } from "@/components/CategoriesSelection";
import { Hero } from "@/components/Hero";

export default async function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Hero />
      <CategoriesSelection />
    </div>
  );
}

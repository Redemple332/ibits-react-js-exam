import Image from "next/image";
import Product from "../../components/products/product-list";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
          <Product/>
    </div>
  );
}

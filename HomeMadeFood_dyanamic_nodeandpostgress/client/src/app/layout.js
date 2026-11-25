
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import LayoutContent from "../components/common/LayoutContent";
import "./globals.css";

export const metadata = {
  title: "HomeMade Food",
  description: "Fresh Homemade Food Delivered",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <CartProvider>
            <LayoutContent>{children}</LayoutContent>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

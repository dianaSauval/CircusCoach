// ✅ PÁGINA DE CARRITO (pages/CartPage.jsx)
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import translations from "../i18n/translations";
import EmptyState from "../components/EmptyState/EmptyState";
import "../styles/pages/CartPage.css";
import { simulatePurchase } from "../services/paymentService";

export default function CartPage() {
  const { cart, cartCount, setCart } = useCart();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const t = translations.cart[language];

  const handleClearCart = () => setCart([]);

 const handleCheckout = async () => {
  try {
    const response = await simulatePurchase(cart);
    const { agregados, yaTenia } = response;

    let msg = "✅ " + t.purchaseSuccess;

    if (yaTenia?.length > 0) {
      msg += `\n\n⚠️ ${t.alreadyOwned}:\n` +
        yaTenia.map(item => `• ${item.title?.[language] || item.title?.es}`).join("\n");
    }

    alert(msg);
    setCart([]);
  } catch (error) {
    console.error("Error en la compra simulada:", error);
    alert("❌ " + t.purchaseError);
  }
};

  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  if (!isAuthenticated) {
    return (
      <EmptyState
        title={t.loginRequiredTitle}
        subtitle={t.loginRequiredSubtitle}
      />
    );
  }

  return (
    <div className="cart-page-container">
      <h1>{t.title}</h1>

      {cartCount === 0 ? (
        <EmptyState title={t.emptyTitle} subtitle={t.emptySubtitle} />
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item, index) => (
              <li key={index} className="cart-item">
                <img
                  src={
                    item.image?.[language] ||
                    item.image?.es ||
                    "/placeholder.png"
                  }
                  alt={item.title?.[language] || item.title?.es || "Curso"}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <h3>{item.title?.[language] || item.title?.es}</h3>
                  <p>USD {item.price}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <p className="total-label">{t.total}:</p>
            <p className="total-amount">USD {totalPrice.toFixed(2)}</p>
          </div>

          <div className="cart-buttons">
            <button onClick={handleClearCart} className="btn-clear">
              {t.clear}
            </button>
            <button onClick={handleCheckout} className="btn-buy">
              {t.buy}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
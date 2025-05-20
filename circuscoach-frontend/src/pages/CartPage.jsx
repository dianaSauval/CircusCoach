import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import translations from "../i18n/translations";
import "../styles/pages/CartPage.css";

export default function CartPage() {
  const { cart, cartCount, setCart } = useCart();
  const { language } = useLanguage();
  const t = translations.cart[language];

  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <div className="cart-page-container">
      <h1>{t.title}</h1>

      {cartCount === 0 ? (
        <p className="empty-text">{t.empty}</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item, index) => (
              <li key={index} className="cart-item">
                {t[item.type]} #{item.id} — USD {item.price}
              </li>
            ))}
          </ul>

          <button onClick={handleClearCart} className="clear-cart-btn">
            {t.clear}
          </button>
        </>
      )}
    </div>
  );
}

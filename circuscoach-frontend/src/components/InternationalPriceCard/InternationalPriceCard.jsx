import "./InternationalPriceCard.css";
import { useLanguage } from "../../context/LanguageContext";
import translations from "../../i18n/translations";
import { useCart } from "../../context/CartContext";
import { useState } from "react";

export default function InternationalPriceCard({
  isCourse = false,
  price = 50,
}) {
  const { language } = useLanguage();
  const t = translations.detail[language];
  const { addToCart } = useCart();
  const [showMsg, setShowMsg] = useState(false);


  const handleAdd = () => {
  addToCart({
    type: isCourse ? "course" : "formation",
    id: window.location.pathname.split("/").pop(),
    price,
  });

  setShowMsg(true);
  setTimeout(() => setShowMsg(false), 2000);
};


  return (
    <div className="international-card">
      <h3 className="card-title">{t.priceTitle}</h3>
      <p className="card-price">
        USD {price} / {t.month}
      </p>

      <ul className="card-benefits">
        <li>🎥 {t.benefit_access}</li>
        <li>📄 {t.benefit_downloadable}</li>
        <li>🕒 {t.benefit_24hs}</li>
        <li>📬 {t.benefit_support}</li>
        <li>⏳ {t.benefit_duration}</li>
      </ul>

      <button className="add-to-cart-btn" onClick={handleAdd}>
        {t.addToCart}
      </button>
      {showMsg && (
  <div className="cart-feedback-msg">
    ✅ ¡{t.addedToCart || "Agregado al carrito"}!
  </div>
)}

    </div>
  );
}

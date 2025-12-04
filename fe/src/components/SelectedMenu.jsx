import { Button } from "./ui/button";

export default function SelectedMenu({ items, onConfirm, loading }) {
  console.log("SelectedMenu items:", items);
  const categoryColors = {
    Carbohydrate: "#fde4d0",
    "Protein 1": "#ffe0dbff",
    "Protein 2": "#e1fce1ff",
    Vegetables: "#fff6d3ff",
    Fruit: "#e4f0ffff",
  };

  const textColors = {
    Carbohydrate: "#c2420e",
    "Protein 1": "#bf2d2d",
    "Protein 2": "#1c8442",
    Vegetables: "#b45309",
    Fruit: "#2e6aeb",
  };

  return (
    <section className="selected-menu">
      <h3 className="section-subtitle">Selected Menu</h3>

      <div className="menu-items">
        {Object.entries(items).map(([category, foods]) => (
          <div key={category} className="menu-category">
            <div className="">{category}</div>
            {foods.map((food, idx) => (
              <div
                key={idx}
                className={`h-10 font-semibold rounded-lg flex items-center px-3 capitalize-text`}
                style={{
                  backgroundColor: categoryColors[category],
                  color: textColors[category],
                }}
              >
                {food}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Button className="confirm-btn" onClick={onConfirm} disabled={loading}>
        {loading ? "Confirming..." : "Confirm"}
      </Button>
    </section>
  );
}

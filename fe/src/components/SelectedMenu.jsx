import { Button } from "./ui/button"

export default function SelectedMenu({ items, onConfirm}) {
  const categoryColors = {
    Carbohydrate: "#fde4d0",
    Protein: "#ffe0dbff",
    Vegetables: "#e1fce1ff",
    Fruit: "#fff6d3ff",
    Drink: "#e4f0ffff",
  }

  const textColors = {
    Carbohydrate: "#c2420e",
    Protein: "#bf2d2d",
    Vegetables: "#1c8442",
    Fruit: "#b45309",
    Drink: "#2e6aeb",
  }

  return (
    <section className="selected-menu">
      <h3 className="section-subtitle">Selected Menu</h3>

      <div className="menu-items">
        {Object.entries(items).map(([category, foods]) => (
          <div key={category} className="menu-category">
            <div className="" >
              {category}
            </div>
            {foods.map((food, idx) => (
              <div key={idx} className={`h-10 font-semibold rounded-lg flex items-center px-3`} style={{ backgroundColor: categoryColors[category], color: textColors[category] }}>
                {food}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Button className="confirm-btn" onClick={onConfirm}>Confirm</Button>
    </section>
  )
}

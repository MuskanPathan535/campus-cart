// export default function SellPage({ user, busy, onSubmit }) {
//   return (
//     <div className="page-content">
//       <section className="section-panel sell-page">
//         <div className="section-heading">
//           <div>
//             <span className="eyebrow">Sell item</span>
//             <h2>List your product for campus buyers.</h2>
//           </div>
//         </div>
//         {user ? (
//           <form className="panel-form sell-form" onSubmit={onSubmit}>
//             <input name="title" placeholder="Title" required />
//             <textarea name="description" placeholder="Description" required />
//             <div className="row-two">
//               <input name="price" type="number" min="0" placeholder="Price in INR" required />
//               <select name="category" required defaultValue="">
//                 <option value="" disabled>Select category</option>
//                 <option>Books</option>
//                 <option>Electronics</option>
//                 <option>Cycle</option>
//                 <option>Furniture</option>
//                 <option>Other</option>
//                 <option>Calculator</option>
//               </select>
//             </div>
//             <div className="row-two">
//               <select name="condition" required defaultValue="">
//                 <option value="" disabled>Select condition</option>
//                 <option>New</option>
//                 <option>Like New</option>
//                 <option>Good</option>
//                 <option>Fair</option>
//               </select>
//               <input name="location" placeholder="Hostel / Department" required />
//             </div>
//             <label className="upload-field">
//               Upload image
//               <input name="image" type="file" accept="image/png,image/jpeg,image/webp" />
//             </label>
//             <button className="button button-primary full" disabled={busy} type="submit">
//               {busy ? "Publishing..." : "Submit Listing"}
//             </button>
//           </form>
//         ) : (
//           <div className="empty-state">
//             <h3>Login to sell items</h3>
//             <p>Your profile unlocks listing creation and chat features.</p>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }




// import { useState } from "react";
// import { api } from "../api.js";

// export default function SellPage({ user, busy, onSubmit }) {
//   const [generating, setGenerating] = useState(false);
//   const [aiError, setAiError] = useState("");
//   const [description, setDescription] = useState("");

//   const generateDescription = async (event) => {
//     const form = event.currentTarget.form;

//     const title = form.elements.namedItem("title").value;
//     const category = form.elements.namedItem("category").value;
//     const condition = form.elements.namedItem("condition").value;
//     const price = form.elements.namedItem("price").value;

//     if (!title || !category || !condition) {
//       setAiError("Enter title, category and condition first.");
//       return;
//     }

//     setGenerating(true);
//     setAiError("");

//     try {
//       const data = await api("/ai/description", {
//         method: "POST",
//         body: JSON.stringify({
//           title,
//           category,
//           condition,
//           price
//         })
//       });

//       setDescription(data.description);
//     } catch (error) {
//       setAiError(error.message || "AI generation failed.");
//     } finally {
//       setGenerating(false);
//     }
//   };

//   return (
//     <div className="page-content">
//       <section className="section-panel sell-page">
//         <div className="section-heading">
//           <div>
//             <span className="eyebrow">Sell item</span>
//             <h2>List your product for campus buyers.</h2>
//           </div>
//         </div>

//         {user ? (
//           <form className="panel-form sell-form" onSubmit={onSubmit}>
//             <input
//               name="title"
//               placeholder="Title"
//               required
//             />

//             <div className="row-two">
//               <input
//                 name="price"
//                 type="number"
//                 min="0"
//                 placeholder="Price in INR"
//                 required
//               />

//               <select name="category" required defaultValue="">
//                 <option value="" disabled>Select category</option>
//                 <option>Books</option>
//                 <option>Electronics</option>
//                 <option>Cycle</option>
//                 <option>Furniture</option>
//                 <option>Hostel</option>
//                 <option>Calculator</option>
//               </select>
//             </div>

//             <div className="row-two">
//               <select name="condition" required defaultValue="">
//                 <option value="" disabled>Select condition</option>
//                 <option>New</option>
//                 <option>Like New</option>
//                 <option>Good</option>
//                 <option>Fair</option>
//               </select>

//               <input
//                 name="location"
//                 placeholder=" Department"
//                 required
//               />
//             </div>

//             <button
//               type="button"
//               className="button button-secondary"
//               onClick={generateDescription}
//               disabled={generating || busy}
//             >
//               {generating
//                 ? "Generating description..."
//                 : "✨ Generate Description with AI"}
//             </button>

//             {aiError && (
//               <p role="alert" style={{ color: "red" }}>
//                 {aiError}
//               </p>
//             )}

//             <textarea
//               name="description"
//               placeholder="Product description"
//               value={description}
//               onChange={(event) => setDescription(event.target.value)}
//               required
//             />

//             <label className="upload-field">
//               Upload image
//               <input
//                 name="image"
//                 type="file"
//                 accept="image/png,image/jpeg,image/webp"
//               />
//             </label>

//             <button
//               className="button button-primary full"
//               disabled={busy || generating}
//               type="submit"
//             >
//               {busy ? "Publishing..." : "Submit Listing"}
//             </button>
//           </form>
//         ) : (
//           <div className="empty-state">
//             <h3>Login to sell items</h3>
//             <p>
//               Your profile unlocks listing creation and chat features.
//             </p>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }





import { useState } from "react";
import { api } from "../api.js";

export default function SellPage({ user, busy, onSubmit }) {
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [description, setDescription] = useState("");

  const [suggestingPrice, setSuggestingPrice] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [priceSuggestion, setPriceSuggestion] = useState(null);

  // Get product details from the form
  const getProductDetails = (form) => ({
    title: form.elements.namedItem("title").value.trim(),
    category: form.elements.namedItem("category").value,
    condition: form.elements.namedItem("condition").value,
    price: form.elements.namedItem("price").value,
    description: form.elements.namedItem("description").value
  });

  // FEATURE 1: Generate product description using Gemini
  const generateDescription = async (event) => {
    const form = event.currentTarget.form;
    const { title, category, condition, price } =
      getProductDetails(form);

    if (!title || !category || !condition) {
      setAiError(
        "Please enter title, category and condition first."
      );
      return;
    }

    setGenerating(true);
    setAiError("");

    try {
      const data = await api("/ai/description", {
        method: "POST",
        body: JSON.stringify({
          title,
          category,
          condition,
          price
        })
      });

      if (!data.description) {
        throw new Error("AI did not return a description.");
      }

      setDescription(data.description);
    } catch (error) {
      setAiError(
        error.message || "Failed to generate description."
      );
    } finally {
      setGenerating(false);
    }
  };

  // FEATURE 2: Suggest a resale price using Gemini
  const suggestPrice = async (event) => {
    const form = event.currentTarget.form;

    const {
      title,
      category,
      condition,
      description
    } = getProductDetails(form);

    if (!title || !category || !condition) {
      setPriceError(
        "Please enter title, category and condition first."
      );
      return;
    }

    setSuggestingPrice(true);
    setPriceError("");
    setPriceSuggestion(null);

    try {
      const data = await api("/ai/suggest-price", {
        method: "POST",
        body: JSON.stringify({
          title,
          category,
          condition,
          description
        })
      });

      const minPrice = Number(data.minPrice);
      const maxPrice = Number(data.maxPrice);

      if (
        !Number.isFinite(minPrice) ||
        !Number.isFinite(maxPrice) ||
        minPrice < 0 ||
        maxPrice < minPrice
      ) {
        throw new Error(
          "AI returned an invalid price range."
        );
      }

      setPriceSuggestion({
        minPrice,
        maxPrice,
        reason: data.reason || ""
      });
    } catch (error) {
      setPriceError(
        error.message || "Failed to suggest price."
      );
    } finally {
      setSuggestingPrice(false);
    }
  };

  // Fill the price field with the AI suggested price
  const useSuggestedPrice = (event) => {
    if (!priceSuggestion) return;

    const form = event.currentTarget.form;
    const priceInput = form.elements.namedItem("price");

    const suggestedPrice = Math.round(
      (priceSuggestion.minPrice +
        priceSuggestion.maxPrice) / 2
    );

    priceInput.value = suggestedPrice;
    setPriceSuggestion(null);
  };

  return (
    <div className="page-content">
      <section className="section-panel sell-page">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Sell item</span>
            <h2>
              List your product for campus buyers.
            </h2>
          </div>
        </div>

        {user ? (
          <form
            className="panel-form sell-form"
            onSubmit={onSubmit}
          >
            {/* Product title */}
            <input
              name="title"
              placeholder="Product title"
              required
            />

            {/* Price and category */}
            <div className="row-two">
              <input
                name="price"
                type="number"
                min="0"
                placeholder="Price in INR"
                required
              />

              <select
                name="category"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select category
                </option>
                <option>Books</option>
                <option>Electronics</option>
                <option>Cycle</option>
                <option>Furniture</option>
                <option>Hostel</option>
                <option>Calculator</option>
              </select>
            </div>

            {/* Condition and location */}
            <div className="row-two">
              <select
                name="condition"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select condition
                </option>
                <option>New</option>
                <option>Like New</option>
                <option>Good</option>
                <option>Fair</option>
              </select>

              <input
                name="location"
                placeholder="Hostel / Department"
                required
              />
            </div>

            {/* AI PRICE SUGGESTION */}
            <button
              type="button"
              className="button button-secondary"
              onClick={suggestPrice}
              disabled={
                suggestingPrice || generating || busy
              }
            >
              {suggestingPrice
                ? "Analyzing product..."
                : "✨ Suggest Price with AI"}
            </button>

            {priceError && (
              <p role="alert" style={{ color: "red" }}>
                {priceError}
              </p>
            )}

            {priceSuggestion && (
              <div className="price-suggestion">
                <h3>✨ AI Suggested Price</h3>

                <h2>
                  ₹{priceSuggestion.minPrice.toLocaleString("en-IN")}
                  {" – "}
                  ₹{priceSuggestion.maxPrice.toLocaleString("en-IN")}
                </h2>

                <p>{priceSuggestion.reason}</p>

                <button
                  type="button"
                  className="button button-primary"
                  onClick={useSuggestedPrice}
                >
                  Use Suggested Price
                </button>
              </div>
            )}

            {/* AI DESCRIPTION GENERATOR */}
            <button
              type="button"
              className="button button-secondary"
              onClick={generateDescription}
              disabled={
                generating || suggestingPrice || busy
              }
            >
              {generating
                ? "Generating description..."
                : "✨ Generate Description with AI"}
            </button>

            {aiError && (
              <p role="alert" style={{ color: "red" }}>
                {aiError}
              </p>
            )}

            {/* Editable product description */}
            <textarea
              name="description"
              placeholder="Product description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              required
            />

            {/* Product image */}
            <label className="upload-field">
              Upload image
              <input
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
              />
            </label>

            {/* Submit listing */}
            <button
              className="button button-primary full"
              type="submit"
              disabled={
                busy || generating || suggestingPrice
              }
            >
              {busy
                ? "Publishing..."
                : "Submit Listing"}
            </button>
          </form>
        ) : (
          <div className="empty-state">
            <h3>Login to sell items</h3>
            <p>
              Your profile unlocks listing creation
              and chat features.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
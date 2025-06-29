const axios = require("axios");

const BASE_URL = "http://localhost:3000";

async function testRestaurantAPI() {
    console.log("Testing restaurant API...\n");

    try {
        // Get all menu items
        console.log("1. Getting all menu items...");
        const menuResponse = await axios.get(`${BASE_URL}/restaurant/menu`);
        console.log("Menu items:", JSON.stringify(menuResponse.data, null, 2));

        // If no menu items, let's create some sample data
        if (menuResponse.data.length === 0) {
            console.log("\n2. Creating sample menu items...");

            const sampleItems = [
                {
                    item_name: "Paratha & Dal",
                    item_price: 649.25,
                    food_type: "breakfast",
                    description:
                        "Traditional breakfast with paratha and lentil curry, served with fresh ingredients",
                    availability: true,
                },
                {
                    item_name: "Luchi & Bor Digh",
                    item_price: 649.25,
                    food_type: "breakfast",
                    description:
                        "Bengali breakfast with luchi and spiced buttermilk",
                    availability: true,
                },
                {
                    item_name: "Khichuri",
                    item_price: 649.25,
                    food_type: "breakfast",
                    description:
                        "Comfort food rice and lentil dish perfect for breakfast",
                    availability: true,
                },
                {
                    item_name: "Butter Chicken",
                    item_price: 649.25,
                    food_type: "dinner",
                    description:
                        "Rich and creamy tomato-based chicken curry with aromatic spices",
                    availability: true,
                },
                {
                    item_name: "Grilled Salmon",
                    item_price: 649.25,
                    food_type: "dinner",
                    description:
                        "Fresh salmon grilled to perfection with herbs and lemon",
                    availability: true,
                },
                {
                    item_name: "Chicken Biryani",
                    item_price: 649.25,
                    food_type: "dinner",
                    description:
                        "Aromatic basmati rice cooked with tender chicken and spices",
                    availability: true,
                },
                {
                    item_name: "Crispy Spring Rolls",
                    item_price: 649.25,
                    food_type: "snack",
                    description:
                        "Golden fried spring rolls with vegetables and sweet chili dipping sauce",
                    availability: true,
                },
                {
                    item_name: "Mini Samosas",
                    item_price: 649.25,
                    food_type: "snack",
                    description:
                        "Bite-sized crispy pastries filled with spiced potatoes and peas",
                    availability: true,
                },
                {
                    item_name: "Cheese Nachos",
                    item_price: 649.25,
                    food_type: "snack",
                    description:
                        "Crispy tortilla chips topped with melted cheese and jalapeños",
                    availability: true,
                },
                {
                    item_name: "Fresh Orange Juice",
                    item_price: 649.25,
                    food_type: "beverage",
                    description:
                        "Freshly squeezed orange juice packed with vitamin C",
                    availability: true,
                },
                {
                    item_name: "Mango Lassi",
                    item_price: 649.25,
                    food_type: "beverage",
                    description:
                        "Traditional yogurt-based drink with sweet mango flavor",
                    availability: true,
                },
                {
                    item_name: "Watermelon Cooler",
                    item_price: 649.25,
                    food_type: "beverage",
                    description:
                        "Refreshing watermelon juice with mint and lime",
                    availability: true,
                },
                {
                    item_name: "Cheesecake Delight",
                    item_price: 649.25,
                    food_type: "dessert",
                    description:
                        "Rich and creamy cheesecake with berry compote",
                    availability: true,
                },
                {
                    item_name: "Gulab Jamun",
                    item_price: 649.25,
                    food_type: "dessert",
                    description:
                        "Traditional sweet dumplings in rose-flavored syrup",
                    availability: true,
                },
                {
                    item_name: "Chocolate Lava Cake",
                    item_price: 649.25,
                    food_type: "dessert",
                    description:
                        "Warm chocolate cake with molten chocolate center",
                    availability: true,
                },
            ];

            for (const item of sampleItems) {
                try {
                    const createResponse = await axios.post(
                        `${BASE_URL}/restaurant/menu`,
                        item
                    );
                    console.log(`✅ Created: ${item.item_name}`);
                } catch (error) {
                    console.log(
                        `❌ Failed to create ${item.item_name}:`,
                        error.response?.data
                    );
                }
            }

            // Get updated menu
            console.log("\n3. Getting updated menu...");
            const updatedMenuResponse = await axios.get(
                `${BASE_URL}/restaurant/menu`
            );
            console.log("Updated menu count:", updatedMenuResponse.data.length);
        }
    } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
    }
}

testRestaurantAPI();

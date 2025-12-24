/**
 * Chavez Bootcamp - 50 Meals Database
 * Quick 10-minute meal prep recipes
 */

export const foodFixes = {
    breakfast: [
        { name: "Power Oats", desc: "Oats, protein scoop, peanut butter, water. Microwave 2 mins.", cal: 450 },
        { name: "Egg Scramble", desc: "3 eggs, spinach handful, salt. Pan fry 5 mins.", cal: 240 },
        { name: "Greek Yogurt Bowl", desc: "1 cup Greek yogurt, berries, honey drizzle.", cal: 200 },
        { name: "Avocado Toast", desc: "2 slices whole wheat, 1/2 avocado, red pepper flakes.", cal: 350 },
        { name: "Protein Smoothie", desc: "Banana, whey protein, almond milk, ice. Blend.", cal: 300 },
        { name: "Cottage Cheese Mix", desc: "1 cup cottage cheese, pineapple chunks.", cal: 220 },
        { name: "Breakfast Wrap", desc: "Tortilla, 2 eggs scrambled, salsa, cheese.", cal: 400 },
        { name: "PB Banana Toast", desc: "2 slices toast, 2 tbsp PB, sliced banana.", cal: 450 },
        { name: "Hard Boiled Kit", desc: "3 hard boiled eggs, apple, almonds.", cal: 350 },
        { name: "Overnight Oats", desc: "Soaked oats in milk/whey overnight. Grab and go.", cal: 400 },
        { name: "Smoked Salmon Bagel", desc: "Half bagel, cream cheese, smoked salmon.", cal: 300 },
        { name: "Egg Whites & Rice", desc: "1 cup egg whites, 1/2 cup instant rice. Fast carbs/protein.", cal: 250 }
    ],
    lunch: [
        { name: "Tuna Salad", desc: "Can of tuna, light mayo, celery. Eat with crackers.", cal: 300 },
        { name: "Chicken Wrap", desc: "Pre-cooked chicken strips, lettuce, ranch, tortilla.", cal: 450 },
        { name: "Turkey Sandwich", desc: "3 slices turkey, mustard, lettuce, whole wheat bread.", cal: 320 },
        { name: "Bagged Salad + Tuna", desc: "Store bought salad kit + can of tuna.", cal: 350 },
        { name: "Rice Bowl Quick", desc: "Microwave rice cup, rotisserie chicken, soy sauce.", cal: 500 },
        { name: "Pasta Leftover", desc: "Leftover pasta, add can of chicken breast.", cal: 550 },
        { name: "Quesadilla", desc: "Tortilla, cheese, canned black beans. Pan fry.", cal: 400 },
        { name: "Sardines & Rice", desc: "Tin of sardines in oil, microwave rice, hot sauce.", cal: 450 },
        { name: "Hummus Plate", desc: "Container of hummus, pita bread, cucumber slices.", cal: 350 },
        { name: "Beef Jerky Meal", desc: "Large bag beef jerky, banana, handful of almonds.", cal: 400 }
    ],
    dinner: [
        { name: "Ground Beef Stir Fry", desc: "Ground beef, frozen veg mix, soy sauce. Pan fry.", cal: 600 },
        { name: "Salmon Air Fry", desc: "Salmon fillet, asparagus, olive oil. Air fry 10 mins.", cal: 500 },
        { name: "Steak & Eggs", desc: "Thin steak (quick fry), 2 eggs.", cal: 700 },
        { name: "Chicken Thighs", desc: "Boneless thighs, salt/pepper, pan sear.", cal: 500 },
        { name: "Taco Bowl", desc: "Ground beef, salsa, cheese, lettuce (no shell).", cal: 550 },
        { name: "Shrimp Scampi", desc: "Frozen shrimp (thawed), garlic, butter, quick sauté.", cal: 400 },
        { name: "Burger Patty Salad", desc: "2 beef patties, cheese, over chopped lettuce/pickle.", cal: 600 },
        { name: "Omelette for Dinner", desc: "4 eggs, cheese, ham, mushrooms.", cal: 500 },
        { name: "Rotisserie Feast", desc: "Half rotisserie chicken (skinless), bagged salad.", cal: 600 },
        { name: "Sausage & Peppers", desc: "Sliced sausage, bell peppers, onion. Sauté.", cal: 650 }
    ],
    snacks: [
        { name: "Almonds", desc: "Handful of raw almonds.", cal: 160 },
        { name: "Protein Shake", desc: "1 scoop whey, water.", cal: 120 },
        { name: "Apple", desc: "Just an apple.", cal: 95 },
        { name: "String Cheese", desc: "2 sticks.", cal: 160 },
        { name: "Greek Yogurt", desc: "Single serve cup.", cal: 120 },
        { name: "Rice Cakes", desc: "2 cakes, thin layer peanut butter.", cal: 200 },
        { name: "Beef Jerky", desc: "Small pack.", cal: 100 },
        { name: "Protein Bar", desc: "Standard bar.", cal: 200 },
        { name: "Carrot Sticks", desc: "With hummus dip.", cal: 150 },
        { name: "Dark Chocolate", desc: "2 squares (85%).", cal: 120 },
        { name: "Walnuts", desc: "Handful.", cal: 180 },
        { name: "Banana", desc: "One medium banana.", cal: 105 },
        { name: "Cottage Cheese", desc: "Small cup.", cal: 110 },
        { name: "Boiled Egg", desc: "One large egg.", cal: 78 },
        { name: "Popcorn", desc: "Air popped, light salt.", cal: 100 },
        { name: "Celery & PB", desc: "Celery stick, 1 tbsp PB.", cal: 150 },
        { name: "Edamame", desc: "Steamed, salted.", cal: 120 },
        { name: "Milk", desc: "Glass of whole milk.", cal: 150 }
    ]
};

// Flatten all meals for easy access
export const allMeals = [
    ...foodFixes.breakfast.map(m => ({ ...m, category: 'breakfast' })),
    ...foodFixes.lunch.map(m => ({ ...m, category: 'lunch' })),
    ...foodFixes.dinner.map(m => ({ ...m, category: 'dinner' })),
    ...foodFixes.snacks.map(m => ({ ...m, category: 'snack' }))
];

export default foodFixes;

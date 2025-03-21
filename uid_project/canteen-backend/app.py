from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)  # Allow frontend access

# Connect to MongoDB Atlas
client = MongoClient("mongodb+srv://sai_siddhu07:kbPb7FPEtn9Lc98n@cluster0.9yjva.mongodb.net/")
db = client["canteen"]  # Database

# Collections for different canteens
canteens = {
    "IT": db["it_menu"],
    "MBA": db["mba_menu"],
    "Main": db["main_menu"]
}

# Default menus (initialize if empty)
default_menus = {
    "IT": [
        {"name": "Chicken Biryani", "price": 150},
        {"name": "Mutton Biryani", "price": 200},
        {"name": "Egg Biryani", "price": 120},
    ],
    "MBA": [
        {"name": "Veg Biryani", "price": 100},
        {"name": "Veg Fried Rice", "price": 90},
        {"name": "Hakka Noodles", "price": 95},
    ],
    "Main": [
        {"name": "Idli & Sambar", "price": 30},
        {"name": "Dosa (Masala/Plain)", "price": "40/30"},
        {"name": "Vada (2 pieces)", "price": 25},
    ]
}

# Initialize menus if collections are empty
for canteen, collection in canteens.items():
    if collection.count_documents({}) == 0:
        collection.insert_many(default_menus[canteen])
        print(f"✅ {canteen} menu initialized in MongoDB!")

# API to get menu by canteen
@app.route('/menu/<canteen>', methods=['GET'])
def get_menu(canteen):
    if canteen in canteens:
        menu = list(canteens[canteen].find({}, {"_id": 0}))
        return jsonify(menu)
    return jsonify({"error": "Invalid canteen name"}), 400

# API to add/update a menu item
@app.route('/menu/<canteen>', methods=['POST'])
def add_menu_item(canteen):
    if canteen in canteens:
        data = request.json
        canteens[canteen].update_one({"name": data["name"]}, {"$set": data}, upsert=True)
        return jsonify({"message": f"{canteen} menu updated"})
    return jsonify({"error": "Invalid canteen name"}), 400

# API to delete a menu item
@app.route('/menu/<canteen>/<item_name>', methods=['DELETE'])
def delete_menu_item(canteen, item_name):
    if canteen in canteens:
        canteens[canteen].delete_one({"name": item_name})
        return jsonify({"message": f"Item deleted from {canteen} menu"})
    return jsonify({"error": "Invalid canteen name"}), 400

if __name__ == '__main__':
    app.run(debug=True)

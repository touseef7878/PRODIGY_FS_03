from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import random
import uuid
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///localstore.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS for frontend integration
CORS(app)

db = SQLAlchemy(app)

# Database Models
class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    stock = db.Column(db.Integer, nullable=False, default=0)
    rating = db.Column(db.Float, default=0.0)
    reviews_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    reviews = db.relationship('Review', backref='product', cascade='all, delete-orphan')
    order_items = db.relationship('OrderItem', backref='product')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'image': self.image,
            'category': self.category,
            'stock': self.stock,
            'rating': round(self.rating, 1),
            'reviews': self.reviews_count,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    orders = db.relationship('Order', backref='user')
    reviews = db.relationship('Review', backref='user')
    
    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')  # pending, completed, cancelled, failed
    payment_method = db.Column(db.String(20), nullable=False)  # jazzcash, easypaisa
    payment_phone = db.Column(db.String(20), nullable=False)
    
    # Shipping Information
    shipping_address = db.Column(db.String(200), nullable=False)
    shipping_city = db.Column(db.String(50), nullable=False)
    shipping_postal_code = db.Column(db.String(10), nullable=False)
    shipping_country = db.Column(db.String(50), nullable=False, default='Pakistan')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    order_items = db.relationship('OrderItem', backref='order', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'user_id': self.user_id,
            'total_amount': self.total_amount,
            'status': self.status,
            'payment_method': self.payment_method,
            'payment_phone': self.payment_phone,
            'shipping_address': self.shipping_address,
            'shipping_city': self.shipping_city,
            'shipping_postal_code': self.shipping_postal_code,
            'shipping_country': self.shipping_country,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.order_items],
            'user': self.user.to_dict() if self.user else None
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)  # Price at time of order
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else None,
            'product_image': self.product.image if self.product else None,
            'quantity': self.quantity,
            'price': self.price,
            'total': self.quantity * self.price
        }

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'user_id': self.user_id,
            'user_name': f"{self.user.first_name} {self.user.last_name}" if self.user else "Anonymous",
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# Helper Functions
def generate_order_number():
    """Generate unique order number"""
    return f"LS{datetime.now().strftime('%Y%m%d')}{random.randint(1000, 9999)}"

def simulate_payment(method, phone_number, amount):
    """Simulate payment processing with JazzCash/EasyPaisa"""
    # Simulate 80% success rate
    success = random.random() < 0.8
    
    if success:
        transaction_id = f"{method.upper()}{random.randint(100000, 999999)}"
        return {
            'success': True,
            'transaction_id': transaction_id,
            'message': f'Payment successful via {method.title()}'
        }
    else:
        return {
            'success': False,
            'transaction_id': None,
            'message': f'Payment failed. Please check your {method.title()} account and try again.'
        }

# API Routes

# Products Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all products with optional filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        category = request.args.get('category')
        search = request.args.get('search')
        sort_by = request.args.get('sort', 'name')
        
        query = Product.query
        
        # Apply filters
        if category:
            query = query.filter(Product.category == category)
        
        if search:
            query = query.filter(
                db.or_(
                    Product.name.contains(search),
                    Product.description.contains(search)
                )
            )
        
        # Apply sorting
        if sort_by == 'price-low':
            query = query.order_by(Product.price.asc())
        elif sort_by == 'price-high':
            query = query.order_by(Product.price.desc())
        elif sort_by == 'rating':
            query = query.order_by(Product.rating.desc())
        else:
            query = query.order_by(Product.name.asc())
        
        products = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'products': [product.to_dict() for product in products.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': products.total,
                'pages': products.pages
            }
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product by ID"""
    try:
        product = Product.query.get_or_404(product_id)
        return jsonify({
            'success': True,
            'product': product.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/products', methods=['POST'])
def create_product():
    """Create new product (Admin only)"""
    try:
        data = request.get_json()
        
        product = Product(
            name=data['name'],
            description=data['description'],
            price=float(data['price']),
            image=data['image'],
            category=data['category'],
            stock=int(data['stock'])
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product created successfully',
            'product': product.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update product (Admin only)"""
    try:
        product = Product.query.get_or_404(product_id)
        data = request.get_json()
        
        product.name = data.get('name', product.name)
        product.description = data.get('description', product.description)
        product.price = float(data.get('price', product.price))
        product.image = data.get('image', product.image)
        product.category = data.get('category', product.category)
        product.stock = int(data.get('stock', product.stock))
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product updated successfully',
            'product': product.to_dict()
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete product (Admin only)"""
    try:
        product = Product.query.get_or_404(product_id)
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product deleted successfully'
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# Orders Routes
@app.route('/api/orders', methods=['POST'])
def create_order():
    """Create new order"""
    try:
        data = request.get_json()
        
        # Create or get user
        user_data = data['customer']
        user = User.query.filter_by(email=user_data['email']).first()
        
        if not user:
            user = User(
                first_name=user_data['firstName'],
                last_name=user_data['lastName'],
                email=user_data['email'],
                phone=user_data['phone']
            )
            db.session.add(user)
            db.session.flush()  # Get user ID
        
        # Calculate total amount
        cart_items = data['items']
        total_amount = 0
        order_items_data = []
        
        for item in cart_items:
            product = Product.query.get(item['id'])
            if not product:
                return jsonify({
                    'success': False, 
                    'message': f'Product with ID {item["id"]} not found'
                }), 404
            
            if product.stock < item['quantity']:
                return jsonify({
                    'success': False, 
                    'message': f'Insufficient stock for {product.name}'
                }), 400
            
            item_total = product.price * item['quantity']
            total_amount += item_total
            
            order_items_data.append({
                'product': product,
                'quantity': item['quantity'],
                'price': product.price
            })
        
        # Create order
        order = Order(
            order_number=generate_order_number(),
            user_id=user.id,
            total_amount=total_amount,
            payment_method=data['payment']['method'],
            payment_phone=data['payment']['phoneNumber'],
            shipping_address=data['shipping']['address'],
            shipping_city=data['shipping']['city'],
            shipping_postal_code=data['shipping']['postalCode'],
            shipping_country=data['shipping']['country']
        )
        
        db.session.add(order)
        db.session.flush()  # Get order ID
        
        # Process payment
        payment_result = simulate_payment(
            data['payment']['method'],
            data['payment']['phoneNumber'],
            total_amount
        )
        
        if payment_result['success']:
            order.status = 'completed'
            
            # Create order items and update product stock
            for item_data in order_items_data:
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=item_data['product'].id,
                    quantity=item_data['quantity'],
                    price=item_data['price']
                )
                db.session.add(order_item)
                
                # Update product stock
                item_data['product'].stock -= item_data['quantity']
            
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Order placed successfully',
                'order': order.to_dict(),
                'payment': payment_result
            }), 201
        
        else:
            order.status = 'failed'
            db.session.commit()
            
            return jsonify({
                'success': False,
                'message': payment_result['message'],
                'order': order.to_dict(),
                'payment': payment_result
            }), 400
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get orders with optional filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        user_id = request.args.get('user_id')
        
        query = Order.query
        
        if status:
            query = query.filter(Order.status == status)
        
        if user_id:
            query = query.filter(Order.user_id == user_id)
        
        orders = query.order_by(Order.created_at.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'orders': [order.to_dict() for order in orders.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': orders.total,
                'pages': orders.pages
            }
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Get single order by ID"""
    try:
        order = Order.query.get_or_404(order_id)
        return jsonify({
            'success': True,
            'order': order.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/orders/<order_number>/track', methods=['GET'])
def track_order(order_number):
    """Track order by order number"""
    try:
        order = Order.query.filter_by(order_number=order_number).first_or_404()
        
        # Simulate order tracking stages
        stages = [
            {'name': 'Order Placed', 'completed': True, 'date': order.created_at.isoformat()},
            {'name': 'Payment Confirmed', 'completed': order.status == 'completed', 'date': order.created_at.isoformat() if order.status == 'completed' else None},
            {'name': 'Processing', 'completed': order.status == 'completed', 'date': None},
            {'name': 'Shipped', 'completed': False, 'date': None},
            {'name': 'Delivered', 'completed': False, 'date': None}
        ]
        
        return jsonify({
            'success': True,
            'order': order.to_dict(),
            'tracking_stages': stages
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Payment Routes
@app.route('/api/payments/simulate', methods=['POST'])
def simulate_payment_endpoint():
    """Simulate payment processing"""
    try:
        data = request.get_json()
        
        result = simulate_payment(
            data['method'],
            data['phone_number'],
            data['amount']
        )
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Reviews Routes
@app.route('/api/products/<int:product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    """Get reviews for a product"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        reviews = Review.query.filter_by(product_id=product_id)\
            .order_by(Review.created_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'success': True,
            'reviews': [review.to_dict() for review in reviews.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': reviews.total,
                'pages': reviews.pages
            }
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/products/<int:product_id>/reviews', methods=['POST'])
def add_product_review(product_id):
    """Add review for a product"""
    try:
        data = request.get_json()
        product = Product.query.get_or_404(product_id)
        
        # For this demo, we'll create a user if they don't exist
        user = User.query.filter_by(email=data['user_email']).first()
        if not user:
            user = User(
                first_name=data.get('user_name', 'Anonymous').split()[0],
                last_name=data.get('user_name', 'User').split()[-1],
                email=data['user_email'],
                phone=data.get('user_phone', '0300-0000000')
            )
            db.session.add(user)
            db.session.flush()
        
        review = Review(
            product_id=product_id,
            user_id=user.id,
            rating=int(data['rating']),
            comment=data.get('comment', '')
        )
        
        db.session.add(review)
        
        # Update product rating
        all_reviews = Review.query.filter_by(product_id=product_id).all()
        total_rating = sum(r.rating for r in all_reviews) + review.rating
        total_reviews = len(all_reviews) + 1
        
        product.rating = total_rating / total_reviews
        product.reviews_count = total_reviews
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Review added successfully',
            'review': review.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# Categories Route
@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all product categories"""
    try:
        categories = db.session.query(Product.category).distinct().all()
        category_list = [cat[0] for cat in categories]
        
        return jsonify({
            'success': True,
            'categories': category_list
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Health Check
@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check"""
    return jsonify({
        'success': True,
        'message': 'LocalStore API is running',
        'timestamp': datetime.utcnow().isoformat()
    })

# Root route
@app.route('/', methods=['GET'])
def root():
    """Root route with API information"""
    return jsonify({
        'message': 'Welcome to the LocalStore E-Commerce API',
        'version': '1.0',
        'documentation': 'Please refer to the README.md file for API documentation',
        'endpoints': {
            'products': '/api/products',
            'orders': '/api/orders',
            'categories': '/api/categories',
            'health_check': '/api/health'
        }
    })

# Initialize Database with Sample Data
def init_db():
    """Initialize database with sample data"""
    db.create_all()
    
    # Check if products already exist
    if Product.query.count() == 0:
        sample_products = [
            {
                'name': 'Premium Wireless Headphones',
                'description': 'High-quality wireless headphones with noise cancellation and premium sound quality.',
                'price': 8999.0,
                'image': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
                'category': 'Electronics',
                'stock': 15,
                'rating': 4.5,
                'reviews_count': 128
            },
            {
                'name': 'Organic Cotton T-Shirt',
                'description': 'Soft and comfortable organic cotton t-shirt available in multiple colors.',
                'price': 1299.0,
                'image': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
                'category': 'Clothing',
                'stock': 32,
                'rating': 4.2,
                'reviews_count': 85
            },
            {
                'name': 'Smart Fitness Watch',
                'description': 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.',
                'price': 12999.0,
                'image': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
                'category': 'Electronics',
                'stock': 8,
                'rating': 4.7,
                'reviews_count': 203
            },
            {
                'name': 'Artisan Coffee Beans',
                'description': 'Premium roasted coffee beans sourced from the finest plantations.',
                'price': 1599.0,
                'image': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
                'category': 'Food',
                'stock': 24,
                'rating': 4.8,
                'reviews_count': 167
            },
            {
                'name': 'Minimalist Backpack',
                'description': 'Sleek and functional backpack perfect for work, travel, and everyday use.',
                'price': 3999.0,
                'image': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
                'category': 'Accessories',
                'stock': 18,
                'rating': 4.4,
                'reviews_count': 94
            },
            {
                'name': 'Ceramic Plant Pot',
                'description': 'Beautiful handcrafted ceramic pot perfect for your indoor plants.',
                'price': 899.0,
                'image': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
                'category': 'Home',
                'stock': 45,
                'rating': 4.3,
                'reviews_count': 76
            }
        ]
        
        for product_data in sample_products:
            product = Product(**product_data)
            db.session.add(product)
        
        db.session.commit()
        print("Sample products added to database")

if __name__ == '__main__':
    with app.app_context():
        init_db()
    
    app.run(debug=True, host='0.0.0.0', port=5000)
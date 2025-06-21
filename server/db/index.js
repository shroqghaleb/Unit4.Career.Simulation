const client = require('./client');

const {
  createReview
} = require('./review')
const {
  createUser
} = require('./user')
const {
  createProduct
} = require('./products')

const seed = async () => {
    const SQL = `
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
    
    CREATE TABLE users (
      id UUID PRIMARY KEY,
      username VARCHAR(200) NOT NULL UNIQUE,
      password VARCHAR(200) NOT NULL,
      isAdmin BOOLEAN DEFAULT FALSE NOT NULL
    );

    CREATE TABLE products (
      id UUID PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL
    );

    CREATE TABLE reviews (
      id UUID PRIMARY KEY,
      product_id UUID REFERENCES products(id) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      rating INTEGER NOT NULL,
      review_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now(),
      CONSTRAINT product_and_user_id UNIQUE(product_id, user_id)
    );
    `;
    await client.query(SQL);

    const [book1, book2, book3, book4, book5] = await Promise.all([
      createProduct({ name: 'Think and Grow Rich', description: 'Motivational self-help classic by Napoleon Hill.', price: 9.75 }),
      createProduct({ name: 'Big Magic', description: 'Elizabeth Gilbert explores creativity, fear, and how to live a creative life.', price: 14.75 }),
      createProduct({ name: 'The Book Thief', description: 'A beautiful WWII-era story narrated by Death, filled with emotion and humanity.', price: 12.95 }),
      createProduct({ name: 'The Four Agreements', description: 'Simple wisdom for personal freedom by Don Miguel Ruiz.', price: 8.49 }),
      createProduct({ name: 'The Power of Now', description: 'A guide to living in the present moment by Eckhart Tolle.', price: 11.25 }),
    ])

    const [kate, nate, dan, rain] = await Promise.all([
      createUser({ username: 'kate', password: 'k@123', isAdmin: true }),
      createUser({ username: 'nate', password: 'n@123', isAdmin: false }),
      createUser({ username: 'dan', password: 'd@123', isAdmin: false }),
      createUser({ username: 'ran', password: 'r@123', isAdmin: false }),
    ])

    const [review1, review2, review3, review4, review5] = await Promise.all([
      createReview({ productId: book1.id, userId: kate.id, rating: 5, reviewText: 'I love this book!' }),
      createReview({ productId: book2.id, userId: nate.id, rating: 4, reviewText: 'This book is great for anyone who wants to be creative.' }),
      createReview({ productId: book3.id, userId: dan.id, rating: 3, reviewText: 'This book is ok, but not great.' }),
    ])

    console.log('Database seeded successfully');
}



module.exports = {
  client,
   seed
}
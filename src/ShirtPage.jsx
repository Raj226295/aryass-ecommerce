import ProductCard from './ProductCard'


const shirtImages = [
  '/shirts/pexels-photo-4100506.jpeg',
  '/shirts/pexels-photo-34970543.jpeg',
  '/shirts/pexels-photo-17713805.jpeg',
  '/shirts/pexels-photo-1926769.jpeg',
  '/shirts/pexels-photo-5572092.jpeg',
  '/shirts/pexels-photo-35115836.jpg',
  '/shirts/pexels-photo-21198706.jpeg',
  '/shirts/pexels-photo-34857597.jpeg',
  '/shirts/pexels-photo-27383837.jpg',
  '/shirts/pexels-photo-15343587.jpeg',
  '/shirts/pexels-photo-1380591.jpeg',
  '/shirts/pexels-photo-3972533.jpeg',
  '/shirts/pexels-photo-26821565.jpeg',
  '/shirts/pexels-photo-37232770.jpeg',
  '/shirts/pexels-photo-32624882.jpeg',
  '/shirts/pexels-photo-15590109.jpeg',
  '/shirts/pexels-photo-4100505.jpeg',
  '/shirts/pexels-photo-32031990.jpeg',
  '/shirts/pexels-photo-16218193.jpeg',
  '/shirts/pexels-photo-34974321.jpeg',
]

function ShirtPage({ onChooseOption }) {
  return (
    <main className="collection-page" id="collection">

      <section className="collection-hero">
        <p className="collection-label">
          Premium Shirt Collection
        </p>

        <h1>Shirt</h1>

        <p className="collection-text">
          Explore stylish premium shirts with luxury styling.
        </p>
      </section>

      <section className="product-grid">
        {shirtImages.map((image, index) => (

  <ProductCard
    key={index}

    product={{
      id: index + 1,

      name: `Premium Shirt ${index + 1}`,

      image: image,

      price: '2,499.00',

      rating: 5,

      reviews: 12,
    }}

    onChooseOption={onChooseOption}
  />

))}
      </section>

    </main>
  )
}

export default ShirtPage